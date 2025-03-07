from django.contrib.auth.forms import BaseUserCreationForm
from django.http import HttpResponse, HttpRequest, HttpResponseRedirect
from django.urls import reverse_lazy, reverse
from django.views.generic import CreateView
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.utils import timezone

def index(_: HttpRequest) -> HttpResponse:
    msg = b"Hello, world. You're at the polls index."
    return HttpResponse(msg)

class SignUpView(CreateView):
    form_class = BaseUserCreationForm
    success_url = reverse_lazy("login")
    template_name = "signup.html"

@login_required
def render_url(request) -> HttpResponse:
    return render(request, "index.html")

@login_required
def render_betting1(request) -> HttpResponse:
    return render(request, "betting1.html")

@login_required
def render_betting2(request) -> HttpResponse:
    return render(request, "betting2.html")

@login_required
def render_betting3(request) -> HttpResponse:
    return render(request, "betting3.html")

