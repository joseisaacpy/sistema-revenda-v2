import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import NotFound from "./Pages/NotFound";
import CadastroVeiculo from "./Pages/CadastroVeiculo";
import CadastroCliente from "./Pages/CadastroCliente";
// import CadastroVenda from "./Pages/CadastroVenda";
import ListarVeiculos from "./Pages/ListarVeiculos";
import ListarClientes from "./Pages/ListarClientes";
// import ListarVendas from "./Pages/ListarVendas";
import MainLayout from "./Components/MainLayout"; // novo layout com o Header

const AllRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas com layout padrão */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/cadastro-veiculo" element={<CadastroVeiculo />} />
          <Route path="/cadastro-cliente" element={<CadastroCliente />} />
          {/* <Route path="/cadastro-venda" element={<CadastroVenda />} /> */}
          <Route path="/veiculos" element={<ListarVeiculos />} />
          <Route path="/clientes" element={<ListarClientes />} />
          {/* <Route path="/vendas" element={<ListarVendas />} /> */}
        </Route>

        {/* Página 404 fora do layout (opcional) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AllRoutes;
