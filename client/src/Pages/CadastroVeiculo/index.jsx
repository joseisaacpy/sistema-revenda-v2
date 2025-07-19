import { useState } from "react";
// Para notificações
import { ToastContainer, toast } from "react-toastify";

const CadastroVeiculos = () => {
  // Dados do formulário
  const [formData, setFormData] = useState({
    modelo: "",
    marca: "",
    chassi: "",
    renavam: "",
    placa: "",
    ano_modelo: "",
    cor: "",
    combustivel: "",
    km: "",
    valor_compra: "",
    valor_venda_sugerido: "",
    status_estoque: "",
    data_compra: "",
  });

  // Função pra lidar com o preenchimento do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Função pra lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Adiciona os dados enviados numa variável, mas com uma pequena modificação dos tipos
    const veiculo = {
      ...formData,
      ano_modelo: parseInt(formData.ano_modelo),
      km: parseInt(formData.km),
      valor_compra: parseFloat(formData.valor_compra),
      valor_venda_sugerido: parseFloat(formData.valor_venda_sugerido),
    };

    // Fazendo o envio dos dados
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/veiculos`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(veiculo),
      });

      const data = await res.json();

      if (res.ok) {
        // Mostra uma mensagem de sucesso
        toast.success("Carro cadastrado com sucesso!");
        // Limpa o formulário
        setFormData({
          modelo: "",
          marca: "",
          chassi: "",
          renavam: "",
          placa: "",
          ano_modelo: "",
          cor: "",
          combustivel: "",
          km: "",
          valor_compra: "",
          valor_venda_sugerido: "",
          status_estoque: "",
          data_compra: "",
        });
      } else {
        // Mostra uma mensagem de erro
        toast.error("Erro ao cadastrar carro!");
        console.error("Erro ao cadastrar carro:", data);
      }
    } catch (error) {
      // Mostra uma mensagem de erro
      toast.error("Erro ao cadastrar carro!");
      console.error("Erro ao cadastrar carro:", error);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 flex flex-col gap-4 border border-gray-300 p-4 rounded-lg bg-blue-100"
      id="veiculoForm"
    >
      <h1 className="text-2xl font-bold">Cadastro de Veículos</h1>
      <div className="flex flex-col">
        <label htmlFor="modelo">Modelo:</label>
        <input
          className="border p-2 rounded-md"
          id="modelo"
          name="modelo"
          value={formData.modelo}
          onChange={handleChange}
          placeholder="Ex: Uno"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="marca">Marca:</label>
        <input
          className="border p-2 rounded-md"
          id="marca"
          name="marca"
          value={formData.marca}
          onChange={handleChange}
          placeholder="Ex: Fiat"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="chassi">Chassi:</label>
        <input
          className="border p-2 rounded-md"
          id="chassi"
          name="chassi"
          value={formData.chassi}
          minLength={17}
          maxLength={17}
          placeholder="Digite o número do chassi"
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="placa">Placa:</label>
        <input
          className="border p-2 rounded-md"
          id="placa"
          name="placa"
          value={formData.placa}
          minLength={7}
          maxLength={7}
          placeholder="Ex: ABC1D23"
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="renavam">Renavam:</label>
        <input
          className="border p-2 rounded-md"
          id="renavam"
          name="renavam"
          value={formData.renavam}
          minLength={9}
          maxLength={11}
          placeholder="Digite o número do Renavam"
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="ano_modelo">Ano Modelo:</label>
        <input
          className="border p-2 rounded-md"
          id="ano_modelo"
          name="ano_modelo"
          value={formData.ano_modelo}
          minLength={4}
          placeholder="Ano Modelo"
          type="number"
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="cor">Cor:</label>
        <input
          className="border p-2 rounded-md"
          id="cor"
          name="cor"
          value={formData.cor}
          onChange={handleChange}
          placeholder="Ex: Preto"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="combustivel">Combustível:</label>
        <select
          className="border p-2 rounded-md"
          id="combustivel"
          name="combustivel"
          value={formData.combustivel}
          onChange={handleChange}
        >
          <option value="">Selecione o combustível</option>
          <option value="Gasolina">Gasolina</option>
          <option value="Álcool">Álcool</option>
          <option value="Diesel">Diesel</option>
          <option value="Flex">Flex</option>
          <option value="Elétrico">Elétrico</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label htmlFor="km">KM:</label>
        <input
          className="border p-2 rounded-md"
          id="km"
          name="km"
          value={formData.km}
          onChange={handleChange}
          placeholder="Ex: 45000"
          type="number"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="valor_compra">Valor de Compra:</label>
        <input
          className="border p-2 rounded-md"
          id="valor_compra"
          name="valor_compra"
          value={formData.valor_compra}
          onChange={handleChange}
          placeholder="Digite o valor de compra"
          type="number"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="valor_venda_sugerido">Valor Venda Sugerido:</label>
        <input
          className="border p-2 rounded-md"
          id="valor_venda_sugerido"
          name="valor_venda_sugerido"
          value={formData.valor_venda_sugerido}
          onChange={handleChange}
          placeholder="Digite o valor sugerido para venda"
          type="number"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="status_estoque">Status Estoque:</label>
        <select
          className="border p-2 rounded-md"
          id="status_estoque"
          name="status_estoque"
          value={formData.status_estoque}
          onChange={handleChange}
        >
          <option value="">Selecione o status</option>
          <option value="Disponível">Disponível</option>
          <option value="Vendido">Vendido</option>
          <option value="Reservado">Reservado</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label htmlFor="data_compra">Data da Compra:</label>
        <input
          className="border p-2 rounded-md"
          id="data_compra"
          name="data_compra"
          value={formData.data_compra}
          onChange={handleChange}
          type="date"
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Cadastrar
      </button>

      <ToastContainer />
    </form>
  );
};

export default CadastroVeiculos;
