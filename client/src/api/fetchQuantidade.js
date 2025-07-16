// Função para buscar dados de quantidades
const fetchQuantidade = async (endpoint) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`);
    const data = await response.json();
    return data.length; // ou `data.total` dependendo da estrutura da sua API
  } catch (error) {
    console.error(`Erro ao buscar dados de ${endpoint}:`, error);
    return 0;
  }
};

export default fetchQuantidade;
