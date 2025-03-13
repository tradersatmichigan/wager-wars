from django.urls import path, re_path
from django.contrib.auth.views import LoginView

from core import views

urlpatterns = [
    path("login/", LoginView.as_view(template_name="login.html"), name="login"),
    path("", views.render_url, name="home"),

    # Player/client endpoints
    path('api/game/state/', views.game_state, name='game_state'),
    path('api/bets/current/', views.current_bet, name='current_bet'),
    path('api/bets/place/', views.place_bet, name='place_bet'),
    path('api/teams/bets/', views.team_bets_summary, name='team_bets_summary'),
    path('api/teams/leaderboard/', views.team_leaderboard, name='team_leaderboard'),
    path('api/teams/performance/', views.team_performance, name='team_performance'),
    path('api/teams/stack/', views.get_team_stack, name='team_stack'),

    # Admin endpoints
    path('api/admin/rounds/', views.list_rounds, name='list_rounds'),
    path('api/admin/rounds/start/', views.start_round, name='start_round'),
    path('api/admin/rounds/simulate/', views.simulate_round, name='simulate_round'),
    path('api/admin/game/end/', views.end_game, name='end_game'),

    path('api/isadmin/', views.check_admin, name='isadmin'),

    re_path(
        r"^(?!api|login|accounts).*$",
        views.render_url,
        name="index",
    ),
]
