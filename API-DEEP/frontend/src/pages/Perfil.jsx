import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

function Perfil() {
  const navigate = useNavigate();
  const { user, login } = useAuth();
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    setor: '',
    ramal: ''
  });
  const [senhaData, setSenhaData] = useState({
    old_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [equipamentos, setEquipamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('perfil');

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        setor: user.setor || '',
        ramal: user.ramal || ''
      });
      carregarEquipamentos();
    }
    setLoading(false);
  }, [user]);

  const carregarEquipamentos = async () => {
    try {
      const response = await api.get('meus-equipamentos/');
      setEquipamentos(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handlePerfilChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSenhaChange = (e) => {
    setSenhaData({ ...senhaData, [e.target.name]: e.target.value });
  };

  const handleAtualizarPerfil = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    try {
      await api.put('perfil/', formData);
      // Recarregar dados do usuário
      const response = await api.get('usuario/');
      login(response.data.username, senhaData.old_password || 'temp');
      setMessage('Perfil atualizado com sucesso!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError('Erro ao atualizar perfil');
    }
  };

  const handleAlterarSenha = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    
    if (senhaData.new_password !== senhaData.confirm_password) {
      setError('Novas senhas não conferem');
      return;
    }
    
    if (senhaData.new_password.length < 6) {
      setError('Nova senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    try {
      await api.post('alterar-senha/', {
        old_password: senhaData.old_password,
        new_password: senhaData.new_password
      });
      setMessage('Senha alterada com sucesso!');
      setSenhaData({ old_password: '', new_password: '', confirm_password: '' });
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao alterar senha');
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Carregando...</div>;

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: 20, padding: 8, background: '#6c757d', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
        ← Voltar ao Dashboard
      </button>
      
      <h1 style={{ marginBottom: 20 }}>Meu Perfil</h1>
      
      {/* Abas */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, borderBottom: '1px solid #ddd' }}>
        <button
          onClick={() => setActiveTab('perfil')}
          style={{
            padding: '10px 20px',
            background: activeTab === 'perfil' ? '#007bff' : 'transparent',
            color: activeTab === 'perfil' ? 'white' : '#333',
            border: 'none',
            borderRadius: '4px 4px 0 0',
            cursor: 'pointer'
          }}
        >
          📝 Dados Pessoais
        </button>
        <button
          onClick={() => setActiveTab('senha')}
          style={{
            padding: '10px 20px',
            background: activeTab === 'senha' ? '#007bff' : 'transparent',
            color: activeTab === 'senha' ? 'white' : '#333',
            border: 'none',
            borderRadius: '4px 4px 0 0',
            cursor: 'pointer'
          }}
        >
          🔒 Alterar Senha
        </button>
        <button
          onClick={() => setActiveTab('equipamentos')}
          style={{
            padding: '10px 20px',
            background: activeTab === 'equipamentos' ? '#007bff' : 'transparent',
            color: activeTab === 'equipamentos' ? 'white' : '#333',
            border: 'none',
            borderRadius: '4px 4px 0 0',
            cursor: 'pointer'
          }}
        >
          💻 Meus Equipamentos
        </button>
      </div>
      
      {/* Aba: Dados Pessoais */}
      {activeTab === 'perfil' && (
        <form onSubmit={handleAtualizarPerfil} style={{ border: '1px solid #ddd', padding: 20, borderRadius: 8 }}>
          <div style={{ marginBottom: 15 }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 5 }}>Usuário</label>
            <input
              type="text"
              value={user?.username || ''}
              disabled
              style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4, background: '#f5f5f5' }}
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 15 }}>
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 5 }}>Nome</label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handlePerfilChange}
                style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
              />
            </div>
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 5 }}>Sobrenome</label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handlePerfilChange}
                style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
              />
            </div>
          </div>
          
          <div style={{ marginBottom: 15 }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 5 }}>E-mail</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handlePerfilChange}
              style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 15 }}>
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 5 }}>Setor</label>
              <input
                type="text"
                name="setor"
                value={formData.setor}
                onChange={handlePerfilChange}
                style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
              />
            </div>
            <div>
              <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 5 }}>Ramal</label>
              <input
                type="text"
                name="ramal"
                value={formData.ramal}
                onChange={handlePerfilChange}
                style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
              />
            </div>
          </div>
          
          <button type="submit" style={{ padding: 10, background: '#28a745', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            Salvar Alterações
          </button>
        </form>
      )}
      
      {/* Aba: Alterar Senha */}
      {activeTab === 'senha' && (
        <form onSubmit={handleAlterarSenha} style={{ border: '1px solid #ddd', padding: 20, borderRadius: 8 }}>
          <div style={{ marginBottom: 15 }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 5 }}>Senha Atual</label>
            <input
              type="password"
              name="old_password"
              value={senhaData.old_password}
              onChange={handleSenhaChange}
              required
              style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
            />
          </div>
          
          <div style={{ marginBottom: 15 }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 5 }}>Nova Senha</label>
            <input
              type="password"
              name="new_password"
              value={senhaData.new_password}
              onChange={handleSenhaChange}
              required
              style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
            />
          </div>
          
          <div style={{ marginBottom: 15 }}>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 5 }}>Confirmar Nova Senha</label>
            <input
              type="password"
              name="confirm_password"
              value={senhaData.confirm_password}
              onChange={handleSenhaChange}
              required
              style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
            />
          </div>
          
          <button type="submit" style={{ padding: 10, background: '#28a745', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
            Alterar Senha
          </button>
        </form>
      )}
      
      {/* Aba: Meus Equipamentos */}
      {activeTab === 'equipamentos' && (
        <div style={{ border: '1px solid #ddd', padding: 20, borderRadius: 8 }}>
          {equipamentos.length === 0 ? (
            <p>Nenhum equipamento vinculado a você.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f0f0f0' }}>
                  <th style={{ border: '1px solid #ddd', padding: 8 }}>Patrimônio</th>
                  <th style={{ border: '1px solid #ddd', padding: 8 }}>Tipo</th>
                  <th style={{ border: '1px solid #ddd', padding: 8 }}>CPU</th>
                  <th style={{ border: '1px solid #ddd', padding: 8 }}>Memória</th>
                  <th style={{ border: '1px solid #ddd', padding: 8 }}>HD</th>
                </tr>
              </thead>
              <tbody>
                {equipamentos.map(equip => (
                  <tr key={equip.id}>
                    <td style={{ border: '1px solid #ddd', padding: 8 }}>{equip.patrimonio || '-'}</td>
                    <td style={{ border: '1px solid #ddd', padding: 8 }}>{equip.tipo}</td>
                    <td style={{ border: '1px solid #ddd', padding: 8 }}>{equip.cpu || '-'}</td>
                    <td style={{ border: '1px solid #ddd', padding: 8 }}>{equip.memoria || '-'}</td>
                    <td style={{ border: '1px solid #ddd', padding: 8 }}>{equip.espaco_hd || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
      
      {message && <p style={{ color: 'green', marginTop: 20, padding: 10, background: '#d4edda', borderRadius: 4 }}>{message}</p>}
      {error && <p style={{ color: 'red', marginTop: 20, padding: 10, background: '#f8d7da', borderRadius: 4 }}>{error}</p>}
    </div>
  );
}

export default Perfil;
