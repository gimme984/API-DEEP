import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function ResetarSenha() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError('Senhas não conferem');
      return;
    }
    
    if (password.length < 6) {
      setError('Senha deve ter pelo menos 6 caracteres');
      return;
    }
    
    setLoading(true);
    try {
      await api.post(`resetar-senha/${token}/`, { new_password: password });
      setMessage('Senha alterada com sucesso! Redirecionando...');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao resetar senha');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2>Redefinir Senha</h2>
      <form onSubmit={handleSubmit}>
        <input type="password" placeholder="Nova senha" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: 8, marginBottom: 10 }} />
        <input type="password" placeholder="Confirmar senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required style={{ width: '100%', padding: 8, marginBottom: 10 }} />
        <button type="submit" disabled={loading} style={{ width: '100%', padding: 10, background: '#28a745', color: 'white' }}>{loading ? 'Alterando...' : 'Alterar Senha'}</button>
        {message && <p style={{ color: 'green' }}>{message}</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </form>
      <Link to="/">Voltar para o login</Link>
    </div>
  );
}
export default ResetarSenha;
