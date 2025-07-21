import { useState, useEffect } from "react";
// Para notificações
import { ToastContainer, toast } from "react-toastify";

const CadastroVenda = () => {
  // Estado do loading
  //   const [loading, setLoading] = useState(true);

  // Estado para armazenar os dados (todos os campos iniciam vazios)
  const [formData, setFormData] = useState({
    clientesCadastrados: "",
    veiculosDisponiveis: "",
    dataVenda: "",
    valorVenda: "",
    formaPagamento: "",
    observacoes: "",
  });

  // Função pra lidar com o preenchimento do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Função pra pegar clientes cadastrados e os veículos em estoque
  const fecthData = async () => {
    console.log("Buscando dados...");
  };

  //   useEffect pra chamar a função que faz a busca
  useEffect(() => {
    // Chama a função
    fecthData();
  }, []);

  //   Função pra lidar com o envio do form
  const handleSubmit = async (e) => {
    e.preventDefault(); // Impede o envio do formulário
    // Valida o formulário
    if (!validateForm()) {
      toast.error("Corrija os erros e tente novamente!");
      return;
    } else {
      try {
        const url = `${import.meta.env.VITE_API_URL}/api/vendas`;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          toast.success("Venda cadastrada com sucesso!");
          // Limpa os campos do formulário
          setFormData({
            clientesCadastrados: "",
            veiculosDisponiveis: "",
            dataVenda: "",
            valorVenda: "",
            formaPagamento: "",
            observacoes: "",
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <form
      className="space-y-4 flex flex-col gap-4 border border-gray-300 p-4 rounded-lg bg-blue-100"
      id="vendaForm"
      onSubmit={handleSubmit}
    >
      <h1 className="text-2xl font-bold">Cadastro de Venda</h1>
      <div className="flex flex-col">
        <label htmlFor="clientesCadastrados">Selecione o comprador</label>
        <select
          className="border p-2 rounded-md"
          name="clientesCadastrados"
          id="clientesCadastrados"
          value={formData.clientesCadastrados}
          onChange={handleChange}
        >
          <option value="">Selecione um comprador</option>
          {/* Aqui, teremos os clientes sendo renderizados dinaamicamente a partir da API de clientes */}
        </select>
      </div>
      <div className="flex flex-col">
        <label htmlFor="veiculosDisponiveis">Selecione o veículo</label>
        <select
          className="border p-2 rounded-md"
          name="veiculosDisponiveis"
          id="veiculosDisponiveis"
          value={formData.veiculosDisponiveis}
          onChange={handleChange}
        >
          <option value="">Selecione um veículo</option>
          {/* Aqui, teremos os veículos sendo renderizados dinaamicamente a partir da API de veículos */}
        </select>
      </div>

      <div className="flex flex-col">
        <label htmlFor="dataVenda">Data da Venda</label>
        <input
          type="date"
          className="border p-2 rounded-md"
          id="dataVenda"
          name="dataVenda"
          placeholder="Digite o valor da venda"
          value={formData.dataVenda}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="valorVenda">Valor da Venda (R$)</label>
        <input
          type="number"
          className="border p-2 rounded-md"
          id="valorVenda"
          name="valorVenda"
          placeholder="Digite o valor da venda"
          value={formData.valorVenda}
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="formaPagamento">Forma de Pagamento</label>
        <select
          className="border p-2 rounded-md"
          id="formaPagamento"
          name="formaPagamento"
          value={formData.formaPagamento}
          onChange={handleChange}
        >
          <option value="">Selecione uma forma de pagamento</option>
          <option value="Dinheiro">Dinheiro</option>
          <option value="Cartão de Crédito">Cartão de Crédito</option>
          <option value="Cartão de Débito">Cartão de Débito</option>
          <option value="Cheque">Cheque</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label htmlFor="observacoes">Observações</label>
        <textarea
          type="text"
          className="border p-2 rounded-md"
          id="observacoes"
          name="observacoes"
          placeholder="Digite as observações"
          value={formData.observacoes}
          onChange={handleChange}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Cadastrar
      </button>

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
    </form>
  );
};

export default CadastroVenda;
