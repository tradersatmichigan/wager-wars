from django.urls import include, path, re_path

from core import views

from . import api

urlpatterns = [
    path("login/", include("django.contrib.auth.urls")),
    path("signup/", views.SignUpView.as_view(), name="signup"),
    path("betting1/", views.render_betting1, name="betting1"),
    path("betting2/", views.render_betting2, name="betting2"),
    path("betting3/", views.render_betting3, name="betting3"),
    path("", views.render_url, name="home"),
    re_path(
        r"^(?!api|signup|accounts).*$",
        views.render_url,
        name="index",
    ),
  
]
