// Importa icones
import { FaEdit, FaTimes, FaTrash } from "react-icons/fa";
// Importa as bibliotecas
import { useState, useEffect } from "react";
// Loader
import Loader from "../../Components/Loader";
// Toastify pra notificações
import { ToastContainer, toast } from "react-toastify";
//
import ConfirmDeleteToast from "../../Components/ConfirmDeleteToast";

const ListarVeiculos = () => {
  const [veiculos, setVeiculos] = useState([]); // Estado para armazenar os veiculos
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento

  // Função de editar um cliente
  // Função de deletar um cliente
  async function deletarVeiculo(id) {
    const handleConfirm = async () => {
      try {
        const token = localStorage.getItem("token");
        const url = `${import.meta.env.VITE_API_URL}/api/veiculos/${id}`;
        const response = await fetch(url, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.ok) {
          toast.success(`Veiculo deletado com sucesso!`);
          buscarVeiculos();
        } else {
          toast.error("Erro ao deletar veículo!");
        }
      } catch (error) {
        toast.error("Erro ao deletar veículo!");
        console.error(error);
      }
    };

    const handleCancel = () => {
      // Opcional: aqui você pode colocar algo caso o usuário cancele
    };

    // Chama o toast de confirmação
    toast.info(
      <ConfirmDeleteToast onConfirm={handleConfirm} onCancel={handleCancel} />,
      {
        autoClose: false, // Não fecha automaticamente para o usuário decidir
        closeButton: false, // Remove o botão de fechar padrão para forçar ação
      }
    );
  }

  // Buscar todos os clientes
  async function buscarVeiculos() {
    const token = localStorage.getItem("token");
    const url = `${import.meta.env.VITE_API_URL}/api/veiculos`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setVeiculos(data);
    } catch (error) {
      console.log("Erro ao buscar veículos:", error);
    } finally {
      setLoading(false); // Define o estado de carregamento como false
    }
  }

  // Chama a função buscarClientes ao montar o componente
  useEffect(() => {
    buscarVeiculos();
    // Muda o title
    document.title = "Listagem de Veículos";
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <section className="p-4">
        <h1 className="text-2xl font-semibold mb-4">Lista de Veículos</h1>
        <p className="mb-4">
          Quantidade de Veículos:{" "}
          <span className="font-bold">{veiculos.length}</span>
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-2 border">Placa</th>
                <th className="text-left p-2 border">Modelo</th>
                <th className="text-left p-2 border">Ano</th>
                <th className="text-left p-2 border">Cor</th>
                <th className="text-left p-2 border">Km</th>
                <th className="text-left p-2 border">Valor</th>
                <th className="text-left p-2 border">Ações</th>
              </tr>
            </thead>
            <tbody>
              {veiculos.map((veiculo) => (
                <tr
                  key={veiculo.id}
                  className="even:bg-gray-100 odd:bg-gray-300"
                >
                  <td className="p-2 border">{veiculo.placa}</td>
                  <td className="p-2 border">{veiculo.modelo}</td>
                  <td className="p-2 border">{veiculo.ano_modelo}</td>
                  <td className="p-2 border">{veiculo.cor}</td>
                  <td className="p-2 border">{veiculo.km}</td>
                  {/* Valor compra em formato monetário R$ */}
                  <td className="p-2 border">
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(veiculo.valor_compra)}
                  </td>
                  <td className="p-2 border">
                    {/* Chamar a tela de edição */}
                    <button className="mr-2 cursor-pointer">
                      <FaEdit className="text-blue-700" />
                    </button>
                    <button
                      className="cursor-pointer"
                      onClick={() => deletarVeiculo(veiculo.id)}
                    >
                      {/* Chamar função de exclusão */}
                      <FaTrash className="text-red-700" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </section>
    </>
  );
};

export default ListarVeiculos;
