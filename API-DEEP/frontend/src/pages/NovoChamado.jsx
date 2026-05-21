import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function NovoChamado() {
  const navigate = useNavigate();
  const [equipamentos, setEquipamentos] = useState([]);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    prioridade: 'MEDIA',
    equipamento: ''
  });
  const [anexos, setAnexos] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [enviandoAnexo, setEnviandoAnexo] = useState(false);

  useEffect(() => {
    api.get('equipamentos/')
      .then(res => setEquipamentos(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAnexos = (e) => {
    const files = Array.from(e.target.files);
    setAnexos([...anexos, ...files]);
  };

  const removerAnexo = (index) => {
    const novosAnexos = [...anexos];
    novosAnexos.splice(index, 1);
    setAnexos(novosAnexos);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.equipamento) {
      setError('Por favor, selecione um equipamento');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Criar o chamado
      const response = await api.post('chamados/', {
        titulo: formData.titulo,
        descricao: formData.descricao,
        prioridade: formData.prioridade,
        equipamento: parseInt(formData.equipamento)
      });
      
      const chamadoId = response.data.id;
      
      // Enviar anexos
      for (const anexo of anexos) {
        const formDataAnexo = new FormData();
        formDataAnexo.append('arquivo', anexo);
        formDataAnexo.append('nome', anexo.name);
        
        await api.post(`chamados/${chamadoId}/anexos/`, formDataAnexo, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }
      
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || 'Erro ao criar chamado');
    }
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: 20 }}>
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: 20, padding: 8, background: '#6c757d', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
        ← Voltar
      </button>
      
      <h2>Abrir Novo Chamado</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 15 }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 5 }}>Título *</label>
          <input
            type="text"
            name="titulo"
            value={formData.titulo}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          />
        </div>
        
        <div style={{ marginBottom: 15 }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 5 }}>Equipamento *</label>
          <select
            name="equipamento"
            value={formData.equipamento}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          >
            <option value="">Selecione...</option>
            {equipamentos.map(equip => (
              <option key={equip.id} value={equip.id}>
                {equip.patrimonio} - {equip.tipo} - {equip.cpu || 'Sem CPU'}
              </option>
            ))}
          </select>
        </div>
        
        <div style={{ marginBottom: 15 }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 5 }}>Descrição *</label>
          <textarea
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            required
            rows="5"
            style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          />
        </div>
        
        <div style={{ marginBottom: 15 }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 5 }}>Prioridade *</label>
          <select
            name="prioridade"
            value={formData.prioridade}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          >
            <option value="BAIXA">Baixa</option>
            <option value="MEDIA">Média</option>
            <option value="ALTA">Alta</option>
            <option value="CRITICA">Crítica</option>
          </select>
        </div>
        
        <div style={{ marginBottom: 15 }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 5 }}>Anexos (opcional)</label>
          <input
            type="file"
            multiple
            onChange={handleAnexos}
            style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          />
          {anexos.length > 0 && (
            <ul style={{ marginTop: 10, paddingLeft: 20 }}>
              {anexos.map((file, index) => (
                <li key={index}>
                  📄 {file.name} ({(file.size / 1024).toFixed(0)} KB)
                  <button
                    type="button"
                    onClick={() => removerAnexo(index)}
                    style={{ marginLeft: 10, padding: '2px 8px', background: '#dc3545', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
                  >
                    Remover
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
        
        <div>
          <button
            type="submit"
            disabled={loading}
            style={{ padding: 10, background: '#28a745', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', marginRight: 10 }}
          >
            {loading ? 'Criando...' : 'Criar Chamado'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            style={{ padding: 10, background: '#6c757d', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
          >
            Cancelar
          </button>
        </div>
        
        {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
      </form>
    </div>
  );
}

export default NovoChamado;
