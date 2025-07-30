// Função para buscar dados de quantidades
const fetchQuantidade = async (endpoint) => {
  try {
    const token = localStorage.getItem("token");
    console.log("Enviando token:", token); // <- confirme que aparece no console

    const response = await fetch(`${import.meta.env.VITE_API_URL}${endpoint}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    return data.length; // ou `data.total` dependendo da estrutura da sua API
  } catch (error) {
    console.error(`Erro ao buscar dados de ${endpoint}:`, error);
    return 0;
  }
};

export default fetchQuantidade;
