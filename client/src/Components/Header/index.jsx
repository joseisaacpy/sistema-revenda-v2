// useState e useEffect pra controlar o estado de visualização do menu mobile
import { useState, useEffect } from "react";

// Link para navegação
import { Link } from "react-router-dom";

// Ícones
import {
  FaHome,
  FaUserPlus,
  FaCarSide,
  FaTruckPickup,
  FaUsers,
  FaChartLine,
  FaReceipt,
} from "react-icons/fa";

// Icone para menu burguer
import { IoMdMenu } from "react-icons/io";

const Header = () => {
  // Estados
  const [isMenuOpen, setIsMenuOpen] = useState(false); // Inicia com o menu fechado/false
  // useEffect pra controlar o estado de visualização do menu mobile
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isMenuOpen]);

  return (
    <header>
      {/* Barra de navegação */}
      <nav className="bg-gray-900 text-white p-4 flex items-center justify-between md:justify-around">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2  hover:text-yellow-400 transition-all duration-300"
        >
          <FaTruckPickup className="text-4xl" />
          <h1 className="hidden md:block text-2xl font-bold">Só Camionetes</h1>
        </Link>

        {/* Button menu burguer mobile */}
        <button
          className="md:hidden"
          onClick={() => {
            setIsMenuOpen(true);
          }}
          aria-label="Abrir menu"
        >
          <IoMdMenu className="text-3xl" />
        </button>

        {/* Se o estado do menu for true, mostra o menu mobile com os links e que cobre a tela */}
        {isMenuOpen && (
          <div className="fixed top-0 left-0 w-full h-full bg-gray-900 text-white flex flex-col items-center justify-center z-50 space-y-6 transition-opacity duration-300">
            {/* Botão para fechar o menu */}
            <button
              onClick={() => setIsMenuOpen(false)}
              className="absolute top-4 right-4 text-3xl"
              aria-label="Fechar menu"
            >
              &times;
            </button>

            {/* Links do menu */}
            {/* Onclick em todos os links para fechar o menu ao clicar */}
            <Link
              onClick={() => setIsMenuOpen(false)}
              to="/"
              className="text-xl"
            >
              <FaHome className="inline mr-2" />
              Home
            </Link>
            <Link
              onClick={() => setIsMenuOpen(false)}
              to="/cadastro-cliente"
              className="text-xl"
            >
              <FaUserPlus className="inline mr-2" />
              Cliente
            </Link>
            <Link
              onClick={() => setIsMenuOpen(false)}
              to="/cadastro-venda"
              className="text-xl"
            >
              <FaReceipt className="inline mr-2" />
              Venda
            </Link>
            <Link
              onClick={() => setIsMenuOpen(false)}
              to="/cadastro-veiculo"
              className="text-xl"
            >
              <FaCarSide className="inline mr-2" />
              Veículo
            </Link>
            <Link
              onClick={() => setIsMenuOpen(false)}
              to="/veiculos"
              className="text-xl"
            >
              <FaTruckPickup className="inline mr-2" />
              Veículos
            </Link>
            <Link
              onClick={() => setIsMenuOpen(false)}
              to="/clientes"
              className="text-xl"
            >
              <FaUsers className="inline mr-2" />
              Clientes
            </Link>
            <Link
              onClick={() => setIsMenuOpen(false)}
              to="/vendas"
              className="text-xl"
            >
              <FaChartLine className="inline mr-2" />
              Vendas
            </Link>
          </div>
        )}

        {/* Ul */}
        <ul className="hidden md:flex gap-6 text-sm" id="menu">
          <li>
            <Link
              className="flex items-center gap-1 transition-transform duration-300 hover:scale-105 hover:text-yellow-400"
              to="/cadastro-cliente"
            >
              <FaUserPlus />
              Cliente
            </Link>
          </li>
          <li>
            <Link
              className="flex items-center gap-1 transition-transform duration-300 hover:scale-105 hover:text-yellow-400"
              to="/cadastro-veiculo"
            >
              <FaCarSide />
              Veículo
            </Link>
          </li>
          <li>
            <Link
              className="flex items-center gap-1 transition-transform duration-300 hover:scale-105 hover:text-yellow-400"
              to="/cadastro-venda"
            >
              <FaReceipt />
              Venda
            </Link>
          </li>
          <li>
            <Link
              className="flex items-center gap-1 transition-transform duration-300 hover:scale-105 hover:text-yellow-400"
              to="/clientes"
            >
              <FaUsers />
              Clientes
            </Link>
          </li>
          <li>
            <Link
              className="flex items-center gap-1 transition-transform duration-300 hover:scale-105 hover:text-yellow-400"
              to="/veiculos"
            >
              <FaTruckPickup />
              Veículos
            </Link>
          </li>
          <li>
            <Link
              className="flex items-center gap-1 transition-transform duration-300 hover:scale-105 hover:text-yellow-400"
              to="/vendas"
            >
              <FaChartLine />
              Vendas
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
