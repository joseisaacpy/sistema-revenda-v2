import imgCars from "../../Assets/Images/cars.webp";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Register = () => {
  // Navigate
  const navigate = useNavigate();

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

  // Função para lidar com o cadastro
  const handleSubmit = async (e) => {
    const url = "http://localhost:8080/api/auth/register";
    console.log("Dados recebidos:", formData);

    e.preventDefault(); // Impede o envio do formulário

    const { name, email, password } = formData;
    // Valida se os campos foram preenchidos
    if (!name || !email || !password) {
      return toast.error("Preencha todos os campos!");
    }
    // Valida se a senha tem pelo menos 6 caracteres
    if (password.length < 6) {
      return toast.error("A senha deve ter no mínimo 6 caracteres.");
    }

    try {
      const response = await fetch(url, {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({ nome: name, email: email, senha: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return toast.error(data.msg || "Erro ao fazer cadastro!");
      }

      // Guarda o token no localStorage
      localStorage.setItem("token", data.token);

      toast.success(
        "Cadastro realizado com sucesso! Redirecionando para o login..."
      );

      // Manda pra tela de login
      setTimeout(() => {
        navigate("/login");
      }, 2500);
    } catch (error) {
      if (error.code === "23505") {
        return toast.error("Usuário já cadastrado.");
      }
      toast.error("Erro ao fazer cadastro.", {
        error: error.message,
      });
    }
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
        <form
          className="flex w-full max-w-lg mx-auto flex-col gap-6"
          onSubmit={handleSubmit}
        >
          <h1 className="text-3xl font-bold">Resgistre-se</h1>
          <div className="flex flex-col">
            <label htmlFor="name">Nome completo</label>
            <input
              type="text"
              name="name"
              autoComplete="name"
              autoFocus
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
            <label htmlFor="password">Senha</label>
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
      <ToastContainer autoClose={2000} />
    </section>
  );
};

export default Register;
