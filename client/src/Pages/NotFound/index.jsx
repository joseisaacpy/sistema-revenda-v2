import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div>
      <section className="flex flex-col gap-2 justify-center items-center h-screen">
        <h1 className="text-4xl font-bold text-center">
          Ops, página não encontrada!
        </h1>
        <Link
          className="text-2xl font-bold text-center underline hover:text-blue-600 transition-all duration-75"
          to="/"
        >
          Voltar pro início
        </Link>
      </section>
    </div>
  );
};
export default NotFound;
