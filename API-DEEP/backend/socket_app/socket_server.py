import socketio
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Criar servidor Socket.IO
sio = socketio.Server(
    cors_allowed_origins='*',
    async_mode='eventlet',
    ping_timeout=60,
    ping_interval=25
)

app = socketio.WSGIApp(sio)

# Armazenar salas dos usuários
user_rooms = {}

@sio.event
def connect(sid, environ):
    logger.info(f'Cliente conectado: {sid}')
    return True

@sio.event
def disconnect(sid):
    logger.info(f'Cliente desconectado: {sid}')
    if sid in user_rooms:
        del user_rooms[sid]

@sio.event
def register_room(sid, data):
    username = data.get('username')
    if username:
        user_rooms[sid] = username
        sio.enter_room(sid, f'user_{username}')
        logger.info(f'Usuário {username} entrou na sala user_{username}')
        return {'status': 'ok', 'room': f'user_{username}'}
    return {'status': 'error', 'message': 'Username não fornecido'}

def send_notification(username, notification):
    """Enviar notificação para um usuário específico"""
    try:
        room = f'user_{username}'
        sio.emit('notification', notification, room=room)
        logger.info(f'Notificação enviada para {username}: {notification.get("title")}')
        return True
    except Exception as e:
        logger.error(f'Erro ao enviar notificação: {e}')
        return False

def broadcast_notification(notification):
    """Enviar notificação para todos os conectados"""
    try:
        sio.emit('notification', notification)
        logger.info(f'Broadcast enviado: {notification.get("title")}')
        return True
    except Exception as e:
        logger.error(f'Erro ao enviar broadcast: {e}')
        return False
