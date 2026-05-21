import { useState } from 'react';
import { Link } from 'react-router-dom';

function EsqueciSenha() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    
    try {
      const response = await fetch('http://localhost:8000/api/esqueci-senha/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email })
      });
      const data = await response.json();
      
      if (response.ok) {
        setMessage('✅ E-mail enviado! Verifique sua caixa de entrada.');
      } else {
        setError(data.error || 'Erro ao enviar e-mail');
      }
    } catch (err) {
      setError('Erro de conexão com o servidor');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: '100px auto', padding: 20, border: '1px solid #ccc', borderRadius: 8 }}>
      <h2 style={{ textAlign: 'center' }}>SISTEMA DE CHAMADOS COMDEP</h2>
      <h3>Recuperar Senha</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Digite seu e-mail"
          required
          style={{ width: '100%', padding: 8, marginBottom: 10 }}
        />
        <button type="submit" disabled={loading} style={{ width: '100%', padding: 10, background: '#007bff', color: 'white' }}>
          {loading ? 'Enviando...' : 'Enviar Link'}
        </button>
        {message && <p style={{ color: 'green', marginTop: 10 }}>{message}</p>}
        {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
      </form>
      <Link to="/">← Voltar</Link>
    </div>
  );
}

export default EsqueciSenha;
