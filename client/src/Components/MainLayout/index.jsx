import { Outlet } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";

const MainLayout = () => {
  return (
    <>
      <Header />
      <main className="flex flex-col min-h-screen">
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default MainLayout;
