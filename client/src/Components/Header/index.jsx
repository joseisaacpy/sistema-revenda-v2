import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header>
      <nav className="bg-gray-900 text-white p-4 flex items-center justify-around">
        <Link to="/">
          <h1 className="text-2xl font-bold">Só Caminhonetes</h1>
        </Link>
        <ul className="flex gap-4 ml-4">
          <li>
            <Link className="hover:underline" to="/">
              Home
            </Link>
          </li>
          <li>
            <Link className="hover:underline" to="/cadastro-cliente">
              Cadastro Cliente
            </Link>
          </li>
          <li>
            <Link className="hover:underline" to="/cadastro-veiculo">
              Cadastro Veículo
            </Link>
          </li>
          <li>
            <Link className="hover:underline" to="/veiculos">
              Veículos
            </Link>
          </li>
          <li>
            <Link className="hover:underline" to="/clientes">
              Clientes
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
