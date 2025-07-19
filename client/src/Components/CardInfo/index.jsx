import { Link } from "react-router-dom";
const CardInfo = ({ rota, titulo, quantidade }) => {
  return (
    <Link to={`/${rota.toLowerCase()}`}>
      <article className="bg-white shadow-md rounded p-4 text-center hover:scale-95 transition-all">
        <h2 className="text-2xl font-semibold">{titulo}</h2>
        <p className="text-3xl font-bold text-blue-600">{quantidade}</p>
      </article>
    </Link>
  );
};

export default CardInfo;
