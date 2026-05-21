from rest_framework import serializers
from .models import Equipamento

class EquipamentoSerializer(serializers.ModelSerializer):
    responsavel_nome = serializers.SerializerMethodField()
    criado_por_nome = serializers.SerializerMethodField()
    
    def get_responsavel_nome(self, obj):
        if obj.responsavel:
            return obj.responsavel.get_full_name() or obj.responsavel.username
        return None
    
    def get_criado_por_nome(self, obj):
        if obj.criado_por:
            return obj.criado_por.get_full_name() or obj.criado_por.username
        return None
    
    class Meta:
        model = Equipamento
        fields = '__all__'
        read_only_fields = ['id', 'patrimonio', 'criado_em', 'atualizado_em', 'criado_por']
