import { useState } from "react";
// Para notificações
import { ToastContainer, toast } from "react-toastify";

const CadastroClientes = () => {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cliente = formData;

    try {
      const res = await fetch("/api/clientes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cliente),
      });

      const data = await res.json();

      if (res.ok) {
        // Mostra uma mensagem de sucesso
        toast.success("Cliente cadastrado com sucesso!");
        // Limpa o formulário
        setFormData({});
      } else {
        // Mostra uma mensagem de erro
        toast.error("Erro ao cadastrar cliente!");
        console.error("Erro ao cadastrar cliente:", data);
      }
    } catch (error) {
      // Mostra uma mensagem de erro
      toast.error("Erro ao cadastrar cliente!");
      console.error("Erro ao cadastrar cliente:", error);
    }
  };

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
          onChange={handleChange}
          placeholder="Digite o CPF ou CNPJ"
        />
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
      </div>

      <div className="flex flex-col">
        <label htmlFor="telefone_celular">Telefone Celular:</label>
        <input
          className="border p-2 rounded-md"
          id="telefone_celular"
          name="telefone_celular"
          value={formData.telefone_celular}
          onChange={handleChange}
          placeholder="(xx) xxxxx-xxxx"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="telefone_residencial">Telefone Residencial:</label>
        <input
          className="border p-2 rounded-md"
          id="telefone_residencial"
          name="telefone_residencial"
          value={formData.telefone_residencial}
          onChange={handleChange}
          placeholder="(xx) xxxxx-xxxx"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="telefone_comercial">Telefone Comercial:</label>
        <input
          className="border p-2 rounded-md"
          id="telefone_comercial"
          name="telefone_comercial"
          value={formData.telefone_comercial}
          onChange={handleChange}
          placeholder="(xx) xxxxx-xxxx"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="rg">RG:</label>
        <input
          className="border p-2 rounded-md"
          id="rg"
          name="rg"
          value={formData.rg}
          onChange={handleChange}
          placeholder="Digite o RG"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="ie">IE (Inscrição Estadual):</label>
        <input
          className="border p-2 rounded-md"
          id="ie"
          name="ie"
          value={formData.ie}
          onChange={handleChange}
          placeholder="Digite a IE"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="data_nascimento">Data de Nascimento:</label>
        <input
          className="border p-2 rounded-md"
          id="data_nascimento"
          name="data_nascimento"
          value={formData.data_nascimento}
          onChange={handleChange}
          type="date"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="data_cadastro">Data de Cadastro:</label>
        <input
          className="border p-2 rounded-md"
          id="data_cadastro"
          name="data_cadastro"
          value={formData.data_cadastro}
          onChange={handleChange}
          type="date"
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
      </div>

      <div className="flex flex-col">
        <label htmlFor="cep">CEP:</label>
        <input
          className="border p-2 rounded-md"
          id="cep"
          name="cep"
          value={formData.cep}
          onChange={handleChange}
          placeholder="Digite o CEP"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="rua">Rua:</label>
        <input
          className="border p-2 rounded-md"
          id="rua"
          name="rua"
          value={formData.rua}
          onChange={handleChange}
          placeholder="Digite a rua"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="numero">Número:</label>
        <input
          className="border p-2 rounded-md"
          id="numero"
          name="numero"
          value={formData.numero}
          onChange={handleChange}
          type="number"
          placeholder="Digite o número da casa"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="bairro">Bairro:</label>
        <input
          className="border p-2 rounded-md"
          id="bairro"
          name="bairro"
          value={formData.bairro}
          onChange={handleChange}
          placeholder="Digite o bairro"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="estado">Estado:</label>
        <input
          className="border p-2 rounded-md"
          id="estado"
          name="estado"
          value={formData.estado}
          onChange={handleChange}
          placeholder="Digite o estado (apenas a sigla)"
        />
      </div>

      <div className="flex flex-col">
        <label htmlFor="cidade">Cidade:</label>
        <input
          className="border p-2 rounded-md"
          id="cidade"
          name="cidade"
          value={formData.cidade}
          onChange={handleChange}
          placeholder="Digite a cidade"
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

export default CadastroClientes;
