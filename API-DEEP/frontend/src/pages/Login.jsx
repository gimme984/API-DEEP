import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (err) {
      setError('Usuário ou senha inválidos');
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2 style={{ textAlign: 'center' }}>SISTEMA DE CHAMADOS COMDEP</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Usuário</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', padding: 8, marginBottom: 10 }}
            required
          />
        </div>
        <div>
          <label>Senha</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: 8, marginBottom: 10 }}
            required
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: 10, background: '#007bff', color: 'white', border: 'none', borderRadius: 4 }}>
          Entrar
        </button>
        {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
      </form>
      <p style={{ textAlign: 'center', marginTop: 20 }}>
        <Link to="/esqueci-senha">Esqueci minha senha</Link>
      </p>
      <p style={{ textAlign: 'center', marginTop: 10 }}>
        Não tem conta? <Link to="/registro">Cadastre-se</Link>
      </p>
    </div>
  );
}

export default Login;
