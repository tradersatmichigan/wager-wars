from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver
from .models import Player

@receiver(user_logged_in)
def create_player_on_first_login(sender, request, user, **kwargs):
    if not hasattr(user, 'player'):
        Player.objects.create(user=user)
