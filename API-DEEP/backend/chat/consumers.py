import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
from .models import Chamado, MensagemChat
from accounts.models import User

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.chamado_id = self.scope['url_route']['kwargs']['chamado_id']
        self.room_group_name = f'chat_{self.chamado_id}'
        
        # Verificar autenticação
        user = self.scope['user']
        if user.is_anonymous:
            await self.close()
            return
        
        # Verificar se o usuário tem acesso ao chamado
        if not await self.user_can_access_chamado(user, self.chamado_id):
            await self.close()
            return
        
        # Entrar no grupo
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Marcar mensagens como lidas
        await self.mark_messages_as_read(user, self.chamado_id)
    
    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        mensagem = text_data_json['mensagem']
        user = self.scope['user']
        
        # Salvar mensagem no banco
        msg = await self.save_message(user, self.chamado_id, mensagem)
        
        # Enviar para o grupo
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'mensagem': mensagem,
                'autor': user.username,
                'autor_nome': user.get_full_name() or user.username,
                'criado_em': msg.criado_em.isoformat() if msg else None,
                'autor_id': user.id
            }
        )
    
    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'mensagem': event['mensagem'],
            'autor': event['autor'],
            'autor_nome': event['autor_nome'],
            'criado_em': event['criado_em'],
            'autor_id': event['autor_id']
        }))
    
    @database_sync_to_async
    def user_can_access_chamado(self, user, chamado_id):
        try:
            chamado = Chamado.objects.get(id=chamado_id)
            return user == chamado.solicitante or user == chamado.tecnico or user.funcao == 'ADMIN_TI'
        except Chamado.DoesNotExist:
            return False
    
    @database_sync_to_async
    def save_message(self, user, chamado_id, mensagem):
        chamado = Chamado.objects.get(id=chamado_id)
        return MensagemChat.objects.create(
            chamado=chamado,
            autor=user,
            mensagem=mensagem
        )
    
    @database_sync_to_async
    def mark_messages_as_read(self, user, chamado_id):
        chamado = Chamado.objects.get(id=chamado_id)
        MensagemChat.objects.filter(
            chamado=chamado
        ).exclude(autor=user).update(lida=True)
