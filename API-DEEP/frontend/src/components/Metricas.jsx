import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

function Metricas() {
  const { user } = useAuth();
  const [metricas, setMetricas] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarMetricas();
  }, []);

  const carregarMetricas = async () => {
    try {
      const response = await api.get('metricas/');
      setMetricas(response.data);
    } catch (err) {
      console.error('Erro ao carregar métricas:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Carregando métricas...</div>;
  if (!metricas) return null;

  const isTecnico = user?.funcao === 'TECNICO' || user?.funcao === 'ADMIN_TI';

  return (
    <div style={{ marginBottom: 30 }}>
      {/* Cards de resumo */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20, marginBottom: 30 }}>
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', padding: 20, borderRadius: 8, color: 'white' }}>
          <div style={{ fontSize: 28, fontWeight: 'bold' }}>{metricas.tempo_medio_resolucao}h</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Tempo médio de resolução</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', padding: 20, borderRadius: 8, color: 'white' }}>
          <div style={{ fontSize: 28, fontWeight: 'bold' }}>{metricas.abertos_7dias}</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Chamados abertos (7 dias)</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', padding: 20, borderRadius: 8, color: 'white' }}>
          <div style={{ fontSize: 28, fontWeight: 'bold' }}>{metricas.resolvidos_7dias}</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Chamados resolvidos (7 dias)</div>
        </div>
        <div style={{ background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)', padding: 20, borderRadius: 8, color: 'white' }}>
          <div style={{ fontSize: 28, fontWeight: 'bold' }}>{((metricas.resolvidos_7dias / (metricas.abertos_7dias || 1)) * 100).toFixed(0)}%</div>
          <div style={{ fontSize: 14, opacity: 0.9 }}>Taxa de resolução</div>
        </div>
      </div>

      {/* Gráfico de tendência semanal */}
      <div style={{ border: '1px solid #ddd', padding: 20, borderRadius: 8, marginBottom: 20 }}>
        <h3 style={{ marginTop: 0, marginBottom: 20 }}>📈 Tendência Semanal</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={metricas.tendencia_semanal}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="dia" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="abertos" stroke="#dc3545" name="Abertos" />
            <Line type="monotone" dataKey="resolvidos" stroke="#28a745" name="Resolvidos" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Gráfico de chamados por prioridade */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div style={{ border: '1px solid #ddd', padding: 20, borderRadius: 8 }}>
          <h3 style={{ marginTop: 0, marginBottom: 20 }}>📊 Chamados por Prioridade</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={metricas.prioridades}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="prioridade" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" name="Quantidade" fill="#8884d8">
                {metricas.prioridades.map((entry, index) => (
                  <Bar dataKey="total" fill={entry.color} key={index} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Ranking de técnicos (apenas para admin/técnico) */}
        {isTecnico && (
          <div style={{ border: '1px solid #ddd', padding: 20, borderRadius: 8 }}>
            <h3 style={{ marginTop: 0, marginBottom: 20 }}>🏆 Ranking de Técnicos</h3>
            {metricas.ranking_tecnicos.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#666' }}>Nenhum chamado resolvido ainda.</p>
            ) : (
              <div>
                {metricas.ranking_tecnicos.map((tecnico, index) => (
                  <div key={index} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '10px 0',
                    borderBottom: '1px solid #eee'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ 
                        fontSize: 20,
                        fontWeight: 'bold',
                        color: index === 0 ? '#ffd700' : index === 1 ? '#c0c0c0' : index === 2 ? '#cd7f32' : '#999'
                      }}>
                        #{index + 1}
                      </span>
                      <strong>{tecnico.nome}</strong>
                    </div>
                    <div>
                      <span style={{ 
                        background: '#28a745', 
                        color: 'white', 
                        padding: '4px 12px', 
                        borderRadius: 20,
                        fontWeight: 'bold'
                      }}>
                        {tecnico.total} chamados
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Metricas;
