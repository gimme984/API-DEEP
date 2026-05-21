from django.urls import path
from .views import BackupView, DownloadBackupView

urlpatterns = [
    path('backup/', BackupView.as_view(), name='backup'),
    path('backup/download/<str:filename>/', DownloadBackupView.as_view(), name='download_backup'),
]
