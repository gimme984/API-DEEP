import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Backup() {
  const navigate = useNavigate();
  const [backups, setBackups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const carregarBackups = async () => {
    try {
      const response = await api.get('backup/');
      console.log('Resposta:', response.data);
      const backupsValidos = (response.data.backups || []).filter(b => b.tamanho > 0);
      setBackups(backupsValidos);
    } catch (err) {
      console.error('Erro:', err);
    }
  };

  const realizarBackup = async () => {
    setLoading(true);
    setMessage('');
    setError('');
    try {
      const response = await api.post('backup/');
      if (response.data.success) {
        setMessage('✅ Backup realizado com sucesso!');
        carregarBackups();
      } else {
        setError(response.data.error || 'Erro ao realizar backup');
      }
    } catch (err) {
      setError('❌ Erro ao realizar backup');
    }
    setLoading(false);
  };

  const downloadBackup = async (filename) => {
    try {
      // Usar o api com token para download
      const response = await api.get(`backup/download/${filename}`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Erro:', err);
      setError('❌ Erro ao baixar backup');
    }
  };

  const formatarTamanho = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const formatarData = (dataISO) => {
    const data = new Date(dataISO);
    return data.toLocaleString('pt-BR');
  };

  useEffect(() => {
    carregarBackups();
  }, []);

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: 20, padding: 8, background: '#6c757d', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
        ← Voltar ao Dashboard
      </button>
      
      <h1>💾 Backup do Sistema</h1>
      
      <div style={{ marginBottom: 30, padding: 20, background: '#e8f4f8', borderRadius: 8 }}>
        <h2 style={{ marginTop: 0 }}>Realizar Novo Backup</h2>
        <p>Clique no botão abaixo para criar um backup completo do banco de dados.</p>
        <button 
          onClick={realizarBackup} 
          disabled={loading}
          style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
        >
          {loading ? '🔄 Realizando backup...' : '💾 Realizar Backup Agora'}
        </button>
        {message && <p style={{ color: 'green', marginTop: 10 }}>{message}</p>}
        {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
      </div>
      
      <div style={{ border: '1px solid #ddd', padding: 20, borderRadius: 8 }}>
        <h2 style={{ marginTop: 0 }}>Backups Disponíveis</h2>
        {backups.length === 0 ? (
          <p>Nenhum backup disponível. Clique no botão acima para criar o primeiro.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f0f0f0' }}>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>Nome</th>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>Tamanho</th>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>Data</th>
                <th style={{ border: '1px solid #ddd', padding: 8 }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {backups.map((backup, index) => (
                <tr key={index}>
                  <td style={{ border: '1px solid #ddd', padding: 8 }}>{backup.nome}</td>
                  <td style={{ border: '1px solid #ddd', padding: 8 }}>{formatarTamanho(backup.tamanho)}</td>
                  <td style={{ border: '1px solid #ddd', padding: 8 }}>{formatarData(backup.data)}</td>
                  <td style={{ border: '1px solid #ddd', padding: 8 }}>
                    <button 
                      onClick={() => downloadBackup(backup.nome)}
                      style={{ padding: 4, background: '#007bff', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                    >
                      📥 Baixar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
export default Backup;
