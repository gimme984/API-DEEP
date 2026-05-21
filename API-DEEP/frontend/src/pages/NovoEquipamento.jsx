import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';

function NovoEquipamento() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [carregandoUsuarios, setCarregandoUsuarios] = useState(true);
  const [formData, setFormData] = useState({
    tipo: 'DESKTOP',
    responsavel: '',
    cpu: '',
    memoria: '',
    placa_mae: '',
    espaco_hd: '',
    modelo: '',
    fabricante: '',
    numero_serie: '',
    observacoes: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    // Carregar lista de TODOS os usuários
    const fetchUsuarios = async () => {
      try {
        const response = await api.get('usuarios/');
        console.log('Usuários carregados:', response.data);
        setUsuarios(response.data);
      } catch (err) {
        console.error('Erro ao carregar usuários:', err);
      } finally {
        setCarregandoUsuarios(false);
      }
    };
    fetchUsuarios();
    
    // Se for edição, carregar dados do equipamento
    if (id) {
      const fetchEquipamento = async () => {
        try {
          const response = await api.get(`equipamentos/${id}/`);
          setFormData({
            ...response.data,
            responsavel: response.data.responsavel || ''
          });
        } catch (err) {
          console.error(err);
        }
      };
      fetchEquipamento();
    }
  }, [id]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (id) {
        await api.put(`equipamentos/${id}/`, formData);
      } else {
        await api.post('equipamentos/', formData);
      }
      navigate('/inventario');
    } catch (err) {
      console.error('Erro:', err);
      setError('Erro ao salvar equipamento. Tente novamente.');
    }
    setLoading(false);
  };

  if (carregandoUsuarios) {
    return <div style={{ padding: 20, textAlign: 'center' }}>Carregando usuários...</div>;
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
      <button 
        onClick={() => navigate('/inventario')} 
        style={{ marginBottom: 20, padding: 8, background: '#6c757d', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
      >
        ← Voltar
      </button>
      
      <h2 style={{ marginBottom: 20 }}>{id ? 'Editar Equipamento' : 'Novo Equipamento'}</h2>
      
      <form onSubmit={handleSubmit}>
        {/* Linha 1: Tipo e Usuário Responsável */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 15 }}>
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 5 }}>Tipo *</label>
            <select 
              name="tipo" 
              value={formData.tipo} 
              onChange={handleChange} 
              required 
              style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
            >
              <option value="DESKTOP">Desktop</option>
              <option value="NOTEBOOK">Notebook</option>
              <option value="SERVIDOR">Servidor</option>
              <option value="MONITOR">Monitor</option>
              <option value="IMPRESSORA">Impressora</option>
              <option value="OUTRO">Outro</option>
            </select>
          </div>
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 5 }}>Usuário Responsável</label>
            <select 
              name="responsavel" 
              value={formData.responsavel || ''} 
              onChange={handleChange} 
              style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
            >
              <option value="">Selecione um usuário...</option>
              {usuarios.map(user => (
                <option key={user.id} value={user.id}>
                  {user.first_name || user.username} {user.last_name || ''} ({user.username})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Linha 2: CPU e Memória */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 15 }}>
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 5 }}>CPU / Processador</label>
            <input 
              type="text" 
              name="cpu" 
              value={formData.cpu || ''} 
              onChange={handleChange} 
              placeholder="Ex: Intel Core i7-10700" 
              style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
            />
          </div>
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 5 }}>Memória RAM</label>
            <input 
              type="text" 
              name="memoria" 
              value={formData.memoria || ''} 
              onChange={handleChange} 
              placeholder="Ex: 16GB DDR4" 
              style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
            />
          </div>
        </div>

        {/* Linha 3: Placa-mãe e Espaço HD */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 15 }}>
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 5 }}>Placa-mãe</label>
            <input 
              type="text" 
              name="placa_mae" 
              value={formData.placa_mae || ''} 
              onChange={handleChange} 
              placeholder="Ex: ASUS Prime B450" 
              style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
            />
          </div>
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 5 }}>Espaço em HD / SSD</label>
            <input 
              type="text" 
              name="espaco_hd" 
              value={formData.espaco_hd || ''} 
              onChange={handleChange} 
              placeholder="Ex: 512GB SSD" 
              style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
            />
          </div>
        </div>

        {/* Linha 4: Modelo e Fabricante */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 15, marginBottom: 15 }}>
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 5 }}>Modelo</label>
            <input 
              type="text" 
              name="modelo" 
              value={formData.modelo || ''} 
              onChange={handleChange} 
              placeholder="Ex: OptiPlex 7080" 
              style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
            />
          </div>
          <div>
            <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 5 }}>Fabricante</label>
            <input 
              type="text" 
              name="fabricante" 
              value={formData.fabricante || ''} 
              onChange={handleChange} 
              placeholder="Ex: Dell, HP, Lenovo" 
              style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
            />
          </div>
        </div>

        {/* Linha 5: Número de Série */}
        <div style={{ marginBottom: 15 }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 5 }}>Número de Série</label>
          <input 
            type="text" 
            name="numero_serie" 
            value={formData.numero_serie || ''} 
            onChange={handleChange} 
            placeholder="Ex: SN-123456789" 
            style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          />
        </div>

        {/* Linha 6: Observações */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontWeight: 'bold', display: 'block', marginBottom: 5 }}>Observações</label>
          <textarea 
            name="observacoes" 
            value={formData.observacoes || ''} 
            onChange={handleChange} 
            rows="3" 
            placeholder="Informações adicionais..." 
            style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 4 }}
          />
        </div>

        {/* Botões */}
        <div>
          <button 
            type="submit" 
            disabled={loading} 
            style={{ padding: 10, background: '#28a745', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer', marginRight: 10 }}
          >
            {loading ? 'Salvando...' : (id ? 'Atualizar' : 'Cadastrar')}
          </button>
          <button 
            type="button" 
            onClick={() => navigate('/inventario')} 
            style={{ padding: 10, background: '#6c757d', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}
          >
            Cancelar
          </button>
        </div>
        
        {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
      </form>
      
      {!id && (
        <div style={{ marginTop: 20, padding: 15, background: '#e8f4f8', borderRadius: 8 }}>
          <p style={{ margin: 0 }}>
            📌 O número de patrimônio será gerado automaticamente após o cadastro.
          </p>
        </div>
      )}
    </div>
  );
}

export default NovoEquipamento;
