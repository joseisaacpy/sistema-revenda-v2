// Importa as bibliotecas
import { useState, useEffect } from "react";
// Importa os componentes
import CardInfo from "../../Components/CardInfo";
import fetchQuantidade from "../../api/fetchQuantidade.js";
import Loader from "../../Components/Loader/index.jsx";
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

const Home = () => {
  // Estados
  const [loading, setLoading] = useState(true); // Estado para controlar o carregamento
  // Estado para armazenar as quantidades
  const [quantidades, setQuantidades] = useState({
    clientes: 0,
    veiculos: 0,
    vendas: 0,
  });
  // Função para carregar os dados
  useEffect(() => {
    const carregarDados = async () => {
      try {
        const clientes = await fetchQuantidade("/api/clientes");
        const veiculos = await fetchQuantidade("/api/veiculos");
        // const vendas = await fetchQuantidade("/api/vendas");
        // Atualiza os estados
        setQuantidades({
          clientes,
          veiculos,
          // vendas,
        });
      } catch (error) {
        console.error("Erro ao buscar dados:", error);
      } finally {
        // Define o estado de carregamento como false
        setLoading(false);
      }
    };
    // Chama a função para carregar os dados
    carregarDados();
  }, []);

  // Se estiver carregando, mostra o loader
  if (loading) return <Loader />;

  return (
    <section className="grid gap-4 p-4 grid-cols-1 md:grid-cols-3 ">
      {/* Veículos Cadastrado */}
      <CardInfo
        rota="veiculos"
        titulo="Veículos Cadastrados"
        quantidade={quantidades.veiculos || 0}
        icon={<FaCarSide className="text-4xl" />}
      />
      {/* Clientes Cadastrados */}
      <CardInfo
        rota="clientes"
        titulo="Clientes Cadastrados"
        quantidade={quantidades.clientes || 0}
        icon={<FaUserPlus className="text-4xl" />}
      />
      {/* Qtde de Vendas Realizadas */}
      <CardInfo
        rota="vendas"
        titulo="Vendas Realizadas"
        quantidade={quantidades.vendas || 0}
        icon={<FaChartLine className="text-4xl" />}
      />
    </section>
  );
};
export default Home;
