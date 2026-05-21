from django.db import models
from django.conf import settings

class Equipamento(models.Model):
    TIPO_EQUIPAMENTO = [
        ('DESKTOP', 'Desktop'),
        ('NOTEBOOK', 'Notebook'),
        ('SERVIDOR', 'Servidor'),
        ('MONITOR', 'Monitor'),
        ('IMPRESSORA', 'Impressora'),
        ('OUTRO', 'Outro'),
    ]
    
    patrimonio = models.CharField(max_length=20, unique=True, blank=True, editable=False)
    tipo = models.CharField(max_length=20, choices=TIPO_EQUIPAMENTO, default='DESKTOP')
    responsavel = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='equipamentos')
    
    cpu = models.CharField(max_length=200, blank=True, null=True)
    memoria = models.CharField(max_length=100, blank=True, null=True)
    placa_mae = models.CharField(max_length=200, blank=True, null=True)
    espaco_hd = models.CharField(max_length=100, blank=True, null=True)
    
    modelo = models.CharField(max_length=200, blank=True, null=True)
    fabricante = models.CharField(max_length=200, blank=True, null=True)
    numero_serie = models.CharField(max_length=100, blank=True, null=True)
    
    observacoes = models.TextField(blank=True, null=True)
    
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)
    criado_por = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='equipamentos_criados')
    
    class Meta:
        ordering = ['patrimonio']
    
    def save(self, *args, **kwargs):
        if not self.patrimonio:
            ultimo = Equipamento.objects.order_by('-id').first()
            if ultimo and ultimo.patrimonio:
                try:
                    num = int(ultimo.patrimonio.split('-')[1]) + 1
                except:
                    num = 1
            else:
                num = 1
            self.patrimonio = f"PAT-{num:04d}"
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.patrimonio} - {self.tipo}"
