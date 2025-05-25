import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5173'
});

export default api;

/**
 * @param {number} sponsorId - ID do patrocinador
 * @returns {Promise<Object>} Objeto contendo totalLojas e totalUsuarios
 */
export const fetchSponsorStats = async (sponsorId) => {
  try {
    const response = await api.get(`/sponsors/${sponsorId}/stats`);
    console.log(response);
    
    if (!response.ok) {
      throw new Error(`Erro ao buscar estatísticas do patrocinador: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    throw error;
  }
};

/**
 * Busca o total de lojas para um patrocinador específico
 * @param {number} sponsorId - ID do patrocinador
 * @returns {Promise<Object>} Objeto contendo totalLojas
 */
export const fetchTotalLojas = async (sponsorId) => {
  const stats = await fetchSponsorStats(sponsorId);
  return { totalLojas: stats.totalStores };
};

/**
 * Busca o total de usuários impactados por um patrocinador específico
 * @param {number} sponsorId - ID do patrocinador
 * @returns {Promise<Object>} Objeto contendo totalUsuarios
 */
export const fetchTotalUsuarios = async (sponsorId) => {
  const stats = await fetchSponsorStats(sponsorId);
  return { totalUsuarios: stats.impactedUsers };
};
