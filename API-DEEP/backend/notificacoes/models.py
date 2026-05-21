from django.db import models
from django.conf import settings

class Notificacao(models.Model):
    TIPOS = [
        ('NOVO_CHAMADO', 'Novo Chamado'),
        ('STATUS_ALTERADO', 'Status Alterado'),
        ('CHAMADO_RESOLVIDO', 'Chamado Resolvido'),
        ('ATRIBUICAO', 'Atribuição'),
        ('NOVO_COMENTARIO', 'Novo Comentário'),
    ]
    
    usuario = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notificacoes')
    tipo = models.CharField(max_length=30, choices=TIPOS)
    titulo = models.CharField(max_length=200)
    mensagem = models.TextField()
    link = models.CharField(max_length=500, blank=True, null=True)
    lida = models.BooleanField(default=False)
    criado_em = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-criado_em']
    
    def __str__(self):
        return f"{self.titulo} - {self.usuario.username}"
