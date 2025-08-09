import { useEffect } from "react";
// Para notificações
import { ToastContainer, toast } from "react-toastify";
// Para validação de formulários
import veiculoSchema from "../../Validators/veiculoSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const CadastroVeiculo = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(veiculoSchema) });

  // Função pra lidar com o envio do formulário
  const onSubmit = async (data) => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/veiculos`;
      const token = localStorage.getItem("token");

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Erro ao cadastrar veículo.");
      }
      const result = await response.json();
      console.log("Veículo cadastrado com sucesso:", result);
      toast.success("Cadastro realizado com sucesso!");
      // Limpa o formulário
      document.getElementById("veiculoForm").reset();
    } catch (error) {
      // Mostra uma mensagem de erro
      toast.error("Erro ao cadastrar veículo!");
      console.error("Erro ao cadastrar veículo:", error);
    }
  };

  // useEffect para mudar o title
  useEffect(() => {
    document.title = "Cadastro de Veículos";
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 flex flex-col gap-4 border border-gray-300 p-4 rounded-lg bg-blue-50"
      id="veiculoForm"
    >
      <h1 className="text-2xl font-bold">Cadastro de Veículos</h1>
      <div className="flex flex-col">
        <label htmlFor="modelo">Modelo:</label>
        <input
          className="border p-2 rounded-md"
          id="modelo"
          {...register("modelo")}
          placeholder="Ex: Uno"
        />
        {errors.modelo && (
          <p className="text-red-600 text-sm">{errors.modelo.message}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="marca">Marca:</label>
        <input
          className="border p-2 rounded-md"
          id="marca"
          {...register("marca")}
          placeholder="Ex: Fiat"
        />
        {errors.marca && (
          <p className="text-red-600 text-sm">{errors.marca.message}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="chassi">Chassi:</label>
        <input
          className="border p-2 rounded-md"
          id="chassi"
          {...register("chassi")}
          placeholder="Digite o número do chassi"
        />
        {errors.chassi && (
          <p className="text-red-600 text-sm">{errors.chassi.message}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="placa">Placa:</label>
        <input
          className="border p-2 rounded-md"
          id="placa"
          {...register("placa")}
          placeholder="Ex: ABC1D23"
        />
        {errors.placa && (
          <p className="text-red-600 text-sm">{errors.placa.message}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="renavam">Renavam:</label>
        <input
          className="border p-2 rounded-md"
          id="renavam"
          {...register("renavam")}
          placeholder="Digite o número do Renavam"
        />
        {errors.renavam && (
          <p className="text-red-600 text-sm">{errors.renavam.message}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="ano_modelo">Ano Modelo:</label>
        <input
          className="border p-2 rounded-md"
          id="ano_modelo"
          {...register("ano_modelo", { valueAsNumber: true })}
          placeholder="Ano Modelo"
          type="number"
        />
        {errors.ano_modelo && (
          <p className="text-red-600 text-sm">{errors.ano_modelo.message}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="cor">Cor:</label>
        <input
          className="border p-2 rounded-md"
          id="cor"
          {...register("cor")}
          placeholder="Ex: Preto"
        />
        {errors.cor && (
          <p className="text-red-600 text-sm">{errors.cor.message}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="combustivel">Combustível:</label>
        <select
          className="border p-2 rounded-md"
          id="combustivel"
          {...register("combustivel")}
        >
          <option value="">Selecione o combustível</option>
          <option value="Gasolina">Gasolina</option>
          <option value="Álcool">Álcool</option>
          <option value="Diesel">Diesel</option>
          <option value="Flex">Flex</option>
          <option value="Elétrico">Elétrico</option>
        </select>
        {errors.combustivel && (
          <p className="text-red-600 text-sm">{errors.combustivel.message}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="km">KM:</label>
        <input
          className="border p-2 rounded-md"
          id="km"
          {...register("km", { valueAsNumber: true })}
          placeholder="Ex: 45000"
          type="number"
        />
        {errors.km && (
          <p className="text-red-600 text-sm">{errors.km.message}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="valor_compra">Valor de Compra:</label>
        <input
          className="border p-2 rounded-md"
          id="valor_compra"
          {...register("valor_compra", { valueAsNumber: true })}
          placeholder="Digite o valor de compra"
          type="number"
        />
        {errors.valor_compra && (
          <p className="text-red-600 text-sm">{errors.valor_compra.message}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="data_compra">Data da Compra:</label>
        <input
          className="border p-2 rounded-md"
          id="data_compra"
          {...register("data_compra")}
          type="date"
        />
        {errors.data_compra && (
          <p className="text-red-600 text-sm">{errors.data_compra.message}</p>
        )}
      </div>
      <div className="flex flex-col">
        <label htmlFor="fornecedor">Fornecedor:</label>
        <input
          className="border p-2 rounded-md"
          id="fornecedor"
          {...register("fornecedor")}
          placeholder="Digite o nome do fornecedor"
          type="text"
        />
        {errors.fornecedor && (
          <p className="text-red-600 text-sm">{errors.fornecedor.message}</p>
        )}
      </div>
      <div className="flex flex-col">
        <label htmlFor="cpf_cnpj_fornecedor">CPF/CNPJ:</label>
        <input
          className="border p-2 rounded-md"
          id="cpf_cnpj_fornecedor"
          {...register("cpf_cnpj_fornecedor")}
          placeholder="Digite o CPF/CNPJ do fornecedor"
          type="text"
        />
        {errors.cpf_cnpj_fornecedor && (
          <p className="text-red-600 text-sm">
            {errors.cpf_cnpj_fornecedor.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded"
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

export default CadastroVeiculo;
