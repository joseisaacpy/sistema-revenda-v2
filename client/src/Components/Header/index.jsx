import { Link } from "react-router-dom";
import {
  FaHome,
  FaUserPlus,
  FaCarSide,
  FaTruckPickup,
  FaUsers,
} from "react-icons/fa";

const Header = () => {
  return (
    <header>
      <nav className="bg-gray-900 text-white p-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <FaTruckPickup size={24} />
          <h1 className="text-2xl font-bold">Só Caminhonetes</h1>
        </Link>
        <ul className="none md:flex gap-6 text-sm">
          <li>
            <Link className="flex items-center gap-1 hover:underline" to="/">
              <FaHome />
              Home
            </Link>
          </li>
          <li>
            <Link
              className="flex items-center gap-1 hover:underline"
              to="/cadastro-cliente"
            >
              <FaUserPlus />
              Cliente
            </Link>
          </li>
          <li>
            <Link
              className="flex items-center gap-1 hover:underline"
              to="/cadastro-veiculo"
            >
              <FaCarSide />
              Veículo
            </Link>
          </li>
          <li>
            <Link
              className="flex items-center gap-1 hover:underline"
              to="/veiculos"
            >
              <FaTruckPickup />
              Veículos
            </Link>
          </li>
          <li>
            <Link
              className="flex items-center gap-1 hover:underline"
              to="/clientes"
            >
              <FaUsers />
              Clientes
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
