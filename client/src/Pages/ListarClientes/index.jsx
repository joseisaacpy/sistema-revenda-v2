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
    <section className="p-4">
      <h1 className="text-2xl font-semibold mb-4">
        Lista de Clientes Cadastrados
      </h1>
      <p className="mb-4">
        Quantidade de Clientes:{" "}
        <span className="font-bold">{clientes.length}</span>
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2 border sticky left-0 z-10">Nome</th>
              <th className="text-left p-2 border">CPF/CNPJ</th>
              <th className="text-left p-2 border">Telefone</th>
              <th className="text-left p-2 border">Data de Nascimento</th>
              <th className="text-left p-2 border">Qtde. Veic. Comprados</th>
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr
                key={cliente.nome}
                className="even:bg-gray-100 odd:bg-gray-300"
              >
                <td className="p-2 border sticky left-0 z-10">
                  {cliente.nome}
                </td>
                <td className="p-2 border">{cliente.cpf_cnpj}</td>
                <td className="p-2 border">{cliente.telefone_celular}</td>
                <td className="p-2 border">{cliente.data_nascimento}</td>
                <td className="p-2 border">
                  {cliente.quantidade_veic_comprados}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default ListarClientes;
