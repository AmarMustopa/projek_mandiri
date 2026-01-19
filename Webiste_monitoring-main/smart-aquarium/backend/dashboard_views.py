from django.shortcuts import render
from django.contrib.auth.decorators import login_required

@login_required(login_url='/login/')
def dashboard_view(request):
    """Render dashboard HTML page"""
    return render(request, 'dashboard.html')

@login_required(login_url='/login/')
def analytics_view(request):
    """Render analytics HTML page"""
    return render(request, 'analytics.html')

@login_required(login_url='/login/')
def settings_view(request):
    """Render settings HTML page"""
    return render(request, 'settings.html')
