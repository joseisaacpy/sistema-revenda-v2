import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./Pages/Login";
import Register from "./Pages/Register";

import PrivateRoutes from "./PrivateRoutes"; // Para privar rotas
import MainLayout from "./Components/MainLayout"; // Layout padrão com header e footer

import Home from "./Pages/Home";

import CadastroVeiculo from "./Pages/CadastroVeiculo";
import CadastroCliente from "./Pages/CadastroCliente";
import CadastroVenda from "./Pages/CadastroVenda";

import ListarVeiculos from "./Pages/ListarVeiculos";
import ListarClientes from "./Pages/ListarClientes";
import ListarVendas from "./Pages/ListarVendas";

import NotFound from "./Pages/NotFound";

const AllRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Páginas públicas e sem layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* Rotas privadas com layout compartilhado */}
        <Route element={<MainLayout />}>
          {/* Essas rotas aparecem dentro do <Outlet /> do MainLayout */}
          <Route index element={<Home />} />
          <Route path="cadastro-veiculo" element={<CadastroVeiculo />} />
          <Route path="cadastro-cliente" element={<CadastroCliente />} />
          <Route path="cadastro-venda" element={<CadastroVenda />} />
          <Route path="veiculos" element={<ListarVeiculos />} />
          <Route path="clientes" element={<ListarClientes />} />
          <Route path="vendas" element={<ListarVendas />} />
        </Route>
        <Route element={<PrivateRoutes />}></Route>

        {/* Página 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AllRoutes;
