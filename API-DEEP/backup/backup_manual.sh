#!/bin/bash
cd /run/media/alex/336a76c7-28a1-4ef0-b673-99fe017d704f/Alex/API-DEEP
DATE=$(date +"%Y%m%d_%H%M%S")
docker compose exec -T db pg_dump -U admin tickets > backup/backup_$DATE.sql
if [ $? -eq 0 ]; then
    echo "✅ Backup criado: backup/backup_$DATE.sql"
else
    echo "❌ Erro ao criar backup"
fi
