import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import PrivateRoutes from "./PrivateRoutes";
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
        {/* Rotas privadas e com layout */}
        {/* Home */}
        <Route
          path="/"
          element={
            <PrivateRoutes>
              <MainLayout>
                <Home />
              </MainLayout>
            </PrivateRoutes>
          }
        />

        {/* Cadastros */}
        <Route
          path="/cadastro-veiculo"
          element={
            <PrivateRoutes>
              <MainLayout>
                <CadastroVeiculo />
              </MainLayout>
            </PrivateRoutes>
          }
        />
        <Route
          path="/cadastro-cliente"
          element={
            <PrivateRoutes>
              <MainLayout>
                <CadastroCliente />
              </MainLayout>
            </PrivateRoutes>
          }
        />
        <Route
          path="/cadastro-venda"
          element={
            <PrivateRoutes>
              <MainLayout>
                <CadastroVenda />
              </MainLayout>
            </PrivateRoutes>
          }
        />
        {/* Listagens */}
        <Route
          path="/veiculos"
          element={
            <PrivateRoutes>
              <MainLayout>
                <ListarVeiculos />
              </MainLayout>
            </PrivateRoutes>
          }
        />
        <Route
          path="/clientes"
          element={
            <PrivateRoutes>
              <MainLayout>
                <ListarClientes />
              </MainLayout>
            </PrivateRoutes>
          }
        />
        <Route
          path="/vendas"
          element={
            <PrivateRoutes>
              <MainLayout>
                <ListarVendas />
              </MainLayout>
            </PrivateRoutes>
          }
        />

        {/* Página 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AllRoutes;
