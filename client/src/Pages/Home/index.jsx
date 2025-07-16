import { useState, useEffect } from "react";
import CardInfo from "../../Components/CardInfo";
import fetchQuantidade from "../../api/fetchQuantidade.js";

const Home = () => {
  const [quantidades, setQuantidades] = useState({
    clientes: 0,
    veiculos: 0,
  });

  useEffect(() => {
    const carregarDados = async () => {
      const clientes = await fetchQuantidade("/api/clientes");
      const veiculos = await fetchQuantidade("/api/veiculos");
      const vendas = await fetchQuantidade("/api/vendas");

      setQuantidades({
        clientes,
        veiculos,
        vendas,
      });
    };

    carregarDados();
  }, []);

  return (
    <section className="grid gap-4 p-4 grid-cols-1 md:grid-cols-3 ">
      <CardInfo
        titulo="Veículos Cadastrados"
        quantidade={quantidades.veiculos || 0}
      />
      <CardInfo
        titulo="Clientes Cadastrados"
        quantidade={quantidades.clientes || 0}
      />
      <CardInfo
        titulo="Vendas Realizadas"
        quantidade={quantidades.vendas || 0}
      />
    </section>
  );
};
export default Home;
