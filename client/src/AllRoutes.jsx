import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import NotFound from "./Pages/NotFound";

const AllRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AllRoutes;
