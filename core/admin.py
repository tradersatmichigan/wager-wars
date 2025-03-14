# core/admin.py
from django.contrib import admin
from django.contrib import messages
from django.db import transaction
from django.db.models import F
from django.core.cache import cache
from django.utils.html import format_html

import random
import math
from django.urls import path
from django.http import HttpResponseRedirect
from django.contrib import messages

from .models import Game, Round, Player, Team, Bet, RoundStatusEnum, RoundPhaseEnum

class RoundInline(admin.TabularInline):
    model = Round
    fields = ('number', 'question', 'probability', 'multiplier', 'status')
    readonly_fields = ('number',)
    extra = 0

@admin.register(Game)
class GameAdmin(admin.ModelAdmin):
    list_display = ('name', 'is_active', 'current_round_number', 'rounds_count', 'reset_button')
    list_filter = ('is_active',)
    inlines = [RoundInline]
    actions = ['reset_game_action']

    def rounds_count(self, obj):
        return obj.rounds.count()
    rounds_count.short_description = 'Total Rounds'

    def reset_button(self, obj):
        """Add a custom reset button per game"""
        return format_html(
            '<a class="button" href="{}">Reset Game</a>',
            f'/admin/core/game/{obj.id}/reset/'
        )
    reset_button.short_description = 'Reset'
    reset_button.allow_tags = True

    def reset_game_action(self, request, queryset):
        """Reset selected games to initial state"""
        reset_count = 0
        
        for game in queryset:
            with transaction.atomic():
                # Reset all players to starting balance
                Player.objects.all().update(
                    current_stack=F('starting_stack')
                )
                
                # Reset all rounds to PENDING
                Round.objects.filter(game=game).update(
                    status=RoundStatusEnum.PENDING,
                    result=None,
                    start_time=None,
                    current_phase=RoundPhaseEnum.INITIAL_BETTING
                )
                
                # Reset game to initial state
                game.current_round_number = 0
                game.save()
                
                # Clear all bets
                Bet.objects.filter(round__game=game).delete()
                
                reset_count += 1
        
        # Clear all caches
        cache.clear()
        
        messages.success(request, f'Successfully reset {reset_count} games.')
    reset_game_action.short_description = "Reset selected games"

    def get_urls(self):
        from django.urls import path
        urls = super().get_urls()
        custom_urls = [
            path(
                '<int:game_id>/reset/',
                self.admin_site.admin_view(self.reset_game_view),
                name='game-reset',
            ),
        ]
        return custom_urls + urls
    
    def reset_game_view(self, request, game_id):
        """Handle the reset button action"""
        from django.shortcuts import redirect, get_object_or_404
        
        game = get_object_or_404(Game, id=game_id)
        
        with transaction.atomic():
            # Reset all players to starting balance
            Player.objects.all().update(
                current_stack=F('starting_stack')
            )
            
            # Reset all rounds to PENDING
            Round.objects.filter(game=game).update(
                status=RoundStatusEnum.PENDING,
                result=None,
                start_time=None,
                current_phase=RoundPhaseEnum.INITIAL_BETTING
            )
            
            # Reset game to initial state
            game.current_round_number = 0
            game.save()
            
            # Clear all bets
            Bet.objects.filter(round__game=game).delete()
        
        # Clear all caches
        cache.clear()
        
        messages.success(request, f'Game "{game.name}" has been reset successfully.')
        return redirect('admin:core_game_changelist')

@admin.register(Round)
class RoundAdmin(admin.ModelAdmin):
    list_display = ('id', 'game', 'number', 'question', 'status', 'result')
    list_filter = ('game', 'status')
    search_fields = ('question',)
    readonly_fields = ('start_time',)

@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    list_display = ('user', 'team', 'starting_stack', 'current_stack', 'is_admin')
    list_filter = ('team', 'is_admin')
    search_fields = ('user__username',)
    actions = ['reset_players_stack']
    
    def reset_players_stack(self, request, queryset):
        """Reset selected players' stacks to their starting value"""
        updated = queryset.update(current_stack=F('starting_stack'))
        messages.success(request, f'Successfully reset {updated} players to their starting stack.')
    reset_players_stack.short_description = "Reset selected players' stacks"


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'player_count', 'create_teams_button')
    search_fields = ('name',)
    actions = ['create_random_teams_action']
    
    def player_count(self, obj):
        return obj.players.count()
    player_count.short_description = 'Players'
    
    def create_teams_button(self, obj=None):
        """Add a custom button to create random teams"""
        return format_html(
            '<a class="button" href="{}">Create Random Teams</a>',
            '/admin/core/team/create-teams/'
        )
    create_teams_button.short_description = 'Create Teams'
    create_teams_button.allow_tags = True
    
    def get_urls(self):
        urls = super().get_urls()
        custom_urls = [
            path(
                'create-teams/',
                self.admin_site.admin_view(self.create_teams_view),
                name='create-random-teams',
            ),
        ]
        return custom_urls + urls
    
    def create_teams_view(self, request):
        """Handle the create teams button action"""
        self.create_random_teams(request)
        return HttpResponseRedirect('/admin/core/team/')
    
    def create_random_teams_action(self, request, queryset):
        """Create random teams from unassigned players"""
        self.create_random_teams(request)
    create_random_teams_action.short_description = "Create random teams from unassigned players"
    
    def create_random_teams(self, request):
        """Logic to create random teams of optimal size"""
        with transaction.atomic():
            # Get all players without a team
            unassigned_players = Player.objects.filter(team__isnull=True, is_admin=False)
            total_players = unassigned_players.count()
            
            if total_players == 0:
                messages.warning(request, "No unassigned players found to create teams.")
                return
            
            # Find optimal team size (6, 7, or 8)
            best_size = self.find_optimal_team_size(total_players)
            num_teams = math.ceil(total_players / best_size)
            
            # Delete existing empty teams (optional)
            Team.objects.filter(players__isnull=True).delete()
            
            # Create new teams
            new_teams = []
            for i in range(num_teams):
                new_team = Team.objects.create(name=f"Team {i+1}")
                new_teams.append(new_team)
            
            # Shuffle players and assign to teams
            player_list = list(unassigned_players)
            random.shuffle(player_list)
            
            for i, player in enumerate(player_list):
                team_index = i % num_teams
                player.team = new_teams[team_index]
                player.save()
            
            messages.success(
                request, 
                f"Successfully created {num_teams} teams with {best_size} players each "
                f"(total {total_players} players assigned)."
            )
    
    def find_optimal_team_size(self, total_players):
        """
        Find the optimal team size (6, 7, or 8) to ensure most even distribution
        Returns the team size that minimizes the standard deviation of team sizes
        """
        if total_players == 0:
            return 6  # Default if no players
            
        options = {}
        for size in [6, 7, 8]:
            num_teams = math.ceil(total_players / size)
            # Calculate how many players would be in each team
            team_sizes = []
            remaining = total_players
            
            for _ in range(num_teams):
                team_size = min(size, remaining)
                team_sizes.append(team_size)
                remaining -= team_size
            
            # Calculate standard deviation of team sizes
            avg = total_players / num_teams
            variance = sum((s - avg) ** 2 for s in team_sizes) / num_teams
            std_dev = math.sqrt(variance)
            
            options[size] = {
                'num_teams': num_teams,
                'std_dev': std_dev,
                'team_sizes': team_sizes
            }
        
        # Choose the option with lowest standard deviation (most even teams)
        return min(options.items(), key=lambda x: x[1]['std_dev'])[0]

@admin.register(Bet)
class BetAdmin(admin.ModelAdmin):
    list_display = ('id', 'player', 'round', 'amount')
    list_filter = ('round__game', 'round')
    search_fields = ('player__user__username',)
