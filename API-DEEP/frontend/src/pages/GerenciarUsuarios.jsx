import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function GerenciarUsuarios() {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editando, setEditando] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    first_name: '',
    last_name: '',
    funcao: 'USUARIO',
    setor: '',
    ramal: ''
  });

  useEffect(() => {
    carregarUsuarios();
  }, []);

  const carregarUsuarios = async () => {
    try {
      const response = await api.get('usuarios/');
      console.log('Usuários carregados:', response.data);
      setUsuarios(response.data);
    } catch (err) {
      console.error('Erro ao carregar usuários:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditando(user.id);
    setFormData({
      email: user.email || '',
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      funcao: user.funcao || 'USUARIO',
      setor: user.setor || '',
      ramal: user.ramal || ''
    });
  };

  const handleSave = async (userId) => {
    try {
      await api.patch(`usuarios/${userId}/`, formData);
      setEditando(null);
      carregarUsuarios();
      alert('Usuário atualizado com sucesso!');
    } catch (err) {
      console.error(err);
      alert('Erro ao atualizar usuário');
    }
  };

  const getFuncaoColor = (f) => {
    const cores = { ADMIN_TI: '#dc3545', TECNICO: '#17a2b8', USUARIO: '#28a745' };
    return cores[f] || '#6c757d';
  };

  const getFuncaoLabel = (f) => {
    const labels = { ADMIN_TI: 'Administrador', TECNICO: 'Técnico', USUARIO: 'Usuário' };
    return labels[f] || f;
  };

  if (loading) return <div style={{ padding: 20 }}>Carregando usuários...</div>;

  if (usuarios.length === 0) {
    return (
      <div style={{ padding: 20 }}>
        <h1>Gerenciar Usuários</h1>
        <p>Nenhum usuário encontrado.</p>
        <button onClick={() => navigate('/dashboard')}>Voltar</button>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1>Gerenciar Usuários</h1>
        <button onClick={() => navigate('/dashboard')} style={{ padding: 8, background: '#6c757d', color: 'white', border: 'none', borderRadius: 4 }}>
          Voltar
        </button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f0f0f0' }}>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>ID</th>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>Usuário</th>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>E-mail</th>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>Nome</th>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>Função</th>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>Setor</th>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>Ramal</th>
              <th style={{ border: '1px solid #ddd', padding: 8 }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(user => (
              <tr key={user.id}>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{user.id}</td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>{user.username}</td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>
                  {editando === user.id ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      style={{ width: '100%', padding: 4 }}
                    />
                  ) : (
                    user.email || '-'
                  )}
                </td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>
                  {editando === user.id ? (
                    <div>
                      <input
                        type="text"
                        value={formData.first_name}
                        onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                        placeholder="Nome"
                        style={{ width: '48%', padding: 4, marginRight: '4%' }}
                      />
                      <input
                        type="text"
                        value={formData.last_name}
                        onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                        placeholder="Sobrenome"
                        style={{ width: '48%', padding: 4 }}
                      />
                    </div>
                  ) : (
                    `${user.first_name || ''} ${user.last_name || ''}`.trim() || '-'
                  )}
                </td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>
                  {editando === user.id ? (
                    <select
                      value={formData.funcao}
                      onChange={(e) => setFormData({...formData, funcao: e.target.value})}
                      style={{ width: '100%', padding: 4 }}
                    >
                      <option value="USUARIO">Usuário</option>
                      <option value="TECNICO">Técnico</option>
                      <option value="ADMIN_TI">Administrador</option>
                    </select>
                  ) : (
                    <span style={{ background: getFuncaoColor(user.funcao), color: 'white', padding: '4px 8px', borderRadius: 4, fontSize: 12 }}>
                      {getFuncaoLabel(user.funcao)}
                    </span>
                  )}
                </td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>
                  {editando === user.id ? (
                    <input
                      type="text"
                      value={formData.setor}
                      onChange={(e) => setFormData({...formData, setor: e.target.value})}
                      style={{ width: '100%', padding: 4 }}
                    />
                  ) : (
                    user.setor || '-'
                  )}
                </td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>
                  {editando === user.id ? (
                    <input
                      type="text"
                      value={formData.ramal}
                      onChange={(e) => setFormData({...formData, ramal: e.target.value})}
                      style={{ width: '100%', padding: 4 }}
                    />
                  ) : (
                    user.ramal || '-'
                  )}
                </td>
                <td style={{ border: '1px solid #ddd', padding: 8 }}>
                  {editando === user.id ? (
                    <div>
                      <button
                        onClick={() => handleSave(user.id)}
                        style={{ padding: 4, background: '#28a745', color: 'white', border: 'none', borderRadius: 4, marginRight: 5 }}
                      >
                        Salvar
                      </button>
                      <button
                        onClick={() => setEditando(null)}
                        style={{ padding: 4, background: '#6c757d', color: 'white', border: 'none', borderRadius: 4 }}
                      >
                        Cancelar
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleEdit(user)}
                      style={{ padding: 4, background: '#007bff', color: 'white', border: 'none', borderRadius: 4 }}
                    >
                      Editar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GerenciarUsuarios;
