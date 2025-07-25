// Importa icones
import { FaEdit, FaTrash } from "react-icons/fa";
// Importa as bibliotecas
import { useState, useEffect } from "react";
// Loader
import Loader from "../../Components/Loader";
// Toastify pra notificações
import { ToastContainer, toast } from "react-toastify";
// Componente pra confirmar a exclusão
import ConfirmDeleteToast from "../../Components/ConfirmDeleteToast";

const ListarClientes = () => {
  const [clientes, setClientes] = useState([]); // Estado para armazenar os clientes
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento

  // Função de editar um cliente
  // Função de deletar um cliente
  async function deletarCliente(id, nome) {
    const handleConfirm = async () => {
      try {
        const url = `${import.meta.env.VITE_API_URL}/api/clientes/${id}`;
        const response = await fetch(url, { method: "DELETE" });
        if (response.ok) {
          toast.success(`Sr(a) ${nome} deletado com sucesso!`);
          buscarClientes();
        } else {
          toast.error("Erro ao deletar cliente!");
        }
      } catch (error) {
        toast.error("Erro ao deletar cliente!");
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

  // Chama a função buscarClientes ao montar o componente
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
        Quantidade de Clientes:
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
              <th className="text-left p-2 border">Ações</th>
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
                <td className="p-2 border">
                  {/* Chamar a tela de edição */}
                  <button className="mr-2 cursor-pointer">
                    <FaEdit className="text-blue-700" />
                  </button>
                  <button
                    className="cursor-pointer"
                    onClick={() => deletarCliente(cliente.id, cliente.nome)}
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
  );
};

export default ListarClientes;
