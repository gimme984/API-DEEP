from .models import Notificacao

def criar_notificacao(usuario, tipo, titulo, mensagem, chamado_id=None):
    Notificacao.objects.create(
        usuario=usuario,
        tipo=tipo,
        titulo=titulo,
        mensagem=mensagem,
        chamado_id=chamado_id
    )

def notificar_tecnicos(tipo, titulo, mensagem, chamado_id=None):
    from accounts.models import User
    tecnicos = User.objects.filter(funcao__in=['TECNICO', 'ADMIN_TI'])
    for tecnico in tecnicos:
        criar_notificacao(tecnico, tipo, titulo, mensagem, chamado_id)
