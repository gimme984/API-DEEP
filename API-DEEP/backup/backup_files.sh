#!/bin/bash

BACKUP_DIR="/app/backup"
DATE=$(date +"%Y%m%d_%H%M%S")
RETENTION_DAYS=30

# Backup dos anexos (media)
if [ -d "/app/media" ]; then
    echo "📁 Backup dos anexos..."
    tar -czf "$BACKUP_DIR/media_backup_$DATE.tar.gz" /app/media
    echo "✅ Backup dos anexos: media_backup_$DATE.tar.gz"
fi

# Remover backups antigos
find $BACKUP_DIR -name "media_backup_*.tar.gz" -type f -mtime +$RETENTION_DAYS -delete
