from django.urls import include, path, re_path

from core import views

from . import api

urlpatterns = [
    path("login/", include("django.contrib.auth.urls")),
    path("signup/", views.SignUpView.as_view(), name="signup"),
    path("", views.render_url, name="home"),
    re_path(
        r"^(?!api|signup|accounts).*$",
        views.render_url,
        name="index",
    ),
  
]
