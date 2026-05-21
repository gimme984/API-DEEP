import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function Notificacao() {
  const navigate = useNavigate();
  const [notificacoes, setNotificacoes] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const carregarNotificacoes = async () => {
    try {
      console.log('🔍 Carregando notificações...');
      const response = await api.get('notificacoes/minhas/');
      console.log('✅ Notificações recebidas:', response.data);
      setNotificacoes(response.data);
      setUnreadCount(response.data.length);
    } catch (err) {
      console.error('❌ Erro:', err);
    }
  };

  const marcarComoLida = async (id) => {
    try {
      await api.post('notificacoes/minhas/', { notificacao_id: id });
      carregarNotificacoes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClick = (notif) => {
    marcarComoLida(notif.id);
    if (notif.link) {
      navigate(notif.link);
      setShowNotifications(false);
    }
  };

  useEffect(() => {
    console.log('🔔 Componente Notificacao montado');
    carregarNotificacoes();
    const interval = setInterval(carregarNotificacoes, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        style={{
          position: 'relative',
          padding: '8px 12px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
          fontSize: '20px'
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            background: '#dc3545',
            color: 'white',
            borderRadius: '50%',
            padding: '2px 6px',
            fontSize: '12px',
            minWidth: '18px'
          }}>
            {unreadCount}
          </span>
        )}
      </button>

      {showNotifications && (
        <div style={{
          position: 'absolute',
          top: '40px',
          right: '0',
          width: '350px',
          maxHeight: '400px',
          overflowY: 'auto',
          background: 'white',
          border: '1px solid #ddd',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
          zIndex: 1000
        }}>
          <div style={{ padding: '10px', borderBottom: '1px solid #ddd', background: '#f8f9fa' }}>
            <strong>Notificações</strong>
          </div>
          {notificacoes.length === 0 ? (
            <div style={{ padding: '20px', textAlign: 'center', color: '#999' }}>
              Nenhuma notificação
            </div>
          ) : (
            notificacoes.map(notif => (
              <div
                key={notif.id}
                onClick={() => handleClick(notif)}
                style={{
                  padding: '10px',
                  borderBottom: '1px solid #eee',
                  cursor: 'pointer',
                  background: notif.lida ? 'white' : '#f0f8ff'
                }}
              >
                <div style={{ fontWeight: 'bold' }}>{notif.titulo}</div>
                <div style={{ fontSize: '14px', color: '#666' }}>{notif.mensagem}</div>
                <div style={{ fontSize: '11px', color: '#999' }}>
                  {new Date(notif.criado_em).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default Notificacao;
