from rest_framework import serializers
from .models import Chamado, Comentario, Anexo

class AnexoSerializer(serializers.ModelSerializer):
    enviado_por_nome = serializers.ReadOnlyField(source='enviado_por.username')
    
    class Meta:
        model = Anexo
        fields = ['id', 'arquivo', 'nome', 'enviado_por', 'enviado_por_nome', 'criado_em']
        read_only_fields = ['id', 'enviado_por', 'criado_em']

class ComentarioSerializer(serializers.ModelSerializer):
    autor_nome = serializers.ReadOnlyField(source='autor.username')
    
    class Meta:
        model = Comentario
        fields = ['id', 'autor', 'autor_nome', 'texto', 'is_sistema', 'criado_em']
        read_only_fields = ['id', 'autor', 'criado_em']

class ChamadoSerializer(serializers.ModelSerializer):
    solicitante_nome = serializers.SerializerMethodField()
    tecnico_nome = serializers.SerializerMethodField()
    resolvido_por_nome = serializers.SerializerMethodField()
    comentarios = ComentarioSerializer(many=True, read_only=True)
    anexos = AnexoSerializer(many=True, read_only=True)
    
    def get_solicitante_nome(self, obj):
        return obj.solicitante.get_full_name() or obj.solicitante.username
    
    def get_tecnico_nome(self, obj):
        if obj.tecnico:
            return obj.tecnico.get_full_name() or obj.tecnico.username
        return None
    
    def get_resolvido_por_nome(self, obj):
        if obj.resolvido_por:
            return obj.resolvido_por.get_full_name() or obj.resolvido_por.username
        return None
    
    class Meta:
        model = Chamado
        fields = '__all__'
        read_only_fields = ['id', 'solicitante', 'criado_em', 'atualizado_em', 'resolvido_em', 'resolvido_por']
