import json
import random
from decimal import Decimal
from functools import wraps
import time

from django.http import HttpRequest, JsonResponse, HttpResponse
from django.views.decorators.http import require_http_methods
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.db import transaction
from django.core.cache import cache
from django.utils import timezone
from django.db.models import Prefetch, Sum, Count
from django.shortcuts import render
from django.db.models import Sum

from .models import (
    Game, 
    Round, 
    Player, 
    Team, 
    Bet, 
    RoundPhaseEnum, 
    RoundStatusEnum
)

@login_required
def render_url(request) -> HttpResponse:
    return render(request, "index.html")

@login_required
def check_admin(request) -> JsonResponse:
    is_admin = getattr(request.user, "player", None)
    if is_admin is None:
        return JsonResponse({"error": "Player profile not found"}, status=404)

    return JsonResponse({"is_admin": is_admin.is_admin})

def admin_required(view_func):
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if not request.user.player.is_admin:
            return JsonResponse({"error": "Admin access required"})
        return view_func(request, *args, **kwargs)
    return _wrapped_view

@require_http_methods(["GET"])
@csrf_exempt
def game_state(request: HttpRequest):
    """
    Main lightweight polling endpoint for all clients.
    Returns current game state, round information, phase, and timing data.
    """
    player = request.user.player
    player_team_id = player.team_id if player.team else None
    
    # Try to get shared game state from cache
    shared_cache_key = 'shared_game_state'
    shared_data = cache.get(shared_cache_key)
    
    if not shared_data:
        # Cache miss - generate the shared game state
        game = Game.objects.filter(is_active=True).first()
        if not game:
            return JsonResponse({
                'status': 'no_active_game',
                'timestamp': timezone.now().timestamp(),
                'current_stack': float(player.current_stack),
                'team_id': player_team_id
            })
        
        # Check if the game has been explicitly ended by admin
        game_ended = cache.get(f'game_ended_{game.id}', False)
        
        # Initialize shared data with common fields
        shared_data = {
            'game_id': game.id,
            'status': 'active',
            'server_timestamp': timezone.now().timestamp(),
            'current_round_number': game.current_round_number,
            'team_name': request.user.player.team.name
        }
        
        # Check if game is currently in an active round
        if game.current_round_number > 0:
            try:
                # Try to get an active round
                current_round = Round.objects.select_related('game').get(
                    game=game, 
                    number=game.current_round_number,
                    status=RoundStatusEnum.ACTIVE
                )
                
                # Calculate current phase and time remaining
                current_phase = current_round.get_current_phase()
                time_remaining = current_round.time_remaining_in_phase()
                
                # Update phase in database if it has changed
                if current_phase != current_round.current_phase and current_phase is not None:
                    current_round.current_phase = current_phase
                    current_round.save(update_fields=['current_phase'])
                
                # Add round info to response
                shared_data.update({
                    'round_id': current_round.id,
                    'round_number': current_round.number,
                    'question': current_round.question,
                    'probability': current_round.probability,
                    'multiplier': current_round.multiplier,
                    'current_phase': current_phase,
                    'phase_duration': current_round.phase_duration,
                    'time_remaining': time_remaining,
                    'status': RoundStatusEnum(current_round.status).name.lower(),
                    'result': current_round.result,
                    'round_start_time': current_round.start_time.timestamp() if current_round.start_time else None,
                })
            except Round.DoesNotExist:
                # No active round - check if it's completed
                try:
                    completed_round = Round.objects.get(
                        game=game,
                        number=game.current_round_number,
                        status=RoundStatusEnum.COMPLETED
                    )
                    
                    # Check if there are any pending rounds left
                    pending_rounds_exist = Round.objects.filter(
                        game=game,
                        status=RoundStatusEnum.PENDING
                    ).exists()
                    
                    if not pending_rounds_exist and game_ended:
                        # No more pending rounds AND admin clicked End Game - game is over
                        completed_rounds = Round.objects.filter(
                            game=game,
                            status=RoundStatusEnum.COMPLETED
                        ).count()
                        
                        print(f"Game completed - admin ended game after round {game.current_round_number}")
                        shared_data.update({
                            'game_completed': True,
                            'rounds_completed': completed_rounds,
                        })
                    else:
                        # Either more rounds to go OR admin hasn't ended game yet
                        shared_data.update({
                            'round_completed': True,
                            'round_number': completed_round.number,
                            'waiting_for_next_round': True,
                            'final_round': not pending_rounds_exist,  # Add flag to indicate this is the final round
                            'current_phase': completed_round.current_phase,
                            'result': completed_round.result,
                        })
                except Round.DoesNotExist:
                    # Round doesn't exist at all
                    shared_data.update({
                        'round_error': True,
                        'error_message': f"Round {game.current_round_number} not found"
                    })
        else:
            # No current round (round number is 0)
            # Check if there are any pending rounds
            next_round = Round.objects.filter(
                game=game,
                status=RoundStatusEnum.PENDING
            ).order_by('number').first()
            
            if next_round:
                # Game hasn't started yet - waiting for first round
                shared_data.update({
                    'waiting_for_first_round': True,
                    'next_round_number': next_round.number,
                })
            else:
                # No pending rounds
                completed_rounds = Round.objects.filter(
                    game=game,
                    status=RoundStatusEnum.COMPLETED
                ).count()
                
                if completed_rounds > 0 and game_ended:
                    # Game is over AND admin has clicked End Game
                    print(f"Game completed - admin ended game with {completed_rounds} completed rounds")
                    shared_data.update({
                        'game_completed': True,
                        'rounds_completed': completed_rounds,
                    })
                else:
                    # Game hasn't started or admin hasn't ended
                    shared_data.update({
                        'waiting_for_first_round': True,
                        'next_round_number': 1,
                    })
        
        # Cache the shared state for 2 seconds
        cache.set(shared_cache_key, shared_data, 2)
    
    # Now add player-specific data
    response_data = shared_data.copy()
    response_data['current_stack'] = float(player.current_stack)
    response_data['team_id'] = player_team_id
    
    return JsonResponse(response_data)

@require_http_methods(["GET"])
@csrf_exempt
def current_bet(request: HttpRequest):
    """Get the player's current bet for the active round."""
    game = Game.objects.filter(is_active=True).first()
    if not game or game.current_round_number == 0:
        return JsonResponse({'bet': None})
    
    try:
        current_round = Round.objects.get(
            game=game,
            number=game.current_round_number
        )
        
        try:
            bet = Bet.objects.get(
                player=request.user.player,
                round=current_round
            )
            
            return JsonResponse({
                'bet': {
                    'amount': float(bet.amount),
                }
            })
        except Bet.DoesNotExist:
            return JsonResponse({'bet': None})
    except Round.DoesNotExist:
        return JsonResponse({'bet': None})

@require_http_methods(["POST"])
@csrf_exempt
def place_bet(request: HttpRequest):
    """
    Place or update a bet for the current round.
    """
    try:
        data = json.loads(request.body)
        amount = data.get('amount')
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    
    # Validate inputs
    try:
        amount = Decimal(str(amount))
        if amount < 0:
            return JsonResponse({'error': 'Amount cannot be negative'}, status=400)
    except (ValueError, TypeError):
        return JsonResponse({'error': 'Invalid amount'}, status=400)
    
    # Get current game and round
    game = Game.objects.filter(is_active=True).first()
    if not game or game.current_round_number == 0:
        return JsonResponse({'error': 'No active round'}, status=400)
    
    current_round = Round.objects.get(
        game=game,
        number=game.current_round_number
    )
    
    # Check if betting is allowed in current phase
    current_phase = current_round.get_current_phase()
    if current_phase not in [RoundPhaseEnum.INITIAL_BETTING, RoundPhaseEnum.FINAL_BETTING]:
        return JsonResponse({'error': 'Betting not allowed in current phase'}, status=400)
    
    player = request.user.player
    
    # Validate bet amount against current stack
    if amount > player.current_stack:
        return JsonResponse({'error': 'Insufficient funds'}, status=400)
    
    # Create or update bet (or delete if amount is 0)
    with transaction.atomic():
        if amount > 0:
            bet, created = Bet.objects.update_or_create(
                    player=player,
                    round=current_round,
                    defaults={
                        'amount': amount,
                        }
                    )
            bet_id = bet.id
            bet_amount = float(bet.amount)
        else:
            # If amount is 0, delete any existing bet
            Bet.objects.filter(player=player, round=current_round).delete()
            bet_id = None
            bet_amount = 0

    return JsonResponse({
        'success': True,
        'bet_id': bet_id,
        'amount': bet_amount,
    })

@require_http_methods(["GET"])
@csrf_exempt
def team_bets_summary(request: HttpRequest):
    """
    Get a summary of all team bets for the current round.
    Available during information phase.
    """
    game = Game.objects.filter(is_active=True).first()
    if not game or game.current_round_number == 0:
        return JsonResponse({'error': 'No active round'}, status=400)
        
    current_round = Round.objects.get(
        game=game,
        number=game.current_round_number
    )
    
    # Try to get from cache first
    cache_key = f'team_bets_round_{current_round.id}'
    cached_data = cache.get(cache_key)
    
    if cached_data:
        return JsonResponse(cached_data)
    
    # Get all teams with prefetch_related to reduce queries
    teams = Team.objects.all().prefetch_related(
        Prefetch(
            'players',
            queryset=Player.objects.select_related('user')
        )
    )
    
    # Get ALL bets for this round in a single efficient query
    all_bets = Bet.objects.filter(
        round=current_round
    ).select_related('player__user')
    
    # Create a mapping of player_id to bet for quick lookup
    player_bet_map = {bet.player_id: bet for bet in all_bets}
    
    results = []
    for team in teams:
        team_bets = []
        for player in team.players.all():
            bet = player_bet_map.get(player.id)
            player_bet = {
                'player_name': player.user.username,
                'amount': float(bet.amount) if bet else 0,
            }
            team_bets.append(player_bet)
            
        results.append({
            'team_name': team.name,
            'team_id': team.id,
            'bets': team_bets,
        })
    
    response_data = {
        'timestamp': timezone.now().timestamp(),
        'round_id': current_round.id,
        'teams': results,
    }
    
    # Cache the results
    cache.set(cache_key, response_data, 60 * 10)  # Cache for 10 minutes
    
    return JsonResponse(response_data)


@require_http_methods(["GET"])
@csrf_exempt
def team_leaderboard(request: HttpRequest):
    """Get the current team leaderboard."""
    # Get all teams with aggregated stack values and player count
    teams = Team.objects.annotate(
        total_stack=Sum('players__current_stack'),
        player_count=Count('players')
    ).prefetch_related(
        Prefetch(
            'players',
            queryset=Player.objects.select_related('user')
        )
    )
    
    # Calculate average stack for each team and sort
    teams = sorted(
        teams,
        key=lambda team: team.total_stack / team.player_count if team.player_count > 0 else 0,
        reverse=True
    )
    
    results = []
    for team in teams:
        players = Player.objects.filter(team=team).select_related('user')
        avg_stack = team.total_stack / team.player_count if team.player_count > 0 else 0
        
        results.append({
            'team_name': team.name,
            'team_id': team.id,
            'total_stack': float(team.total_stack),
            'avg_stack': float(avg_stack),
            'player_count': team.player_count,
            'players': [
                {
                    'player_name': player.user.username,
                    'current_stack': float(player.current_stack),
                }
                for player in players
            ]
        })
    
    return JsonResponse({
        'timestamp': timezone.now().timestamp(),
        'teams': results,
    })


@require_http_methods(["GET"])
@csrf_exempt
def team_performance(request: HttpRequest):
    """Get team performance history and current round results."""
    player = request.user.player
    team = player.team
    
    print(f"Team performance requested by {player.user.username} (team: {team.name if team else 'None'})")
    
    # Get current game and latest round
    game = Game.objects.filter(is_active=True).first()
    if not game:
        print("No active game found")
        return JsonResponse({'error': 'No active game'}, status=400)
    
    # Only get COMPLETED rounds with results
    latest_round = Round.objects.filter(
        game=game,
        status=RoundStatusEnum.COMPLETED,
        result__isnull=False  # Must have a result
    ).order_by('-number').first()
    
    if not latest_round:
        print("No completed rounds with results found")
        return JsonResponse({'error': 'No completed rounds with results yet'}, status=400)
    
    print(f"Latest completed round: #{latest_round.number}, result: {latest_round.result}")
    
    # Get team members and their bets for the latest round
    team_members = Player.objects.filter(team=team)
    team_bets = Bet.objects.filter(
        player__in=team_members,
        round=latest_round
    ).select_related('player__user')
    
    print(f"Found {team_members.count()} team members and {team_bets.count()} bets for the latest round")
    
    # Calculate individual P/L for the round
    members_data = []
    for member in team_members:
        bet = next((b for b in team_bets if b.player_id == member.id), None)
        bet_amount = float(bet.amount) if bet else 0
        
        if bet and latest_round.result:
            # Won bet
            profit = bet_amount * (latest_round.multiplier - 1)
            result = 'won'
        elif bet:
            # Lost bet
            profit = -bet_amount
            result = 'lost'
        else:
            # No bet
            profit = 0
            result = 'no bet'
            
        members_data.append({
            'player_name': member.user.username,
            'bet_amount': bet_amount,
            'profit': profit,
            'result': result
        })
    
    # Get historical team stack data (for all completed rounds)
    completed_rounds = Round.objects.filter(
        game=game,
        status=RoundStatusEnum.COMPLETED
    ).order_by('number')
    
    print(f"Found {completed_rounds.count()} completed rounds for historical data")
    
    # Calculate team stack after each round
    historical_data = []
    team_stack = sum(float(member.starting_stack) for member in team_members)
    
    for round_obj in completed_rounds:
        # Get team bets for this round
        round_bets = Bet.objects.filter(
            player__team=team,
            round=round_obj
        )
        
        # Calculate P/L for this round
        round_profit = 0
        for bet in round_bets:
            if round_obj.result:
                # Won bet
                round_profit += float(bet.amount) * (round_obj.multiplier - 1)
            else:
                # Lost bet
                round_profit -= float(bet.amount)
        
        team_stack += round_profit
        
        historical_data.append({
            'round_number': round_obj.number,
            'team_stack': team_stack,
            'profit': round_profit
        })
    
    # Calculate total team P/L for current round
    current_round_profit = sum(member['profit'] for member in members_data)
    
    print(f"Returning team performance data with {len(historical_data)} historical data points")
    
    response_data = {
        'team_name': team.name,
        'team_id': team.id,
        'current_round': latest_round.number,
        'round_result': latest_round.result,
        'round_profit': current_round_profit,
        'team_members': members_data,
        'historical_data': historical_data
    }
    
    return JsonResponse(response_data)

@require_http_methods(["GET"])
@csrf_exempt
@admin_required
def list_rounds(request: HttpRequest):
    """Get a list of all rounds for the admin (admin only)."""
    # Admin check should be performed by middleware
    game = Game.objects.filter(is_active=True).first()
    if not game:
        return JsonResponse({'error': 'No active game'}, status=400)
    
    rounds = Round.objects.filter(game=game).order_by('number')
    
    results = []
    for round_obj in rounds:
        results.append({
            'id': round_obj.id,
            'number': round_obj.number,
            'question': round_obj.question,
            'probability': round_obj.probability,
            'multiplier': round_obj.multiplier,
            'status': RoundStatusEnum(round_obj.status).name,
            'result': round_obj.result,
        })
    
    return JsonResponse({
        'rounds': results,
        'total_rounds': len(results),
        'pending_rounds': sum(1 for r in results if r['status'] == 'PENDING'),
        'completed_rounds': sum(1 for r in results if r['status'] == 'COMPLETED'),
        'current_round': game.current_round_number,
    })

@require_http_methods(["POST"])
@csrf_exempt
@admin_required
def start_round(request: HttpRequest):
    """Start the next round (admin only)."""
    # Admin check should be performed by middleware
    game = Game.objects.filter(is_active=True).first()
    if not game:
        return JsonResponse({'error': 'No active game'}, status=400)
    
    # Check if any round is currently active
    active_round = Round.objects.filter(
        game=game,
        status=RoundStatusEnum.ACTIVE
    ).first()
    
    if active_round:
        return JsonResponse({'error': 'Cannot start a new round while another is active'}, status=400)
    
    # Determine which round to start next
    if game.current_round_number == 0:
        # First round
        next_round_number = 1
    else:
        # Check if the current round is completed
        try:
            current_round = Round.objects.get(
                game=game,
                number=game.current_round_number
            )
            
            if current_round.status != RoundStatusEnum.COMPLETED:
                return JsonResponse({
                    'error': f'Current round {game.current_round_number} is not completed'
                }, status=400)
                
            next_round_number = game.current_round_number + 1
        except Round.DoesNotExist:
            return JsonResponse({
                'error': f'Round {game.current_round_number} not found'
            }, status=400)
    
    # Get the next round
    try:
        next_round = Round.objects.get(
            game=game,
            number=next_round_number,
            status=RoundStatusEnum.PENDING
        )
    except Round.DoesNotExist:
        return JsonResponse({
            'error': f'No pending round with number {next_round_number}'
        }, status=400)
    
    # Update game current round
    game.current_round_number = next_round_number
    game.save()
    
    # Activate the round
    next_round.status = RoundStatusEnum.ACTIVE
    next_round.start_time = timezone.now()
    next_round.current_phase = RoundPhaseEnum.INITIAL_BETTING
    next_round.save()
    
    # Clear any cached data
    cache.delete('shared_game_state')
    cache.delete_pattern('team_bets_round_*')
    
    return JsonResponse({
        'success': True,
        'round_id': next_round.id,
        'round_number': next_round.number,
        'start_time': next_round.start_time.timestamp(),
    })

@require_http_methods(["POST"])
@csrf_exempt
@admin_required
def simulate_round(request: HttpRequest):
    """Run the simulation for the current round (admin only)."""
    # Admin check should be performed by middleware
    game = Game.objects.filter(is_active=True).first()
    if not game:
        return JsonResponse({'error': 'No active game'}, status=400)
    
    # Get the current active round
    current_round = Round.objects.filter(
        game=game,
        number=game.current_round_number,
        status=RoundStatusEnum.ACTIVE
    ).first()
    
    if not current_round:
        return JsonResponse({'error': 'No active round to simulate'}, status=400)
    
    # Check if round is in results phase
    current_phase = current_round.get_current_phase()
    if current_phase != RoundPhaseEnum.RESULTS:
        return JsonResponse({
            'error': 'Cannot simulate round until all betting phases are complete'
        }, status=400)
    
    # Run the simulation
    success = random.random() < current_round.probability
    
    with transaction.atomic():
        # Mark round as completed
        current_round.result = success
        current_round.status = RoundStatusEnum.COMPLETED
        current_round.save()
        
        # Process all player bets
        bets = Bet.objects.filter(round=current_round).select_related('player')
        
        for bet in bets:
            player = bet.player
            
            # All bets are on success, so players win if the result is success
            if success:
                winnings = bet.amount * Decimal(str(current_round.multiplier))
                player.current_stack += winnings - bet.amount
            else:
                player.current_stack -= bet.amount
            
            player.save()
    
    cache.delete('shared_game_state')
    cache.delete_pattern('team_bets_round_*')
    time.sleep(0.5)

    return JsonResponse({
        'success': True,
        'round_id': current_round.id,
        'round_number': current_round.number,
        'result': success,
    })

@require_http_methods(["POST"])
@csrf_exempt
@admin_required
def end_game(request: HttpRequest):
    """End the current game and mark it as completed (admin only)."""
    game = Game.objects.filter(is_active=True).first()
    if not game:
        return JsonResponse({'error': 'No active game'}, status=400)
    
    # Mark all pending rounds as completed with null result
    with transaction.atomic():
        Round.objects.filter(
            game=game,
            status=RoundStatusEnum.PENDING
        ).update(
            status=RoundStatusEnum.COMPLETED,
            result=None,
            current_phase=RoundPhaseEnum.RESULTS
        )
    
    # Set a special cache key to indicate admin has clicked "End Game"
    # This is the key change to fix the issue
    cache.set(f'game_ended_{game.id}', True, 60 * 60 * 24)  # Keep for 24 hours
    
    # Clear game state cache to force refresh
    cache.delete('shared_game_state')
    cache.delete_pattern('team_bets_round_*')
    
    return JsonResponse({
        'success': True,
        'message': 'Game has been ended successfully'
    })

@require_http_methods(["POST"])
@csrf_exempt
def get_team_stack(request: HttpRequest):
    player = request.user.player
    team = player.team
    
    if not team:
        return JsonResponse({
            'success': False,
            'error': 'Player is not part of a team'
        }, status=400)
        
    # Calculate the sum of current_stack for all players in the team
    stack = Player.objects.filter(team=team).aggregate(
        total_stack=Sum('current_stack')
    )['total_stack'] or 0
    
    return JsonResponse({
        'success': True,
        'stack': stack
    })
