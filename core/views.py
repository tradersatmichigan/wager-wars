from django.contrib.auth.forms import BaseUserCreationForm
from django.http import HttpResponse, HttpRequest, HttpResponseRedirect
from django.urls import reverse_lazy, reverse
from django.views.generic import CreateView
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.utils import timezone

# def index(_: HttpRequest) -> HttpResponse:
#     msg = b"Hello, world. You're at the polls index."
#     return HttpResponse(msg)

@login_required
def render_url(request) -> HttpResponse:
    return render(request, "index.html")
