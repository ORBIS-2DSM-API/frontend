const API_BASE_URL = 'http://localhost:3001';

/**
 * @param {number} sponsorId - ID do patrocinador
 * @returns {Promise<Object>} Objeto contendo totalLojas e totalUsuarios
 */
export const fetchSponsorStats = async (sponsorId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/sponsors/${sponsorId}/stats`);
    
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
