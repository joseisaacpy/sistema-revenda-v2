import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <section className="w-[90%] max-w-[800px] flex flex-col gap-4 justify-center items-center p-4 shadow-2xl rounded-2xl">
        <h1 className="text-6xl font-bold ">Erro 404</h1>
        <p className="text-2xl ">Página não encontrada</p>
        <Link className="text-2xl font-bold hover:underline" to="/">
          Voltar pro início
        </Link>
      </section>
    </div>
  );
};
export default NotFound;
