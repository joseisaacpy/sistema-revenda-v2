import imgCars from "../../Assets/Images/cars.webp";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Register = () => {
  // Estados pra lidar com o preenchimento do formulário
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  // Função para lidar com o preenchimento do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Para mudar o titulo da aba
  useEffect(() => {
    document.title = "Cadastro | Só Camionetes";
  }, []);

  return (
    // Container
    <section className="min-h-screen flex flex-col md:flex-row items-stretch justify-center p-5 md:p-15 bg-slate-500">
      {/* Seção do form */}
      <section className="md:flex-1 flex flex-col items-center justify-center bg-white p-5 lg:rounded-l-2xl shadow-2xs">
        {/* Formulário */}
        <form className="flex w-full max-w-lg mx-auto flex-col gap-6">
          <h1 className="text-3xl font-bold">Resgistre-se</h1>
          <div className="flex flex-col">
            <label htmlFor="nome">Nome completo</label>
            <input
              type="text"
              name="name"
              autoComplete="name"
              required
              id="name"
              className="border p-2 rounded-[5px]"
              placeholder="Digite seu nome completo"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              required
              autoComplete="email"
              className="border p-2 rounded-[5px]"
              placeholder="Digite seu email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="senha">Senha</label>
            <input
              type="password"
              name="password"
              id="password"
              required
              autoComplete="current-password"
              className="border p-2 rounded-[5px]"
              placeholder="Digite uma senha"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <span className="text-sm text-center">
            Já possui uma conta?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Entrar
            </Link>
          </span>
          <button
            type="submit"
            className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 text-sm sm:text-base rounded transition-all duration-300"
          >
            Cadastrar
          </button>
        </form>
        {/* Seção da imagem lateral */}
      </section>
      {/* Imagem */}
      <section className="flex-1 hidden md:block shadow-2xl">
        <img
          src={imgCars}
          alt="Imagem de carros"
          className="w-full h-full max-h-screen object-cover rounded-r-2xl"
        />
      </section>
    </section>
  );
};

export default Register;
