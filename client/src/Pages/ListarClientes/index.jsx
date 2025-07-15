import { useState, useEffect } from "react";

const ListarClientes = () => {
  const [clientes, setClientes] = useState([]);

  async function buscarClientes() {
    const url = `${import.meta.env.VITE_API_URL}/api/clientes`;
    try {
      const response = await fetch(`${url}`);
      const data = await response.json();
      const dataCort = data.slice(0, 10);
      setClientes(dataCort);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    buscarClientes();
  }, []);

  return (
    <section>
      <ul>
        {clientes.map((cliente) => {
          return <li key={cliente.id}>{cliente.nome}</li>;
        })}
      </ul>
    </section>
  );
};

export default ListarClientes;
