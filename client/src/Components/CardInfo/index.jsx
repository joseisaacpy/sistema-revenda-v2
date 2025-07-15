const CardInfo = ({ titulo, quantidade }) => {
  return (
    <article className="bg-white shadow-md rounded p-4 text-center hover:scale-95 transition-all">
      <h2 className="text-lg font-semibold">{titulo}</h2>
      <p className="text-3xl font-bold text-blue-600">{quantidade}</p>
    </article>
  );
};

export default CardInfo;
