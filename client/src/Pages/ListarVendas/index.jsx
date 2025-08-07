// Importa icones (se você for usar)
import { FaRegFilePdf } from "react-icons/fa";

// Importa as bibliotecas
import { useState, useEffect } from "react";

// Loader
import Loader from "../../Components/Loader";
// Para notificações
import { ToastContainer, toast } from "react-toastify";

const ListarVendas = () => {
  // Renomeado para PascalCase
  const [vendas, setVendas] = useState([]); // Estado para armazenar as vendas
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
  const [error, setError] = useState(null); // Novo estado para lidar com erros

  // Função para buscar todas as vendas
  async function buscarVendas() {
    const token = localStorage.getItem("token");

    const url = `${import.meta.env.VITE_API_URL}/api/vendas`; // URL da sua API de vendas
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        // Verifica se a resposta HTTP foi bem-sucedida (status 2xx)
        const errorData = await response.json();
        throw new Error(
          errorData.error ||
            `Erro HTTP: ${response.status} - ${response.statusText}`
        );
      }
      const data = await response.json();
      setVendas(data);
      setError(null); // Limpa qualquer erro anterior
    } catch (err) {
      console.error("Erro ao buscar vendas:", err);
      setError(
        "Não foi possível carregar as vendas. Tente novamente mais tarde."
      );
      toast.error("Erro ao carregar vendas. Verifique a conexão com a API.");
    } finally {
      setLoading(false); // Define o estado de carregamento como false, independentemente do sucesso/erro
    }
  }

  // Função pra lidar com o Download do recibo
  const handleDownloadPDF = async (vendaId) => {
    try {
      const token = localStorage.getItem("token");
      const apiUrl = `${
        import.meta.env.VITE_API_URL
      }/api/vendas/${vendaId}/recibo`;

      const response = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao gerar o recibo");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Abre em nova aba ou baixa direto
      const link = document.createElement("a");
      link.href = url;
      link.download = `recibo-venda-${vendaId}.pdf`;
      link.target = "_blank";
      link.click();

      // Limpa o objeto depois de um tempo
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error("Erro ao baixar o recibo:", error);
      alert("Erro ao gerar recibo em PDF");
    }
  };

  // Chama a função buscarVendas ao montar o componente
  useEffect(() => {
    buscarVendas();
    // Muda o title
    document.title = "Listagem de Vendas";
  }, []); // Array de dependências vazio para rodar apenas uma vez na montagem

  if (loading) {
    return <Loader />; // Exibe o loader enquanto os dados estão sendo buscados
  }

  if (error) {
    return (
      <section className="p-4 text-center">
        <h1 className="text-2xl font-semibold mb-4">
          Lista de Vendas Realizadas
        </h1>
        <p className="text-red-500 text-lg">{error}</p>
        <button
          onClick={buscarVendas} // Botão para tentar recarregar
          className="cursor-pointer mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Tentar Novamente
        </button>
      </section>
    );
  }

  // Se não há vendas e não há erro
  if (vendas.length === 0) {
    return (
      <section className="p-4 text-center">
        <h1 className="text-2xl font-semibold mb-4">
          Lista de Vendas Realizadas
        </h1>
        <p className="text-gray-600 text-lg">Nenhuma venda encontrada.</p>
      </section>
    );
  }

  return (
    <section className="p-4">
      <h1 className="text-2xl font-semibold mb-4">
        Lista de Vendas Realizadas
      </h1>
      <p className="mb-4">
        Quantidade de vendas: <span className="font-bold">{vendas.length}</span>
      </p>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-2 border">Data da Venda</th>
              <th className="text-left p-2 border">Cliente</th>
              <th className="text-left p-2 border">Veículo</th>
              <th className="text-left p-2 border">Valor da Venda</th>
              <th className="text-left p-2 border">Forma de Pagamento</th>
              <th className="text-left p-2 border">Observação</th>
              <th className="text-left p-2 border">Ações</th>
            </tr>
          </thead>
          <tbody>
            {vendas.map((venda) => (
              <tr key={venda.id} className="even:bg-gray-100 odd:bg-gray-300">
                <td className="p-2 border">
                  {new Date(venda.data_venda).toLocaleDateString("pt-BR")}
                </td>
                <td className="p-2 border">
                  {venda.cliente_nome || "N/A"} -
                  {venda.cliente_cpf_cnpj || "N/A"}
                </td>
                <td className="p-2 border">
                  {venda.veiculo_marca || "N/A"} {venda.veiculo_modelo || "N/A"}
                  - ({venda.veiculo_placa || "N/A"})
                </td>
                <td className="p-2 border">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(venda.valor_venda)}
                </td>
                <td className="p-2 border">{venda.forma_pagamento}</td>
                <td className="p-2 border">{venda.observacoes || "N/A"}</td>
                <td className="p-2 border">
                  <FaRegFilePdf
                    onClick={() => handleDownloadPDF(venda.id)}
                    className="cursor-pointer"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ToastContainer />
    </section>
  );
};

export default ListarVendas;
