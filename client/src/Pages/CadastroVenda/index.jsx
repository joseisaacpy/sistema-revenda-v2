import { useState, useEffect } from "react";
// Para notificações
import { ToastContainer, toast } from "react-toastify";
// Loader
import Loader from "../../Components/Loader";

const CadastroVenda = () => {
  // Estado do loading
  const [loading, setLoading] = useState(true);

  // Estado dos erros
  const [error, setError] = useState(null); // Para erros no carregamento inicial

  // Estado dos clientes
  const [clientes, setClientes] = useState([]); // Começa vazio e usa o set pra atualizar após o fetch
  // Estado dos veiculos
  const [veiculos, setVeiculos] = useState([]); // Começa vazio

  // Estado para armazenar os dados (todos os campos iniciam vazios)
  const [formData, setFormData] = useState({
    id_cliente: "",
    id_veiculo: "",
    data_venda: new Date().toISOString().slice(0, 10), // Define a data atual como padrão
    valor_venda: "",
    forma_pagamento: "",
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
  const fetchData = async () => {
    setError(null); // Limpa erros anteriores
    try {
      // URL da API
      const url = `${import.meta.env.VITE_API_URL}`;
      // Faz a chamada assíncrona dos dois endpoints
      const [resClientes, resVeiculos] = await Promise.all([
        fetch(`${url}/api/clientes`),
        fetch(`${url}/api/veiculos`),
      ]);

      // Verifica se a chamada foi bem sucedida
      if (!resClientes.ok) {
        throw new Error(`Erro ao buscar clientes: ${resClientes.statusText}`);
      }
      if (!resVeiculos.ok) {
        throw new Error(`Erro ao buscar veículos: ${resVeiculos.statusText}`);
      }
      // Pega os dados da API e coloca numa variável
      const dataClientes = await resClientes.json(); // Pega todas as informações de clientes
      const dataVeiculos = await resVeiculos.json().then((data) => {
        // Pega todos os veículos que estão com status "estoque" (status==="estoque")
        return data.filter((veiculo) => {
          return veiculo.status === "estoque";
        });
      });
      // Atualiza os estados usando as variáveis
      setClientes(dataClientes);
      setVeiculos(dataVeiculos);
    } catch (error) {
      console.error(error);
      setError("Erro ao carregar dados. Verifique a conexão com a API.");
      toast.error("Erro ao buscar dados!");
    } finally {
      setLoading(false);
    }
  };

  // Validação do formulário
  const validateForm = () => {
    if (!formData.id_cliente) {
      toast.error("Selecione o comprador.");
      return false;
    }
    if (!formData.id_veiculo) {
      toast.error("Selecione o veículo.");
      return false;
    }
    if (!formData.data_venda) {
      toast.error("Informe a data da venda.");
      return false;
    }
    const valor = parseFloat(formData.valor_venda);
    if (isNaN(valor) || valor <= 0) {
      toast.error("O valor da venda deve ser um número positivo.");
      return false;
    }
    if (!formData.forma_pagamento) {
      toast.error("Selecione a forma de pagamento.");
      return false;
    }
    return true;
  };

  //   useEffect pra chamar a função que faz a busca
  useEffect(() => {
    // Chama a função
    fetchData();
  }, []);

  //   Função pra lidar com o envio do form

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return; // Já exibe o toast de erro dentro do validateForm
    }

    setLoading(true); // Ativa o loading para o envio
    try {
      const url = `${import.meta.env.VITE_API_URL}`;
      const payload = {
        id_cliente: parseInt(formData.id_cliente),
        id_veiculo: parseInt(formData.id_veiculo),
        data_venda: formData.data_venda,
        valor_venda: parseFloat(formData.valor_venda),
        forma_pagamento: formData.forma_pagamento,
        observacoes: formData.observacoes,
      };

      const response = await fetch(`${url}/api/vendas`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload), // Envia o payload com os tipos corretos
      });

      if (response.ok) {
        toast.success("Venda cadastrada com sucesso!");
        // Limpa os campos do formulário para um novo cadastro
        setFormData({
          id_cliente: "",
          id_veiculo: "",
          data_venda: new Date().toISOString().slice(0, 10), // Reinicia com a data atual
          valor_venda: "",
          forma_pagamento: "",
          observacoes: "",
        });
        // Recarrega a lista de veículos para remover o vendido
        fetchData(); // Chama fetchData para atualizar a lista de veículos em estoque
      } else {
        const errorData = await response.json();
        const errorMessage =
          errorData.error || "Erro desconhecido ao cadastrar venda.";
        toast.error(`Erro: ${errorMessage}`);
        console.error("Erro no backend:", errorData);
        console.log(url);
      }
    } catch (error) {
      console.error("Erro ao enviar venda:", error);
      toast.error("Erro na comunicação com o servidor.");
    } finally {
      setLoading(false); // Desativa o loading
    }
  };

  {
    if (loading) {
      return <Loader />;
    }
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-xl font-semibold text-red-600">{error}</p>
      </div>
    );
  }
  return (
    <form
      className="space-y-4 flex flex-col gap-4 border border-gray-300 p-4 rounded-lg bg-blue-50 shadow-lg"
      id="vendaForm"
      onSubmit={handleSubmit}
    >
      <h1 className="text-3xl font-bold text-gray-800  mb-6">
        Cadastro de Venda
      </h1>

      <div className="flex flex-col">
        <label
          htmlFor="id_cliente"
          className="text-sm font-medium text-gray-700 mb-1"
        >
          Selecione o comprador
        </label>
        <select
          className="border p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
          name="id_cliente" // Nome do campo atualizado
          id="id_cliente"
          value={formData.id_cliente}
          onChange={handleChange}
          required
        >
          <option value="">Selecione um comprador</option>
          {clientes.map((cliente) => (
            <option key={cliente.id} value={cliente.id}>
              {cliente.nome} ({cliente.cpf_cnpj}) {/* Exibe nome e CPF/CNPJ */}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label
          htmlFor="id_veiculo"
          className="text-sm font-medium text-gray-700 mb-1"
        >
          Selecione o veículo
        </label>
        <select
          className="border p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
          name="id_veiculo" // Nome do campo atualizado
          id="id_veiculo"
          value={formData.id_veiculo}
          onChange={handleChange}
          required
        >
          <option value="">Selecione um veículo</option>
          {veiculos.map((veiculo) => (
            <option key={veiculo.id} value={veiculo.id}>
              {veiculo.marca} - {veiculo.modelo} ({veiculo.placa}){" "}
              {/* Exibe mais detalhes */}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col">
        <label
          htmlFor="data_venda"
          className="text-sm font-medium text-gray-700 mb-1"
        >
          Data da Venda
        </label>
        <input
          type="date"
          className="border p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
          id="data_venda"
          name="data_venda" // Nome do campo atualizado
          value={formData.data_venda}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex flex-col">
        <label
          htmlFor="valor_venda"
          className="text-sm font-medium text-gray-700 mb-1"
        >
          Valor da Venda (R$)
        </label>
        <input
          type="number"
          className="border p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
          id="valor_venda"
          name="valor_venda" // Nome do campo atualizado
          placeholder="Ex: 85000.00"
          value={formData.valor_venda}
          onChange={handleChange}
          step="0.01" // Permite valores decimais
          min="0.01" // Garante que o valor é positivo
          required
        />
      </div>

      <div className="flex flex-col">
        <label
          htmlFor="forma_pagamento"
          className="text-sm font-medium text-gray-700 mb-1"
        >
          Forma de Pagamento
        </label>
        <select
          className="border p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
          id="forma_pagamento"
          name="forma_pagamento" // Nome do campo atualizado
          value={formData.forma_pagamento}
          onChange={handleChange}
          required
        >
          <option value="">Selecione uma forma de pagamento</option>
          <option value="Dinheiro">Dinheiro</option>
          <option value="Cartão de Crédito">Cartão de Crédito</option>
          <option value="Cartão de Débito">Cartão de Débito</option>
          <option value="Financiamento">Financiamento</option>
          <option value="Troca">Troca</option>
          <option value="PIX">PIX</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label
          htmlFor="observacoes"
          className="text-sm font-medium text-gray-700 mb-1"
        >
          Observações
        </label>
        <textarea
          className="border p-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
          id="observacoes"
          name="observacoes" // Nome do campo atualizado
          placeholder="Digite observações adicionais sobre a venda (opcional)"
          value={formData.observacoes}
          onChange={handleChange}
          rows="3"
        />
      </div>

      <button
        type="submit"
        className="cursor-pointer bg-blue-600 text-white p-3 rounded-md hover:bg-blue-700 transition duration-200 ease-in-out font-semibold text-lg"
        disabled={loading} // Desabilita o botão enquanto carrega
      >
        {loading ? "Registrando Venda..." : "Registrar Venda"}
      </button>

      <ToastContainer
        position="bottom-right" // Mudado para bottom-right para melhor visibilidade
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
