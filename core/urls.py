from django.urls import include, path, re_path
from django.contrib.auth.views import LoginView

from core import views

from . import api

urlpatterns = [
    path("login/", LoginView.as_view(template_name="login.html"), name="login"),
    path("", views.render_url, name="home"),
    re_path(
        r"^(?!api|login|accounts).*$",
        views.render_url,
        name="index",
    ),
]
