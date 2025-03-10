from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class RoundPhaseEnum(models.IntegerChoices):
    INITIAL_BETTING = 0  # First 30 seconds
    INFORMATION = 1      # Middle 30 seconds - discussion
    FINAL_BETTING = 2    # Last 30 seconds
    RESULTS = 3          # Between rounds, showing results

class RoundStatusEnum(models.IntegerChoices):
    PENDING = 0          # Not yet started
    ACTIVE = 1           # Currently running
    COMPLETED = 2        # Finished

class Team(models.Model):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        if self.name:
            return self.name
    
    class Meta:
        indexes = [models.Index(fields=['name'])]

class Player(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    team = models.ForeignKey(Team, related_name='players', on_delete=models.SET_NULL, null=True, blank=True)
    starting_stack = models.DecimalField(max_digits=10, decimal_places=2, default=1000.00)
    current_stack = models.DecimalField(max_digits=10, decimal_places=2, default=1000.00)
    is_admin = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.user.username} ({str(self.team)}))"
    
    class Meta:
        indexes = [
            models.Index(fields=['is_admin']),
            models.Index(fields=['team']),
        ]

class Game(models.Model):
    name = models.CharField(max_length=150)
    is_active = models.BooleanField(default=True)
    current_round_number = models.PositiveIntegerField(default=0)  # Track which round we're on
    
    def __str__(self):
        return self.name
    
    class Meta:
        indexes = [models.Index(fields=['is_active'])]

class Round(models.Model):
    game = models.ForeignKey(Game, related_name='rounds', on_delete=models.CASCADE)
    number = models.PositiveIntegerField()
    question = models.CharField(max_length=150)
    probability = models.FloatField()
    multiplier = models.FloatField()
    
    # Round state fields
    status = models.IntegerField(
        choices=RoundStatusEnum.choices,
        default=RoundStatusEnum.PENDING
    )
    start_time = models.DateTimeField(null=True, blank=True)
    phase_duration = models.PositiveIntegerField(default=5)  # Duration in seconds
    current_phase = models.IntegerField(
        choices=RoundPhaseEnum.choices,
        default=RoundPhaseEnum.INITIAL_BETTING
    )
    result = models.BooleanField(null=True, blank=True)  # True for success, False for failure
    
    def __str__(self):
        return f"Round {self.number}"
    
    def get_current_phase(self):
        """Calculate current phase based on time elapsed since round start"""
        if self.status == RoundStatusEnum.PENDING:
            return None
            
        if self.status == RoundStatusEnum.COMPLETED:
            return RoundPhaseEnum.RESULTS
            
        if not self.start_time:
            return RoundPhaseEnum.INITIAL_BETTING
            
        now = timezone.now()
        elapsed_seconds = (now - self.start_time).total_seconds()
        
        if elapsed_seconds >= self.phase_duration * 3:
            return RoundPhaseEnum.RESULTS
            
        return RoundPhaseEnum(int(elapsed_seconds // self.phase_duration))
    
    def time_remaining_in_phase(self):
        """Calculate seconds remaining in current phase"""
        if self.status != RoundStatusEnum.ACTIVE or not self.start_time:
            return 0
            
        now = timezone.now()
        elapsed_seconds = (now - self.start_time).total_seconds()
        current_phase = int(elapsed_seconds // self.phase_duration)
        
        if current_phase >= 3:
            return 0
            
        next_phase_start = (current_phase + 1) * self.phase_duration
        return max(0, next_phase_start - elapsed_seconds)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['game', 'number'], 
                name='unique_round_number_per_game'
            )
        ]
        indexes = [
            models.Index(fields=['game', 'number']),
            models.Index(fields=['status']),
            models.Index(fields=['game', 'number', 'status']),
            models.Index(fields=['game', 'status'])
        ]
        ordering = ['number']

class Bet(models.Model):
    player = models.ForeignKey(Player, related_name='bets', on_delete=models.CASCADE)
    round = models.ForeignKey(Round, related_name='bets', on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    
    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['player', 'round'], 
                name='unique_player_round_bet'
            )
        ]
        indexes = [
            models.Index(fields=['round']),
            models.Index(fields=['player']),
        ]
