import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <main className="bg-gradient-to-b from-slate-100 to-blue-400 flex flex-col gap-4 justify-center items-center h-screen text-center p-4">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-2xl">Ops, página não encontrada!</p>

      <Link
        to="/"
        className="px-4 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition duration-200"
      >
        Voltar pro início
      </Link>
    </main>
  );
};

export default NotFound;
