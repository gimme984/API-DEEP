import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      api.get('chamados/')
        .then(res => { setChamados(res.data); setLoading(false); })
        .catch(err => { console.error(err); setLoading(false); });
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getPrioridadeColor = (p) => {
    const cores = { BAIXA: '#28a745', MEDIA: '#ffc107', ALTA: '#fd7e14', CRITICA: '#dc3545' };
    return cores[p] || '#6c757d';
  };

  const getStatusColor = (s) => {
    const cores = { ABERTO: '#007bff', EM_ANDAMENTO: '#ffc107', RESOLVIDO: '#28a745', FECHADO: '#6c757d' };
    return cores[s] || '#6c757d';
  };

  if (loading) return <div style={{ padding: 20 }}>Carregando...</div>;

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1>Meus Chamados</h1>
        <div>
          <button onClick={() => navigate('/novo')} style={{ padding: 10, background: '#28a745', color: 'white', border: 'none', borderRadius: 4, marginRight: 10, cursor: 'pointer' }}>
            + Novo Chamado
          </button>
          <button onClick={handleLogout} style={{ padding: 8, background: '#dc3545', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            Sair
          </button>
        </div>
      </div>
      
      {chamados.length === 0 ? (
        <p style={{ textAlign: 'center', marginTop: 50 }}>Nenhum chamado encontrado.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>ID</th>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>Título</th>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>Prioridade</th>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>Status</th>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>Criado em</th>
            </tr>
          </thead>
          <tbody>
            {chamados.map(c => (
              <tr key={c.id} onClick={() => navigate(`/chamado/${c.id}`)} style={{ cursor: 'pointer' }}>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{c.id}</td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{c.titulo}</td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>
                  <span style={{ background: getPrioridadeColor(c.prioridade), color: 'white', padding: '4px 8px', borderRadius: 4 }}>{c.prioridade}</span>
                </td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>
                  <span style={{ background: getStatusColor(c.status), color: 'white', padding: '4px 8px', borderRadius: 4 }}>{c.status}</span>
                </td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{new Date(c.criado_em).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
export default Dashboard;
