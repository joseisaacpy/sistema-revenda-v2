import { Navigate, Outlet } from "react-router-dom";

const PrivateRoutes = () => {
  // Pega o token no localStorage
  const token = localStorage.getItem("token");
  // Se tiver token, mostra o conteúdo, se não, redireciona para login
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoutes;
