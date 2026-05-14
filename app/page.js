"use client";

import { useMemo, useState, useEffect } from "react";

const origemOptions = [
  "Instagram",
  "WhatsApp",
  "Grupo",
  "Indicação",
  "Influenciador",
  "Condomínio",
  "Outro",
];

const statusOptions = [
  "Testando",
  "Ativo",
  "Vencido",
  "Cancelado",
  "Aguardando Pagamento",
];

const initialClients = [
  {
    id: 1,
    nome: "Cliente 1",
    telefone: "",
    origem: "Instagram",
    status: "Ativo",
    valor: 24.9,
    custo: 8,
    data: "2026-05-13",
    vencimento: "2026-06-13",
    observacao: "Primeira venda da PlayHub",
  },
];

const initialExpenses = [
  {
    id: 1,
    descricao: "Divulgação",
    categoria: "Marketing",
    valor: 29,
    data: "2026-05-14",
  },
];

function money(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value || 0));
}

export default function Page() {
  const [clients, setClients] = useState(() => {
    if (typeof window === "undefined") return initialClients;

    const saved = localStorage.getItem("playhub_clients");

    return saved ? JSON.parse(saved) : initialClients;
  });

  const [expenses, setExpenses] = useState(() => {
    if (typeof window === "undefined") return initialExpenses;

    const saved = localStorage.getItem("playhub_expenses");

    return saved ? JSON.parse(saved) : initialExpenses;
  });

  const [filters, setFilters] = useState({
    start: "",
    end: "",
    status: "Todos",
    origem: "Todos",
  });

  const [clientForm, setClientForm] = useState({
    nome: "",
    telefone: "",
    origem: "Instagram",
    status: "Testando",
    valor: 34.9,
    custo: 8,
    data: new Date().toISOString().slice(0, 10),
    vencimento: "",
    observacao: "",
  });

  const [expenseForm, setExpenseForm] = useState({
    descricao: "",
    categoria: "Marketing",
    valor: "",
    data: new Date().toISOString().slice(0, 10),
  });

  useEffect(() => {
    localStorage.setItem("playhub_clients", JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem("playhub_expenses", JSON.stringify(expenses));
  }, [expenses]);

  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const byStart = !filters.start || c.data >= filters.start;
      const byEnd = !filters.end || c.data <= filters.end;
      const byStatus =
        filters.status === "Todos" || c.status === filters.status;
      const byOrigem =
        filters.origem === "Todos" || c.origem === filters.origem;

      return byStart && byEnd && byStatus && byOrigem;
    });
  }, [clients, filters]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter((e) => {
      const byStart = !filters.start || e.data >= filters.start;
      const byEnd = !filters.end || e.data <= filters.end;

      return byStart && byEnd;
    });
  }, [expenses, filters]);

  const totals = useMemo(() => {
    const faturado = filteredClients.reduce(
      (s, c) => s + Number(c.valor || 0),
      0
    );

    const custoClientes = filteredClients.reduce(
      (s, c) => s + Number(c.custo || 0),
      0
    );

    const gastos = filteredExpenses.reduce(
      (s, e) => s + Number(e.valor || 0),
      0
    );

    const lucro = faturado - custoClientes - gastos;

    return {
      faturado,
      custoClientes,
      gastos,
      lucro,
    };
  }, [filteredClients, filteredExpenses]);

  function addClient(e) {
    e.preventDefault();

    if (!clientForm.nome) return;

    setClients([
      {
        ...clientForm,
        id: Date.now(),
        valor: Number(clientForm.valor),
        custo: Number(clientForm.custo),
      },
      ...clients,
    ]);

    setClientForm({
      nome: "",
      telefone: "",
      origem: "Instagram",
      status: "Testando",
      valor: 34.9,
      custo: 8,
      data: new Date().toISOString().slice(0, 10),
      vencimento: "",
      observacao: "",
    });
  }

  function addExpense(e) {
    e.preventDefault();

    if (!expenseForm.descricao || !expenseForm.valor) return;

    setExpenses([
      {
        ...expenseForm,
        id: Date.now(),
        valor: Number(expenseForm.valor),
      },
      ...expenses,
    ]);

    setExpenseForm({
      descricao: "",
      categoria: "Marketing",
      valor: "",
      data: new Date().toISOString().slice(0, 10),
    });
  }

  function updateClient(id, field, value) {
    setClients(
      clients.map((c) =>
        c.id === id ? { ...c, [field]: value } : c
      )
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">

        <div>
          <h1 className="text-5xl font-black text-cyan-400">
            PlayHub Control Center
          </h1>

          <p className="text-zinc-400 mt-2">
            CRM + Financeiro da operação
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">

          <Card
            title="Clientes"
            value={filteredClients.length}
          />

          <Card
            title="Ativos"
            value={
              filteredClients.filter(
                (c) => c.status === "Ativo"
              ).length
            }
          />

          <Card
            title="Faturado"
            value={money(totals.faturado)}
            color="cyan"
          />

          <Card
            title="Gastos"
            value={money(
              totals.custoClientes + totals.gastos
            )}
            color="red"
          />

          <Card
            title="Lucro"
            value={money(totals.lucro)}
            color="green"
          />

        </div>

        <div className="panel">

          <h2 className="title">
            Filtros
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">

            <input
              type="date"
              className="input"
              value={filters.start}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  start: e.target.value,
                })
              }
            />

            <input
              type="date"
              className="input"
              value={filters.end}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  end: e.target.value,
                })
              }
            />

            <select
              className="input"
              value={filters.status}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  status: e.target.value,
                })
              }
            >
              <option>Todos</option>

              {statusOptions.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            <select
              className="input"
              value={filters.origem}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  origem: e.target.value,
                })
              }
            >
              <option>Todos</option>

              {origemOptions.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>

          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <form
            onSubmit={addClient}
            className="panel space-y-3"
          >

            <h2 className="title">
              Novo Cliente
            </h2>

            <input
              className="input"
              placeholder="Nome"
              value={clientForm.nome}
              onChange={(e) =>
                setClientForm({
                  ...clientForm,
                  nome: e.target.value,
                })
              }
            />

            <input
              className="input"
              placeholder="Telefone"
              value={clientForm.telefone}
              onChange={(e) =>
                setClientForm({
                  ...clientForm,
                  telefone: e.target.value,
                })
              }
            />

            <select
              className="input"
              value={clientForm.origem}
              onChange={(e) =>
                setClientForm({
                  ...clientForm,
                  origem: e.target.value,
                })
              }
            >
              {origemOptions.map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>

            <select
              className="input"
              value={clientForm.status}
              onChange={(e) =>
                setClientForm({
                  ...clientForm,
                  status: e.target.value,
                })
              }
            >
              {statusOptions.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            <input
              type="number"
              className="input"
              placeholder="Valor"
              value={clientForm.valor}
              onChange={(e) =>
                setClientForm({
                  ...clientForm,
                  valor: e.target.value,
                })
              }
            />

            <textarea
              className="input min-h-[100px]"
              placeholder="Observações"
              value={clientForm.observacao}
              onChange={(e) =>
                setClientForm({
                  ...clientForm,
                  observacao: e.target.value,
                })
              }
            />

            <button className="btn">
              Salvar Cliente
            </button>

          </form>

          <form
            onSubmit={addExpense}
            className="panel space-y-3"
          >

            <h2 className="title">
              Novo Gasto
            </h2>

            <input
              className="input"
              placeholder="Descrição"
              value={expenseForm.descricao}
              onChange={(e) =>
                setExpenseForm({
                  ...expenseForm,
                  descricao: e.target.value,
                })
              }
            />

            <input
              type="number"
              className="input"
              placeholder="Valor"
              value={expenseForm.valor}
              onChange={(e) =>
                setExpenseForm({
                  ...expenseForm,
                  valor: e.target.value,
                })
              }
            />

            <button className="btn">
              Salvar Gasto
            </button>

          </form>

        </div>

        <div className="panel overflow-auto">

          <h2 className="title mb-4">
            Clientes
          </h2>

          <table className="w-full text-left">

            <thead className="text-zinc-400">

              <tr>
                <th>Cliente</th>
                <th>Origem</th>
                <th>Status</th>
                <th>Valor</th>
                <th>Lucro</th>
                <th>Observação</th>
              </tr>

            </thead>

            <tbody>

              {filteredClients.map((c) => (

                <tr
                  key={c.id}
                  className="border-t border-zinc-800"
                >

                  <td className="py-3">
                    {c.nome}
                  </td>

                  <td>{c.origem}</td>

                  <td>

                    <select
                      className="bg-zinc-800 rounded-xl px-2 py-1"
                      value={c.status}
                      onChange={(e) =>
                        updateClient(
                          c.id,
                          "status",
                          e.target.value
                        )
                      }
                    >
                      {statusOptions.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>

                  </td>

                  <td>{money(c.valor)}</td>

                  <td className="text-green-400 font-bold">
                    {money(
                      Number(c.valor) -
                        Number(c.custo)
                    )}
                  </td>

                  <td>{c.observacao}</td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>

      <style>{`
        .panel {
          background: #09090b;
          border: 1px solid rgba(34,211,238,.2);
          border-radius: 24px;
          padding: 20px;
        }

        .title {
          font-size: 22px;
          font-weight: 800;
          color: #22d3ee;
        }

        .input {
          width: 100%;
          background: #18181b;
          border: 1px solid #27272a;
          color: white;
          border-radius: 16px;
          padding: 12px 14px;
        }

        .btn {
          background: #22d3ee;
          color: black;
          width: 100%;
          padding: 12px;
          border-radius: 16px;
          font-weight: 800;
        }
      `}</style>

    </div>
  );
}

function Card({
  title,
  value,
  color,
}) {
  return (
    <div className="panel">

      <p className="text-zinc-400 text-sm">
        {title}
      </p>

      <h2
        className={`text-3xl font-black mt-2 ${
          color === "cyan"
            ? "text-cyan-400"
            : color === "red"
            ? "text-red-400"
            : color === "green"
            ? "text-green-400"
            : "text-white"
        }`}
      >
        {value}
      </h2>

    </div>
  );
}
