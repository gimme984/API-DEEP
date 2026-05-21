import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Metricas from '../components/Metricas';
import Notificacao from '../components/Notificacao';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function DashboardCompleto() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [chamados, setChamados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState('TODOS');

  useEffect(() => {
    api.get('chamados/').then(res => { 
      setChamados(res.data); 
      setLoading(false); 
    }).catch(err => console.error(err));
  }, []);

  const isAdmin = user?.funcao === 'ADMIN_TI';
  const isTecnico = user?.funcao === 'TECNICO' || isAdmin;
  
  const titulo = isTecnico ? "Chamados do Sistema" : "Meus Chamados";
  const subtitulo = isTecnico 
    ? `Total de chamados no sistema: ${chamados.length}` 
    : `Seus chamados: ${chamados.length}`;

  const getStatusCount = () => {
    const count = { ABERTO: 0, EM_ANDAMENTO: 0, RESOLVIDO: 0, FECHADO: 0 };
    chamados.forEach(c => { if (count[c.status] !== undefined) count[c.status]++; });
    return [
      { name: 'Aberto', value: count.ABERTO, color: '#007bff' },
      { name: 'Em andamento', value: count.EM_ANDAMENTO, color: '#ffc107' },
      { name: 'Resolvido', value: count.RESOLVIDO, color: '#28a745' },
      { name: 'Fechado', value: count.FECHADO, color: '#6c757d' }
    ].filter(i => i.value > 0);
  };

  const getPrioridadeCount = () => {
    const count = { BAIXA: 0, MEDIA: 0, ALTA: 0, CRITICA: 0 };
    chamados.forEach(c => { if (count[c.prioridade] !== undefined) count[c.prioridade]++; });
    return [
      { prioridade: 'Baixa', quantidade: count.BAIXA, color: '#28a745' },
      { prioridade: 'Média', quantidade: count.MEDIA, color: '#ffc107' },
      { prioridade: 'Alta', quantidade: count.ALTA, color: '#fd7e14' },
      { prioridade: 'Crítica', quantidade: count.CRITICA, color: '#dc3545' }
    ];
  };

  const getChamadosPorMes = () => {
    const meses = {};
    const hoje = new Date();
    for (let i = 5; i >= 0; i--) {
      const data = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
      const mesAno = `${data.toLocaleString('pt-BR', { month: 'short' })}/${data.getFullYear()}`;
      meses[mesAno] = 0;
    }
    chamados.forEach(c => {
      const data = new Date(c.criado_em);
      const mesAno = `${data.toLocaleString('pt-BR', { month: 'short' })}/${data.getFullYear()}`;
      if (meses[mesAno] !== undefined) meses[mesAno]++;
    });
    return Object.entries(meses).map(([mes, total]) => ({ mes, total }));
  };

  const getPrioridadeColor = (p) => ({ BAIXA: '#28a745', MEDIA: '#ffc107', ALTA: '#fd7e14', CRITICA: '#dc3545' }[p] || '#6c757d');
  const getStatusColor = (s) => ({ ABERTO: '#007bff', EM_ANDAMENTO: '#ffc107', RESOLVIDO: '#28a745', FECHADO: '#6c757d' }[s] || '#6c757d');

  const chamadosFiltrados = filtroStatus === 'TODOS' ? chamados : chamados.filter(c => c.status === filtroStatus);
  const statusData = getStatusCount();
  const prioridadeData = getPrioridadeCount();
  const mesesData = getChamadosPorMes();

  if (loading) return <div>Carregando...</div>;

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
        <div>
          <h1 style={{ margin: 0 }}>{titulo}</h1>
          <p style={{ margin: '5px 0 0 0', color: '#666' }}>Bem-vindo, {user?.first_name || user?.username}! {subtitulo}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <Notificacao />
          <button onClick={() => navigate('/perfil')} style={{ padding: '10px 15px', background: '#17a2b8', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>👤 Perfil</button>
          {isAdmin && (
            <>
              <button onClick={() => navigate('/gerenciar-usuarios')} style={{ padding: '10px 15px', background: '#6f42c1', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>👥 Usuários</button>
              <button onClick={() => navigate('/inventario')} style={{ padding: '10px 15px', background: '#17a2b8', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>📦 Inventário</button>
              <button onClick={() => navigate('/backup')} style={{ padding: '10px 15px', background: '#6f42c1', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>💾 Backup</button>
            </>
          )}
          <button onClick={() => navigate('/novo')} style={{ padding: '10px 15px', background: '#28a745', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>+ Novo Chamado</button>
          <button onClick={logout} style={{ padding: '10px 15px', background: '#dc3545', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>Sair</button>
        </div>
      </div>

      <Metricas />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 30 }}>
        <div style={{ border: '1px solid #ddd', padding: 20, borderRadius: 8, background: '#fff' }}>
          <h3 style={{ textAlign: 'center', marginTop: 0 }}>Chamados por Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" labelLine={false} label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`} outerRadius={80} dataKey="value">
                {statusData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ border: '1px solid #ddd', padding: 20, borderRadius: 8, background: '#fff' }}>
          <h3 style={{ textAlign: 'center', marginTop: 0 }}>Chamados por Prioridade</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={prioridadeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="prioridade" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="quantidade" name="Quantidade" fill="#8884d8">
                {prioridadeData.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div style={{ border: '1px solid #ddd', padding: 20, borderRadius: 8, background: '#fff', marginBottom: 30 }}>
        <h3 style={{ textAlign: 'center', marginTop: 0 }}>Chamados por Mês</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mesesData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" name="Total de Chamados" fill="#007bff" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {isTecnico && (
        <div style={{ marginBottom: 20 }}>
          <label>Filtrar por status: </label>
          <select value={filtroStatus} onChange={e => setFiltroStatus(e.target.value)} style={{ marginLeft: 10, padding: 5 }}>
            <option value="TODOS">Todos</option>
            <option value="ABERTO">Aberto</option>
            <option value="EM_ANDAMENTO">Em andamento</option>
            <option value="RESOLVIDO">Resolvido</option>
            <option value="FECHADO">Fechado</option>
          </select>
        </div>
      )}

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>ID</th>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>Título</th>
              {isTecnico && <th style={{ border: '1px solid #ddd', padding: 8 }}>Solicitante</th>}
              <th style={{ border: '1px solid #ddd', padding: 8 }}>Prioridade</th>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>Status</th>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>Criado em</th>
            </tr>
          </thead>
          <tbody>
            {chamadosFiltrados.map(c => (
              <tr key={c.id} onClick={() => navigate(`/chamado/${c.id}`)} style={{ cursor: 'pointer' }}>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{c.id}</td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{c.titulo}</td>
                {isTecnico && <td style={{ border: '1px solid #ddd', padding: 8 }}>{c.solicitante_nome || c.solicitante}</td>}
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
      </div>
    </div>
  );
}

export default DashboardCompleto;
