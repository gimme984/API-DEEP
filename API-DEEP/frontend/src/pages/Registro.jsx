import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

function Registro() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', first_name: '', last_name: '', password: '', password2: '', setor: '', ramal: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.password2) { setError('Senhas não conferem'); return; }
    try {
      await api.post('registro/', formData);
      setSuccess('Usuário criado!');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) { setError('Erro ao criar usuário'); }
  };

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: 20 }}>
      <h2>Cadastro</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="username" placeholder="Usuário *" onChange={handleChange} required style={{ width: '100%', padding: 8, marginBottom: 10 }} />
        <input type="email" name="email" placeholder="E-mail *" onChange={handleChange} required style={{ width: '100%', padding: 8, marginBottom: 10 }} />
        <input type="text" name="first_name" placeholder="Nome" onChange={handleChange} style={{ width: '100%', padding: 8, marginBottom: 10 }} />
        <input type="text" name="last_name" placeholder="Sobrenome" onChange={handleChange} style={{ width: '100%', padding: 8, marginBottom: 10 }} />
        <input type="text" name="setor" placeholder="Setor" onChange={handleChange} style={{ width: '100%', padding: 8, marginBottom: 10 }} />
        <input type="text" name="ramal" placeholder="Ramal" onChange={handleChange} style={{ width: '100%', padding: 8, marginBottom: 10 }} />
        <input type="password" name="password" placeholder="Senha *" onChange={handleChange} required style={{ width: '100%', padding: 8, marginBottom: 10 }} />
        <input type="password" name="password2" placeholder="Confirmar Senha *" onChange={handleChange} required style={{ width: '100%', padding: 8, marginBottom: 10 }} />
        <button type="submit" style={{ width: '100%', padding: 10, background: '#28a745', color: 'white' }}>Cadastrar</button>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
      </form>
      <p><Link to="/">Login</Link></p>
    </div>
  );
}
export default Registro;
