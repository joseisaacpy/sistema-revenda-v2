import { useState, useEffect } from "react";
// Para notificações
import { ToastContainer, toast } from "react-toastify";

const CadastroClientes = () => {
  // Estado para armazenar os dados (todos os campos iniciam vazios)
  const [formData, setFormData] = useState({
    cpf_cnpj: "",
    pessoa: "",
    sexo: "",
    nome: "",
    telefone_celular: "",
    telefone_comercial: "",
    rg: "",
    ie: "",
    data_nascimento: "",
    data_cadastro: new Date().toISOString().slice(0, 10),
    email: "",
    cep: "",
    rua: "",
    numero: "",
    bairro: "",
    estado: "",
    cidade: "",
    complemento: "",
    cargo: "",
    nome_mae: "",
    nome_pai: "",
    data_ultima_compra: "",
    quantidade_veic_comprados: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Estado pra armazenar os erros
  const [errors, setErrors] = useState({});

  // Função para validar o formulário
  const validateForm = () => {
    // Objeto para armazenar os erros
    const newErrors = {};

    // Campos obrigatórios
    if (!formData.nome?.trim()) {
      newErrors.nome = "Nome é obrigatório";
    }

    if (!formData.cpf_cnpj?.trim()) {
      newErrors.cpf_cnpj = "CPF/CNPJ é obrigatório";
    }

    // Validação de email
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Função pra lidar com o envio do formulário
  const handleSubmit = async (e) => {
    e.preventDefault(); // Impede o envio do formulário

    // Valida o formulário
    if (!validateForm()) {
      toast.error("Corrija os erros e tente novamente!");
      return;
    }

    // Começa a chamada assíncrona pra enviar os dados
    try {
      const url = `${import.meta.env.VITE_API_URL}/api/clientes`;
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        // Mostra uma mensagem de sucesso
        toast.success("Cliente cadastrado com sucesso!");
        // Limpa o formulário
        setFormData({
          cpf_cnpj: "",
          pessoa: "",
          sexo: "",
          nome: "",
          telefone_celular: "",
          telefone_comercial: "",
          rg: "",
          ie: "",
          data_nascimento: "",
          data_cadastro: new Date().toISOString().slice(0, 10), // Reinicia com a data atual
          email: "",
          cep: "",
          rua: "",
          numero: "",
          bairro: "",
          estado: "",
          cidade: "",
          complemento: "",
          cargo: "",
          nome_mae: "",
          nome_pai: "",
          data_ultima_compra: "",
          quantidade_veic_comprados: "",
        });
        // Limpa os erros
        setErrors({});
      } else {
        const errorData = await res.json();
        // Mostra uma mensagem de erro
        toast.error(errorData.message || "Erro ao cadastrar cliente!");
      }
    } catch (error) {
      toast.error("Erro de conexão. Tente novamente.");
      console.error("Erro ao enviar os dados:", error);
    }
  };
  // useEffect para mudar o title
  useEffect(() => {
    document.title = "Cadastro de Clientes";
  });

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 flex flex-col gap-4 border border-gray-300 p-4 rounded-lg bg-blue-100"
      id="pessoaForm"
    >
      <h1 className="text-2xl font-bold">Cadastro de Pessoa</h1>

      <div className="flex flex-col">
        <label htmlFor="cpf_cnpj">CPF/CNPJ:</label>
        <input
          className="border p-2 rounded-md"
          id="cpf_cnpj"
          name="cpf_cnpj"
          value={formData.cpf_cnpj}
          minLength={11}
          maxLength={18}
          placeholder="Digite o CPF ou CNPJ"
          onChange={handleChange}
        />
        {errors.cpf_cnpj && (
          <p className="text-red-600 text-sm">{errors.cpf_cnpj}</p>
        )}
      </div>

      <div className="flex flex-col">
        <label htmlFor="pessoa">Tipo de Pessoa:</label>
        <select
          className="border p-2 rounded-md"
          id="pessoa"
          name="pessoa"
          value={formData.pessoa}
          onChange={handleChange}
        >
          <option value="">Selecione</option>
          <option value="F">Física</option>
          <option value="J">Jurídica</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label htmlFor="sexo">Sexo:</label>
        <select
          className="border p-2 rounded-md"
          id="sexo"
          name="sexo"
          value={formData.sexo}
          onChange={handleChange}
        >
          <option value="">Selecione</option>
          <option value="M">Masculino</option>
          <option value="F">Feminino</option>
          <option value="Outro">Outro</option>
        </select>
      </div>

      <div className="flex flex-col">
        <label htmlFor="nome">Nome:</label>
        <input
          className="border p-2 rounded-md"
          id="nome"
          name="nome"
          value={formData.nome}
          onChange={handleChange}
          placeholder="Digite o nome completo"
        />
        {errors.nome && <p className="text-red-600 text-sm">{errors.nome}</p>}
      </div>

      <div className="flex flex-col">
        <label htmlFor="telefone_celular">Telefone Celular:</label>
        <input
          className="border p-2 rounded-md"
          id="telefone_celular"
          name="telefone_celular"
          value={formData.telefone_celular}
          minLength={10}
          maxLength={15}
          placeholder="(xx) xxxxx-xxxx"
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="telefone_comercial">Telefone Comercial:</label>
        <input
          className="border p-2 rounded-md"
          id="telefone_comercial"
          name="telefone_comercial"
          value={formData.telefone_comercial}
          minLength={10}
          maxLength={15}
          placeholder="(xx) xxxxx-xxxx"
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="rg">RG:</label>
        <input
          className="border p-2 rounded-md"
          id="rg"
          name="rg"
          value={formData.rg}
          minLength={5}
          maxLength={20}
          placeholder="Digite o RG"
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="ie">IE (Inscrição Estadual):</label>
        <input
          className="border p-2 rounded-md"
          id="ie"
          name="ie"
          value={formData.ie}
          minLength={5}
          maxLength={20}
          placeholder="Digite a IE"
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="data_nascimento">Data de Nascimento:</label>
        <input
          className="border p-2 rounded-md"
          id="data_nascimento"
          name="data_nascimento"
          value={formData.data_nascimento}
          type="date"
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="data_cadastro">Data de Cadastro:</label>
        <input
          className="border p-2 rounded-md"
          id="data_cadastro"
          name="data_cadastro"
          value={formData.data_cadastro}
          type="date"
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="email">Email:</label>
        <input
          className="border p-2 rounded-md"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
          placeholder="Digite o email"
        />
        {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
      </div>

      <div className="flex flex-col">
        <label htmlFor="cep">CEP:</label>
        <input
          className="border p-2 rounded-md"
          id="cep"
          name="cep"
          value={formData.cep}
          minLength={8}
          maxLength={9}
          placeholder="Digite o CEP"
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="rua">Rua:</label>
        <input
          className="border p-2 rounded-md"
          id="rua"
          name="rua"
          value={formData.rua}
          placeholder="Digite a rua"
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="numero">Número:</label>
        <input
          className="border p-2 rounded-md"
          id="numero"
          name="numero"
          value={formData.numero}
          minLength={1}
          maxLength={10}
          type="number"
          placeholder="Digite o número da casa"
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="bairro">Bairro:</label>
        <input
          className="border p-2 rounded-md"
          id="bairro"
          name="bairro"
          value={formData.bairro}
          placeholder="Digite o bairro"
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="estado">Estado:</label>
        <input
          className="border p-2 rounded-md"
          id="estado"
          name="estado"
          value={formData.estado}
          minLength={2}
          maxLength={2}
          placeholder="Digite o estado (apenas a sigla)"
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="cidade">Cidade:</label>
        <input
          className="border p-2 rounded-md"
          id="cidade"
          name="cidade"
          value={formData.cidade}
          placeholder="Digite a cidade"
          onChange={handleChange}
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="complemento">Complemento:</label>
        <input
          className="border p-2 rounded-md"
          id="complemento"
          name="complemento"
          value={formData.complemento}
          onChange={handleChange}
          placeholder="Digite o complemento"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="cargo">Cargo:</label>
        <input
          className="border p-2 rounded-md"
          id="cargo"
          name="cargo"
          value={formData.cargo}
          onChange={handleChange}
          placeholder="Digite o cargo do cliente"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="nome_mae">Nome da Mãe:</label>
        <input
          className="border p-2 rounded-md"
          id="nome_mae"
          name="nome_mae"
          value={formData.nome_mae}
          onChange={handleChange}
          placeholder="Digite o nome da mãe do cliente"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="nome_pai">Nome do Pai:</label>
        <input
          className="border p-2 rounded-md"
          id="nome_pai"
          name="nome_pai"
          value={formData.nome_pai}
          onChange={handleChange}
          placeholder="Digite o nome do pai do cliente"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="data_ultima_compra">Data da Última Compra:</label>
        <input
          className="border p-2 rounded-md"
          id="data_ultima_compra"
          name="data_ultima_compra"
          value={formData.data_ultima_compra}
          onChange={handleChange}
          type="date"
          placeholder="Digite a data da última compra"
          readOnly
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="quantidade_veic_comprados">
          Quantidade de Veículos Comprados:
        </label>
        <input
          className="border p-2 rounded-md"
          id="quantidade_veic_comprados"
          name="quantidade_veic_comprados"
          value={formData.quantidade_veic_comprados}
          onChange={handleChange}
          type="number"
          placeholder="Digite a quantidade de veículos comprados"
          readOnly
        />
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

export default CadastroClientes;
