import imgCars from "../../Assets/Images/cars.webp";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
  // Navigate
  const navigate = useNavigate();
  // Estados pra lidar com o preenchimento do formulário
  const [formData, setFormData] = useState({ email: "", password: "" });

  // Função para lidar com o preenchimento do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Função pra lidar com o login
  const handleSubmit = async (e) => {
    e.preventDefault(); // Impede o envio do formulário
    const { email, password } = formData;
    const url = "http://localhost:8080/api/auth/login";
    if (!email || !password) {
      return toast.error("Preencha todos os campos!");
    }
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, senha: password }),
      });

      const data = await response.json();

      if (!response.ok) {
        return toast.error(data.msg || "Erro ao fazer login!");
      }

      // Guarda o token no localStorage
      localStorage.setItem("token", data.token);

      toast.success("Login realizado com sucesso! Redirecionando...");

      // Manda pra home
      setTimeout(() => {
        navigate("/");
      }, 2500);
    } catch (error) {
      console.log("Erro ao fazer login:", error);
      toast.error("Erro ao fazer login!");
    }
  };

  // Para mudar o titulo da aba
  useEffect(() => {
    document.title = "Login | Só Camionetes";
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
          <h1 className="text-3xl font-bold">Login</h1>
          <div className="flex flex-col">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              id="email"
              autoFocus
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
              autoComplete="current-password"
              className="border p-2 rounded-[5px]"
              placeholder="Digite sua senha"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <span className="text-sm text-center">
            Ainda não tem uma conta?{" "}
            <Link to="/register" className="text-blue-600 hover:underline">
              Registrar
            </Link>
          </span>
          <button
            type="submit"
            className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 text-sm sm:text-base rounded transition-all duration-300"
          >
            Entrar
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

export default Login;
