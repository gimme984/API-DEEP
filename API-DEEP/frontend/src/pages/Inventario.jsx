import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function Inventario() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [equipamentos, setEquipamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('equipamentos/').then(res => { setEquipamentos(res.data); setLoading(false); }).catch(err => console.error(err));
  }, []);

  const isAdmin = user?.funcao === 'ADMIN_TI';

  if (loading) return <div>Carregando...</div>;

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
        <h1>Inventário de Equipamentos</h1>
        <div>
          {isAdmin && (
            <button onClick={() => navigate('/inventario/novo')} style={{ padding: 10, background: '#28a745', color: 'white', marginRight: 10 }}>
              + Novo Equipamento
            </button>
          )}
          <button onClick={() => navigate('/dashboard')} style={{ padding: 8, background: '#6c757d', color: 'white' }}>
            Voltar
          </button>
        </div>
      </div>

      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#f0f0f0' }}>
            <th style={{ border: '1px solid #ddd', padding: 8 }}>Patrimônio</th>
            <th style={{ border: '1px solid #ddd', padding: 8 }}>Tipo</th>
            <th style={{ border: '1px solid #ddd', padding: 8 }}>Responsável</th>
            <th style={{ border: '1px solid #ddd', padding: 8 }}>CPU</th>
            <th style={{ border: '1px solid #ddd', padding: 8 }}>Memória</th>
            <th style={{ border: '1px solid #ddd', padding: 8 }}>HD</th>
            {isAdmin && <th style={{ border: '1px solid #ddd', padding: 8 }}>Ações</th>}
          </tr>
        </thead>
        <tbody>
          {equipamentos.map(eq => (
            <tr key={eq.id}>
              <td style={{ border: '1px solid #ddd', padding: 8 }}>{eq.patrimonio || '-'}</td>
              <td style={{ border: '1px solid #ddd', padding: 8 }}>{eq.tipo}</td>
              <td style={{ border: '1px solid #ddd', padding: 8 }}>{eq.responsavel_nome || '-'}</td>
              <td style={{ border: '1px solid #ddd', padding: 8 }}>{eq.cpu || '-'}</td>
              <td style={{ border: '1px solid #ddd', padding: 8 }}>{eq.memoria || '-'}</td>
              <td style={{ border: '1px solid #ddd', padding: 8 }}>{eq.espaco_hd || '-'}</td>
              {isAdmin && (
                <td style={{ border: '1px solid #ddd', padding: 8 }}>
                  <button onClick={() => navigate(`/inventario/${eq.id}`)} style={{ padding: 4, background: '#007bff', color: 'white', border: 'none', borderRadius: 4 }}>
                    Editar
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>

      {equipamentos.length === 0 && (
        <div style={{ marginTop: 20, padding: 20, textAlign: 'center', background: '#f8f9fa', borderRadius: 8 }}>
          <p>Nenhum equipamento cadastrado.</p>
          {isAdmin && (
            <button onClick={() => navigate('/inventario/novo')} style={{ padding: 10, background: '#28a745', color: 'white', border: 'none', borderRadius: 4 }}>
              Cadastrar Primeiro Equipamento
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Inventario;
