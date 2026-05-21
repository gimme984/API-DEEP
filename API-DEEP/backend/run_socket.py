#!/usr/bin/env python
import eventlet
eventlet.monkey_patch()

import os
import sys
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Configurar Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
sys.path.append('/app')

import django
django.setup()

from socket_app.socket_server import sio, app
from django.core.wsgi import get_wsgi_application
from socketio import WSGIApp

# Criar aplicação combinada
django_app = get_wsgi_application()
application = WSGIApp(sio, django_app)

if __name__ == '__main__':
    import eventlet.wsgi
    port = 8001
    logger.info(f'🚀 Servidor Socket.IO rodando na porta {port}...')
    logger.info(f'📡 Aguardando conexões...')
    eventlet.wsgi.server(eventlet.listen(('0.0.0.0', port)), application)
