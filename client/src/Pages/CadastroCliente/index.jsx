import { useEffect } from "react";
// Para notificações
import { ToastContainer, toast } from "react-toastify";
// Para validação de formulários
import clienteSchema from "../../Validators/clienteSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const CadastroCliente = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(clienteSchema) });

  // Função para lidar com o envio do formulário
  const onSubmit = async (data) => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/clientes`;
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
        throw new Error("Erro ao cadastrar cliente");
      }
      const result = await response.json();
      console.log("Cliente cadastrado com sucesso:", result);
      toast.success("Cadastro realizado com sucesso!");
      // Limpa o formulário
      document.getElementById("pessoaForm").reset();
    } catch (error) {
      toast.error("Erro ao cadastrar cliente!");
      console.error(error);
    }
  };

  // useEffect para mudar o title
  useEffect(() => {
    document.title = "Cadastro de Clientes";
  });

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 flex flex-col gap-4 border border-gray-300 p-4 rounded-lg bg-blue-50"
      id="pessoaForm"
    >
      <h1 className="text-2xl font-bold">Cadastro de Pessoa</h1>

      <div className="flex flex-col">
        <label htmlFor="cpf_cnpj">CPF/CNPJ:</label>
        <input
          className="border p-2 rounded-md"
          id="cpf_cnpj"
          {...register("cpf_cnpj")}
          placeholder="Digite o CPF ou CNPJ"
        />
        {errors.cpf_cnpj && (
          <p className="text-red-600 text-sm">{errors.cpf_cnpj.message}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="pessoa">Tipo de Pessoa:</label>
        <select
          className="border p-2 rounded-md"
          id="pessoa"
          {...register("pessoa")}
        >
          <option value="">Selecione</option>
          <option value="F">Física</option>
          <option value="J">Jurídica</option>
        </select>
        {errors.pessoa && (
          <p className="text-red-600 text-sm">{errors.pessoa.message}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="sexo">Sexo:</label>
        <select
          className="border p-2 rounded-md"
          id="sexo"
          {...register("sexo")}
        >
          <option value="">Selecione</option>
          <option value="M">Masculino</option>
          <option value="F">Feminino</option>
          <option value="O">Outro</option>
        </select>
        {errors.sexo && (
          <p className="text-red-600 text-sm">{errors.sexo.message}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="nome">Nome:</label>
        <input
          className="border p-2 rounded-md"
          id="nome"
          name="nome"
          {...register("nome")}
          placeholder="Digite o nome completo"
        />
        {errors.nome && (
          <p className="text-red-600 text-sm">{errors.nome.message}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="telefone_celular">Telefone Celular:</label>
        <input
          className="border p-2 rounded-md"
          id="telefone_celular"
          name="telefone_celular"
          {...register("telefone_celular")}
          placeholder="(xx) xxxxx-xxxx"
        />
        {errors.telefone_celular && (
          <p className="text-red-600 text-sm">
            {errors.telefone_celular.message}
          </p>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="telefone_comercial">Telefone Comercial:</label>
        <input
          className="border p-2 rounded-md"
          id="telefone_comercial"
          {...register("telefone_comercial")}
          placeholder="(xx) xxxxx-xxxx"
        />
        {errors.telefone_comercial && (
          <p className="text-red-600 text-sm">
            {errors.telefone_comercial.message}
          </p>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="rg">RG:</label>
        <input
          className="border p-2 rounded-md"
          id="rg"
          {...register("rg")}
          placeholder="Digite o RG"
        />
        {errors.rg && (
          <p className="text-red-600 text-sm">{errors.rg.message}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="ie">IE (Inscrição Estadual):</label>
        <input
          className="border p-2 rounded-md"
          id="ie"
          {...register("ie")}
          placeholder="Digite a IE"
        />
        {errors.ie && (
          <p className="text-red-600 text-sm">{errors.ie.message}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="data_nascimento">Data de Nascimento:</label>
        <input
          className="border p-2 rounded-md"
          id="data_nascimento"
          {...register("data_nascimento")}
          type="date"
        />
        {errors.data_nascimento && (
          <p className="text-red-600 text-sm">
            {errors.data_nascimento.message}
          </p>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="email">Email:</label>
        <input
          className="border p-2 rounded-md"
          id="email"
          {...register("email")}
          type="email"
          placeholder="Digite o email"
        />
        {errors.email && (
          <p className="text-red-600 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="cep">CEP:</label>
        <input
          className="border p-2 rounded-md"
          id="cep"
          name="cep"
          {...register("cep")}
          placeholder="Digite o CEP"
        />
        {errors.cep && (
          <p className="text-red-600 text-sm">{errors.cep.message}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="rua">Rua:</label>
        <input
          className="border p-2 rounded-md"
          id="rua"
          {...register("rua")}
          placeholder="Digite a rua"
        />
        {errors.rua && (
          <p className="text-red-600 text-sm">{errors.rua.message}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="numero">Número:</label>
        <input
          className="border p-2 rounded-md"
          id="numero"
          type="text"
          {...register("numero")}
          placeholder="Digite o número da casa"
        />
        {errors.numero && (
          <p className="text-red-600 text-sm">{errors.numero.message}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="bairro">Bairro:</label>
        <input
          className="border p-2 rounded-md"
          id="bairro"
          {...register("bairro")}
          placeholder="Digite o bairro"
        />
        {errors.bairro && (
          <p className="text-red-600 text-sm">{errors.bairro.message}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="estado">Estado:</label>
        <select
          className="border p-2 rounded-md"
          id="estado"
          {...register("estado")}
        >
          <option value="">Selecione o estado</option>
          <option value="AC">AC</option>
          <option value="AL">AL</option>
          <option value="AP">AP</option>
          <option value="AM">AM</option>
          <option value="BA">BA</option>
          <option value="CE">CE</option>
          <option value="DF">DF</option>
          <option value="ES">ES</option>
          <option value="GO">GO</option>
          <option value="MA">MA</option>
          <option value="MT">MT</option>
          <option value="MS">MS</option>
          <option value="MG">MG</option>
          <option value="PA">PA</option>
          <option value="PB">PB</option>
          <option value="PR">PR</option>
          <option value="PE">PE</option>
          <option value="PI">PI</option>
          <option value="RJ">RJ</option>
          <option value="RN">RN</option>
          <option value="RS">RS</option>
          <option value="RO">RO</option>
          <option value="RR">RR</option>
          <option value="SC">SC</option>
          <option value="SP">SP</option>
          <option value="SE">SE</option>
          <option value="TO">TO</option>
        </select>
        {errors.estado && (
          <p className="text-red-600 text-sm">{errors.estado.message}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="cidade">Cidade:</label>
        <input
          className="border p-2 rounded-md"
          id="cidade"
          {...register("cidade")}
          placeholder="Digite a cidade"
        />
        {errors.cidade && (
          <p className="text-red-600 text-sm">{errors.cidade.message}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="complemento">Complemento:</label>
        <input
          className="border p-2 rounded-md"
          id="complemento"
          {...register("complemento")}
          placeholder="Digite o complemento"
        />
        {errors.complemento && (
          <p className="text-red-600 text-sm">{errors.complemento.message}</p>
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

export default CadastroCliente;
