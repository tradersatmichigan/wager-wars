# core/admin.py
from django.contrib import admin
from django.contrib import messages
from django.db import transaction
from django.db.models import F
from django.core.cache import cache
from django.utils.html import format_html

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
    list_display = ('name', 'player_count')
    search_fields = ('name',)
    
    def player_count(self, obj):
        return obj.players.count()
    player_count.short_description = 'Players'

@admin.register(Bet)
class BetAdmin(admin.ModelAdmin):
    list_display = ('id', 'player', 'round', 'amount')
    list_filter = ('round__game', 'round')
    search_fields = ('player__user__username',)
