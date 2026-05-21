from django.db import models
from django.conf import settings

class Chamado(models.Model):
    PRIORIDADES = [
        ('BAIXA', 'Baixa'),
        ('MEDIA', 'Média'),
        ('ALTA', 'Alta'),
        ('CRITICA', 'Crítica'),
    ]
    
    STATUS = [
        ('ABERTO', 'Aberto'),
        ('EM_ANDAMENTO', 'Em andamento'),
        ('RESOLVIDO', 'Resolvido'),
        ('FECHADO', 'Fechado'),
    ]
    
    titulo = models.CharField(max_length=200)
    descricao = models.TextField()
    solucao = models.TextField(blank=True, null=True)
    prioridade = models.CharField(max_length=10, choices=PRIORIDADES, default='MEDIA')
    status = models.CharField(max_length=20, choices=STATUS, default='ABERTO')
    
    solicitante = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='chamados_abertos')
    tecnico = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='chamados_atribuidos')
    resolvido_por = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='chamados_resolvidos')
    resolvido_em = models.DateTimeField(null=True, blank=True)
    
    equipamento = models.ForeignKey('equipamentos.Equipamento', on_delete=models.PROTECT, related_name='chamados')
    
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"#{self.id} - {self.titulo}"

class Comentario(models.Model):
    chamado = models.ForeignKey(Chamado, on_delete=models.CASCADE, related_name='comentarios')
    autor = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    texto = models.TextField()
    is_sistema = models.BooleanField(default=False)
    criado_em = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Comentário de {self.autor.username}"

class Anexo(models.Model):
    chamado = models.ForeignKey(Chamado, on_delete=models.CASCADE, related_name='anexos')
    arquivo = models.FileField(upload_to='anexos/%Y/%m/%d/')
    nome = models.CharField(max_length=255)
    enviado_por = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    criado_em = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.nome
