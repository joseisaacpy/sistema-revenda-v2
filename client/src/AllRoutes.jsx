import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import NotFound from "./Pages/NotFound";
import MainLayout from "./Components/MainLayout"; // novo layout com o Header

const AllRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas com layout padrão */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
        </Route>

        {/* Página 404 fora do layout (opcional) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AllRoutes;
