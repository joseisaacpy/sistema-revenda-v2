import { FaTimes } from "react-icons/fa";

const EditClienteModal = ({
  isOpen,
  onClose,
  formData,
  handleChange,
  handleSubmit,
}) => {
  return (
    <section
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${
        isOpen ? "flex" : "hidden"
      }`}
    >
      {/* Botão de fechar */}
      <button
        className="absolute top-4 right-4 cursor-pointer text-2xl font-bold text-white"
        onClick={onClose}
      >
        <FaTimes />
      </button>
      {/* Formulário */}

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-md shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-4"
      >
        <h2 className="text-xl font-semibold mb-2">Atualizar Cliente</h2>

        <div className="flex flex-col gap-2">
          <label htmlFor="cpf_cnpj">CPF/CNPJ</label>
          <input
            type="text"
            name="cpf_cnpj"
            placeholder="CPF/CNPJ"
            value={formData.cpf_cnpj}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <label htmlFor="pessoa">Tipo</label>
          <select
            name="pessoa"
            id="pessoa"
            value={formData.pessoa}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="fisica">Física</option>
            <option value="juridica">Jurídica</option>
          </select>
          <label htmlFor="sexo">Sexo</label>
          <select
            name="sexo"
            id="sexo"
            value={formData.sexo}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="M">Masculino</option>
            <option value="F">Feminino</option>
          </select>
          <label htmlFor="nome">Nome</label>
          <input
            type="text"
            name="nome"
            placeholder="Nome"
            value={formData.nome}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <label htmlFor="telefone_celular">Telefone Celular</label>
          <input
            type="text"
            name="telefone_celular"
            placeholder="Celular"
            value={formData.telefone_celular}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <label htmlFor="telefone_comercial">Telefone Comercial</label>
          <input
            type="text"
            name="telefone_comercial"
            placeholder="Comercial"
            value={formData.telefone_comercial}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <label htmlFor="rg">RG</label>
          <input
            type="text"
            name="rg"
            placeholder="RG"
            value={formData.rg}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <label htmlFor="ie">IE</label>
          <input
            type="text"
            name="ie"
            placeholder="IE"
            value={formData.ie}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <label htmlFor="data_nascimento">Data de Nascimento</label>
          <input
            type="date"
            name="data_nascimento"
            placeholder="Nascimento"
            value={formData.data_nascimento}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <label htmlFor="email">Email</label>
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <label htmlFor="cep">CEP</label>
          <input
            type="text"
            name="cep"
            placeholder="CEP"
            value={formData.cep}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <label htmlFor="rua">Rua</label>
          <input
            type="text"
            name="rua"
            placeholder="Rua"
            value={formData.rua}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <label htmlFor="numero">Número</label>
          <input
            type="text"
            name="numero"
            placeholder="Número"
            value={formData.numero}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <label htmlFor="bairro">Bairro</label>
          <input
            type="text"
            name="bairro"
            placeholder="Bairro"
            value={formData.bairro}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <label htmlFor="estado">Estado</label>
          <input
            type="text"
            name="estado"
            placeholder="Estado"
            value={formData.estado}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <label htmlFor="cidade">Cidade</label>
          <input
            type="text"
            name="cidade"
            placeholder="Cidade"
            value={formData.cidade}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <label htmlFor="complemento">Complemento</label>
          <input
            type="text"
            name="complemento"
            placeholder="Complemento"
            value={formData.complemento}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>

        <div className="text-right pt-4">
          <button
            type="submit"
            className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Atualizar
          </button>
        </div>
      </form>
    </section>
  );
};

export default EditClienteModal;
