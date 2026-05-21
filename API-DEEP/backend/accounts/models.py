from django.contrib.auth.models import AbstractUser
from django.db import models
import uuid

class User(AbstractUser):
    FUNCAO_CHOICES = [
        ('USUARIO', 'Usuário Comum'),
        ('TECNICO', 'Técnico de TI'),
        ('ADMIN_TI', 'Administrador de TI'),
    ]
    
    funcao = models.CharField(max_length=20, choices=FUNCAO_CHOICES, default='USUARIO')
    telefone = models.CharField(max_length=20, blank=True, null=True)
    setor = models.CharField(max_length=100, blank=True, null=True)
    ramal = models.CharField(max_length=10, blank=True, null=True)
    
    def __str__(self):
        return self.username
    
    @property
    def is_tecnico(self):
        return self.funcao in ['TECNICO', 'ADMIN_TI']

class PasswordResetToken(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    token = models.CharField(max_length=100, unique=True, default=uuid.uuid4)
    created_at = models.DateTimeField(auto_now_add=True)
    used = models.BooleanField(default=False)
    
    def is_valid(self):
        from django.utils import timezone
        from datetime import timedelta
        return not self.used and self.created_at > timezone.now() - timedelta(hours=24)
    
    def __str__(self):
        return f"Token para {self.user.username}"
