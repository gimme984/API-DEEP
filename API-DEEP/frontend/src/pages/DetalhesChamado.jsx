import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function DetalhesChamado() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [chamado, setChamado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [comentario, setComentario] = useState('');
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    const fetchChamado = async () => {
      try {
        const response = await api.get(`chamados/${id}/`);
        setChamado(response.data);
        setStatus(response.data.status);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchChamado();
  }, [id]);

  const handleStatusUpdate = async () => {
    try {
      await api.patch(`chamados/${id}/`, { status });
      const response = await api.get(`chamados/${id}/`);
      setChamado(response.data);
      alert('Status atualizado!');
    } catch (err) {
      alert('Erro ao atualizar status');
    }
  };

  const handleComentario = async () => {
    if (!comentario.trim()) return;
    setEnviando(true);
    try {
      await api.post(`chamados/${id}/adicionar_comentario/`, { texto: comentario });
      setComentario('');
      const response = await api.get(`chamados/${id}/`);
      setChamado(response.data);
    } catch (err) {
      alert('Erro ao adicionar comentário');
    }
    setEnviando(false);
  };

  const getPrioridadeColor = (p) => ({ BAIXA: '#28a745', MEDIA: '#ffc107', ALTA: '#fd7e14', CRITICA: '#dc3545' }[p] || '#6c757d');
  const getStatusColor = (s) => ({ ABERTO: '#007bff', EM_ANDAMENTO: '#ffc107', RESOLVIDO: '#28a745', FECHADO: '#6c757d' }[s] || '#6c757d');

  if (loading) return <div>Carregando...</div>;
  if (!chamado) return <div>Chamado não encontrado</div>;

  const isTecnico = user?.funcao === 'TECNICO' || user?.funcao === 'ADMIN_TI';
  const podeComentar = chamado.status !== 'RESOLVIDO' && chamado.status !== 'FECHADO';

  return (
    <div style={{ maxWidth: 800, margin: 'auto', padding: 20 }}>
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: 20, padding: 8, background: '#6c757d', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
        ← Voltar
      </button>
      <h1>Chamado #{chamado.id}</h1>
      
      <div style={{ border: '1px solid #ddd', padding: 20, borderRadius: 8, marginBottom: 20 }}>
        <h2>{chamado.titulo}</h2>
        <p><strong>Descrição:</strong> {chamado.descricao}</p>
        {chamado.solucao && <p><strong>Solução:</strong> {chamado.solucao}</p>}
        <p><strong>Prioridade:</strong> <span style={{ background: getPrioridadeColor(chamado.prioridade), color: 'white', padding: '4px 8px', borderRadius: 4 }}>{chamado.prioridade}</span></p>
        
        {isTecnico && (
          <div style={{ marginTop: 15 }}>
            <label><strong>Status:</strong></label>
            <select value={status} onChange={e => setStatus(e.target.value)} style={{ marginLeft: 10, padding: 5 }}>
              <option value="ABERTO">Aberto</option>
              <option value="EM_ANDAMENTO">Em andamento</option>
              <option value="RESOLVIDO">Resolvido</option>
              <option value="FECHADO">Fechado</option>
            </select>
            <button onClick={handleStatusUpdate} style={{ marginLeft: 10, padding: 5, background: '#007bff', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
              Atualizar
            </button>
          </div>
        )}
        
        <p style={{ marginTop: 15 }}><strong>Criado por:</strong> {chamado.solicitante_nome}</p>
        <p><strong>Criado em:</strong> {new Date(chamado.criado_em).toLocaleString()}</p>
        {chamado.tecnico_nome && <p><strong>Técnico responsável:</strong> {chamado.tecnico_nome}</p>}
        {chamado.resolvido_por_nome && (
          <>
            <p><strong>Resolvido por:</strong> {chamado.resolvido_por_nome}</p>
            <p><strong>Resolvido em:</strong> {new Date(chamado.resolvido_em).toLocaleString()}</p>
          </>
        )}
      </div>

      <div style={{ border: '1px solid #ddd', padding: 20, borderRadius: 8 }}>
        <h3>💬 Histórico / Comentários</h3>
        {podeComentar && (
          <div style={{ marginBottom: 20 }}>
            <textarea
              value={comentario}
              onChange={e => setComentario(e.target.value)}
              placeholder="Adicione um comentário..."
              rows="3"
              style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 4 }}
            />
            <button onClick={handleComentario} disabled={enviando} style={{ marginTop: 10, padding: 8, background: '#007bff', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
              {enviando ? 'Enviando...' : 'Adicionar Comentário'}
            </button>
          </div>
        )}

        {!podeComentar && (
          <p style={{ color: '#6c757d', fontStyle: 'italic' }}>
            ⚠️ Este chamado está {chamado.status === 'RESOLVIDO' ? 'resolvido' : 'fechado'} e não aceita mais comentários.
          </p>
        )}

        {chamado.comentarios?.map(c => (
          <div key={c.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
            <strong>{c.autor_nome}</strong> - <small>{new Date(c.criado_em).toLocaleString()}</small>
            {c.is_sistema && <span style={{ background: '#28a745', color: 'white', fontSize: 10, padding: '2px 6px', borderRadius: 4, marginLeft: 10 }}>SISTEMA</span>}
            <p style={{ marginTop: 5 }}>{c.texto}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
export default DetalhesChamado;
