"use client";

import { useState, useEffect } from "react";

export default function Page() {
  const [clientes, setClientes] = useState([]);
  const [nome, setNome] = useState("");
  const [status, setStatus] = useState("Testando");
  const [valor, setValor] = useState("");

  useEffect(() => {
    const data = localStorage.getItem("clientes");
    if (data) {
      setClientes(JSON.parse(data));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("clientes", JSON.stringify(clientes));
  }, [clientes]);

  function adicionarCliente() {
    if (!nome || !valor) return;

    const novo = {
      id: Date.now(),
      nome,
      status,
      valor: Number(valor),
    };

    setClientes([novo, ...clientes]);

    setNome("");
    setValor("");
    setStatus("Testando");
  }

  const faturamento = clientes.reduce(
    (acc, item) => acc + item.valor,
    0
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#000",
        color: "#fff",
        padding: 30,
        fontFamily: "Arial",
      }}
    >
      <h1
        style={{
          color: "#00e5ff",
          fontSize: 40,
          fontWeight: "bold",
        }}
      >
        PLAYHUB CONTROL
      </h1>

      <div
        style={{
          marginTop: 30,
          background: "#111",
          padding: 20,
          borderRadius: 20,
        }}
      >
        <h2>Novo Cliente</h2>

        <input
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          style={input}
        />

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          style={input}
        >
          <option>Testando</option>
          <option>Ativo</option>
          <option>Cancelado</option>
        </select>

        <input
          placeholder="Valor"
          type="number"
          value={valor}
          onChange={(e) => setValor(e.target.value)}
          style={input}
        />

        <button
          onClick={adicionarCliente}
          style={button}
        >
          Adicionar Cliente
        </button>
      </div>

      <div
        style={{
          marginTop: 30,
          background: "#111",
          padding: 20,
          borderRadius: 20,
        }}
      >
        <h2>Faturamento</h2>

        <h1
          style={{
            color: "#00ff88",
            fontSize: 35,
          }}
        >
          R$ {faturamento.toFixed(2)}
        </h1>
      </div>

      <div
        style={{
          marginTop: 30,
          background: "#111",
          padding: 20,
          borderRadius: 20,
        }}
      >
        <h2>Clientes</h2>

        {clientes.map((cliente) => (
          <div
            key={cliente.id}
            style={{
              background: "#1a1a1a",
              padding: 15,
              borderRadius: 15,
              marginTop: 10,
            }}
          >
            <h3>{cliente.nome}</h3>

            <p>Status: {cliente.status}</p>

            <p>Valor: R$ {cliente.valor}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const input = {
  width: "100%",
  padding: 12,
  marginTop: 10,
  borderRadius: 10,
  border: "none",
  background: "#222",
  color: "#fff",
};

const button = {
  marginTop: 15,
  width: "100%",
  padding: 15,
  borderRadius: 12,
  border: "none",
  background: "#00e5ff",
  color: "#000",
  fontWeight: "bold",
  cursor: "pointer",
};
