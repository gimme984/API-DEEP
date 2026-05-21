#!/bin/bash

# Configurações
BACKUP_DIR="/app/backup"
DATE=$(date +"%Y%m%d_%H%M%S")
DB_NAME="tickets"
DB_USER="admin"
DB_PASSWORD="senha123"
DB_HOST="db"

# Criar diretório se não existir
mkdir -p $BACKUP_DIR

echo "📁 Iniciando backup do banco $DB_NAME..."

# Executar backup
PGPASSWORD=$DB_PASSWORD pg_dump -h $DB_HOST -U $DB_USER $DB_NAME > "$BACKUP_DIR/backup_$DATE.sql"

if [ $? -eq 0 ]; then
    echo "✅ Backup criado: backup_$DATE.sql"
    
    # Compactar
    gzip "$BACKUP_DIR/backup_$DATE.sql"
    echo "✅ Backup compactado: backup_$DATE.sql.gz"
    
    # Remover backups antigos (mais de 30 dias)
    find $BACKUP_DIR -name "backup_*.sql.gz" -type f -mtime +30 -delete
    echo "🗑️ Backups antigos removidos (retenção: 30 dias)"
else
    echo "❌ Erro ao criar backup!"
    exit 1
fi

echo "✅ Backup concluído!"
