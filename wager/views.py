
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required


# Used to grab username, stack, and team stack for NavBar
@login_required
def current_user_view(request):
    user = request.user
    data = {
        "name": user.username,
        "personalStack": user.profile.stack,
        "teamStack": user.team.stack,      
    }
    return JsonResponse(data)
