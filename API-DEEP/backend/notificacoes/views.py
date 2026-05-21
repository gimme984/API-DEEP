from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from .models import Notificacao
from .serializers import NotificacaoSerializer

class MinhasNotificacoesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notificacoes = Notificacao.objects.filter(usuario=request.user)[:20]
        serializer = NotificacaoSerializer(notificacoes, many=True)
        return Response(serializer.data)

    def post(self, request):
        notificacao_id = request.data.get('notificacao_id')
        if notificacao_id:
            try:
                notificacao = Notificacao.objects.get(id=notificacao_id, usuario=request.user)
                notificacao.lida = True
                notificacao.save()
                return Response({'message': 'Notificação marcada como lida'})
            except Notificacao.DoesNotExist:
                return Response({'error': 'Notificação não encontrada'}, status=404)
        else:
            Notificacao.objects.filter(usuario=request.user, lida=False).update(lida=True)
            return Response({'message': 'Todas as notificações foram marcadas como lidas'})
