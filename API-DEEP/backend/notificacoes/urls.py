from django.urls import path
from .views import MinhasNotificacoesView

urlpatterns = [
    path('minhas/', MinhasNotificacoesView.as_view(), name='minhas_notificacoes'),
]
