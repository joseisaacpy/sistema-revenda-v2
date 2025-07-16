import { useState, useEffect } from "react";
import Loader from "../../Components/Loader";

const ListarClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento

  // const [paginaAtual, setPaginaAtual] = useState(1);

  // Buscar todos os clientes
  async function buscarClientes() {
    const url = `${import.meta.env.VITE_API_URL}/api/clientes`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      setClientes(data);
    } catch (error) {
      console.log("Erro ao buscar clientes:", error);
    } finally {
      setLoading(false); // Define o estado de carregamento como false
    }
  }

  useEffect(() => {
    buscarClientes();
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <section>
      <ul>
        {clientes.map((cliente) => (
          <li key={cliente.id}>
            <h2 className="text-lg font-semibold">{cliente.nome}</h2>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default ListarClientes;
