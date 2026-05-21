from rest_framework import viewsets, permissions, filters
from .models import Equipamento
from .serializers import EquipamentoSerializer

class EquipamentoViewSet(viewsets.ModelViewSet):
    queryset = Equipamento.objects.all()
    serializer_class = EquipamentoSerializer
    permission_classes = [permissions.IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['patrimonio', 'responsavel__username', 'cpu', 'modelo']
    ordering_fields = ['patrimonio', 'criado_em']
    
    def get_queryset(self):
        user = self.request.user
        # Admin vê tudo, usuários comuns vêem apenas equipamentos que são responsáveis
        if user.is_staff or getattr(user, 'funcao', '') == 'ADMIN_TI':
            return Equipamento.objects.all()
        return Equipamento.objects.filter(responsavel=user)
    
    def perform_create(self, serializer):
        serializer.save(criado_por=self.request.user)
