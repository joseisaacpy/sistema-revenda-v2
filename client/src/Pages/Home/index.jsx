import CardInfo from "../../Components/CardInfo";
const Home = () => {
  return (
    <section className="grid gap-4 p-4 grid-cols-1 md:grid-cols-3 ">
      <CardInfo titulo="Veículos Cadastrados" quantidade={12} />
      <CardInfo titulo="Clientes Cadastrados" quantidade={8} />
      <CardInfo titulo="Vendas Realizadas" quantidade={5} />
    </section>
  );
};
export default Home;
