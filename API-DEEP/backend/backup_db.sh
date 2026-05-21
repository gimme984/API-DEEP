#!/bin/bash

BACKUP_DIR="/app/backup"
DATE=$(date +"%Y%m%d_%H%M%S")
DB_NAME="tickets"
DB_USER="admin"
DB_PASSWORD="senha123"
DB_HOST="db"

mkdir -p $BACKUP_DIR

echo "Iniciando backup do banco $DB_NAME..."

# Usar pg_dump com credenciais
PGPASSWORD=$DB_PASSWORD pg_dump -h $DB_HOST -U $DB_USER $DB_NAME > "$BACKUP_DIR/backup_$DATE.sql"

if [ $? -eq 0 ] && [ -s "$BACKUP_DIR/backup_$DATE.sql" ]; then
    gzip "$BACKUP_DIR/backup_$DATE.sql"
    echo "Backup criado: backup_$DATE.sql.gz"
    
    # Manter apenas os últimos 10 backups
    ls -t $BACKUP_DIR/backup_*.sql.gz | tail -n +11 | xargs rm -f 2>/dev/null
    
    exit 0
else
    echo "Erro ao criar backup"
    exit 1
fi
