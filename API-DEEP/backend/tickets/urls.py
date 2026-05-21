from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ChamadoViewSet, ComentarioViewSet, AnexoViewSet,
    BackupView, DownloadBackupView, MetricasView
)

router = DefaultRouter()
router.register(r'chamados', ChamadoViewSet)
router.register(r'chamados/(?P<chamado_pk>.+)/comentarios', ComentarioViewSet, basename='chamado-comentarios')
router.register(r'chamados/(?P<chamado_pk>.+)/anexos', AnexoViewSet, basename='chamado-anexos')

urlpatterns = [
    path('', include(router.urls)),
    path('backup/', BackupView.as_view(), name='backup'),
    path('backup/download/<str:filename>/', DownloadBackupView.as_view(), name='download_backup'),
    path('metricas/', MetricasView.as_view(), name='metricas'),
]
