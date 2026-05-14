import { useMemo, useState, useEffect } from "react";

const origemOptions = ["Instagram", "WhatsApp", "Grupo", "Indicação", "Influenciador", "Condomínio", "Outro"];
const statusOptions = ["Testando", "Ativo", "Vencido", "Cancelado", "Aguardando Pagamento"];

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
  {
    id: 2,
    nome: "Cliente 2",
    telefone: "",
    origem: "Grupo",
    status: "Ativo",
    valor: 34.9,
    custo: 8,
    data: "2026-05-14",
    vencimento: "2026-06-14",
    observacao: "Venda pelo WhatsApp",
  },
];

const initialExpenses = [
  { id: 1, descricao: "Divulgação inicial", categoria: "Marketing", valor: 29, data: "2026-05-14" },
  { id: 2, descricao: "Compra de seguidores/curtidas", categoria: "Marketing", valor: 56, data: "2026-05-14" },
];

function money(value) {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(value || 0));
}

export default function PlayHubFinanceDashboard() {
  const [clients, setClients] = useState(() => {
    const saved = localStorage.getItem("playhub_clients");
    return saved ? JSON.parse(saved) : initialClients;
  });

  const [expenses, setExpenses] = useState(() => {
    const saved = localStorage.getItem("playhub_expenses");
    return saved ? JSON.parse(saved) : initialExpenses;
  });

  const [filters, setFilters] = useState({ start: "", end: "", status: "Todos", origem: "Todos" });
  const [clientForm, setClientForm] = useState({ nome: "", telefone: "", origem: "Instagram", status: "Testando", valor: 34.9, custo: 8, data: new Date().toISOString().slice(0, 10), vencimento: "", observacao: "" });
  const [expenseForm, setExpenseForm] = useState({ descricao: "", categoria: "Marketing", valor: "", data: new Date().toISOString().slice(0, 10) });

  useEffect(() => localStorage.setItem("playhub_clients", JSON.stringify(clients)), [clients]);
  useEffect(() => localStorage.setItem("playhub_expenses", JSON.stringify(expenses)), [expenses]);

  const filteredClients = useMemo(() => {
    return clients.filter((c) => {
      const byStart = !filters.start || c.data >= filters.start;
      const byEnd = !filters.end || c.data <= filters.end;
      const byStatus = filters.status === "Todos" || c.status === filters.status;
      const byOrigem = filters.origem === "Todos" || c.origem === filters.origem;
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
    const faturado = filteredClients.reduce((s, c) => s + Number(c.valor || 0), 0);
    const custoClientes = filteredClients.reduce((s, c) => s + Number(c.custo || 0), 0);
    const gastos = filteredExpenses.reduce((s, e) => s + Number(e.valor || 0), 0);
    const lucro = faturado - custoClientes - gastos;
    return { faturado, custoClientes, gastos, lucro };
  }, [filteredClients, filteredExpenses]);

  function addClient(e) {
    e.preventDefault();
    if (!clientForm.nome) return;
    setClients([{ ...clientForm, id: Date.now(), valor: Number(clientForm.valor), custo: Number(clientForm.custo) }, ...clients]);
    setClientForm({ nome: "", telefone: "", origem: "Instagram", status: "Testando", valor: 34.9, custo: 8, data: new Date().toISOString().slice(0, 10), vencimento: "", observacao: "" });
  }

  function addExpense(e) {
    e.preventDefault();
    if (!expenseForm.descricao || !expenseForm.valor) return;
    setExpenses([{ ...expenseForm, id: Date.now(), valor: Number(expenseForm.valor) }, ...expenses]);
    setExpenseForm({ descricao: "", categoria: "Marketing", valor: "", data: new Date().toISOString().slice(0, 10) });
  }

  function updateClient(id, field, value) {
    setClients(clients.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-cyan-400 tracking-tight">PlayHub Control Center</h1>
            <p className="text-zinc-400 mt-2">CRM + financeiro alimentado direto no site.</p>
          </div>
          <div className="text-sm text-zinc-400">Dados salvos automaticamente no navegador</div>
        </header>

        <section className="bg-zinc-950 rounded-3xl p-5 border border-cyan-500/20">
          <h2 className="text-xl font-bold text-cyan-400 mb-4">Filtros por período e funil</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <input type="date" className="input" value={filters.start} onChange={(e) => setFilters({ ...filters, start: e.target.value })} />
            <input type="date" className="input" value={filters.end} onChange={(e) => setFilters({ ...filters, end: e.target.value })} />
            <select className="input" value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
              <option>Todos</option>{statusOptions.map((s) => <option key={s}>{s}</option>)}
            </select>
            <select className="input" value={filters.origem} onChange={(e) => setFilters({ ...filters, origem: e.target.value })}>
              <option>Todos</option>{origemOptions.map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <Card label="Clientes filtrados" value={filteredClients.length} />
          <Card label="Ativos" value={filteredClients.filter((c) => c.status === "Ativo").length} />
          <Card label="Faturado" value={money(totals.faturado)} cyan />
          <Card label="Gastos" value={money(totals.custoClientes + totals.gastos)} red />
          <Card label="Lucro" value={money(totals.lucro)} green />
        </section>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <form onSubmit={addClient} className="panel space-y-3">
            <h2 className="title">Adicionar cliente / lead</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <input className="input" placeholder="Nome do cliente" value={clientForm.nome} onChange={(e) => setClientForm({ ...clientForm, nome: e.target.value })} />
              <input className="input" placeholder="Telefone" value={clientForm.telefone} onChange={(e) => setClientForm({ ...clientForm, telefone: e.target.value })} />
              <select className="input" value={clientForm.origem} onChange={(e) => setClientForm({ ...clientForm, origem: e.target.value })}>{origemOptions.map((o) => <option key={o}>{o}</option>)}</select>
              <select className="input" value={clientForm.status} onChange={(e) => setClientForm({ ...clientForm, status: e.target.value })}>{statusOptions.map((s) => <option key={s}>{s}</option>)}</select>
              <input className="input" type="number" step="0.01" placeholder="Valor recebido" value={clientForm.valor} onChange={(e) => setClientForm({ ...clientForm, valor: e.target.value })} />
              <input className="input" type="number" step="0.01" placeholder="Custo do acesso" value={clientForm.custo} onChange={(e) => setClientForm({ ...clientForm, custo: e.target.value })} />
              <input className="input" type="date" value={clientForm.data} onChange={(e) => setClientForm({ ...clientForm, data: e.target.value })} />
              <input className="input" type="date" value={clientForm.vencimento} onChange={(e) => setClientForm({ ...clientForm, vencimento: e.target.value })} />
            </div>
            <textarea className="input min-h-[90px]" placeholder="Observação: exemplo, veio pela Amy, pediu teste, precisa instalar na TV..." value={clientForm.observacao} onChange={(e) => setClientForm({ ...clientForm, observacao: e.target.value })} />
            <button className="btn">Salvar cliente</button>
          </form>

          <form onSubmit={addExpense} className="panel space-y-3">
            <h2 className="title">Adicionar gasto</h2>
            <input className="input" placeholder="Descrição do gasto" value={expenseForm.descricao} onChange={(e) => setExpenseForm({ ...expenseForm, descricao: e.target.value })} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input className="input" placeholder="Categoria" value={expenseForm.categoria} onChange={(e) => setExpenseForm({ ...expenseForm, categoria: e.target.value })} />
              <input className="input" type="number" step="0.01" placeholder="Valor" value={expenseForm.valor} onChange={(e) => setExpenseForm({ ...expenseForm, valor: e.target.value })} />
              <input className="input" type="date" value={expenseForm.data} onChange={(e) => setExpenseForm({ ...expenseForm, data: e.target.value })} />
            </div>
            <button className="btn">Salvar gasto</button>

            <div className="mt-6 space-y-2">
              {filteredExpenses.map((e) => <div key={e.id} className="flex justify-between bg-black/40 rounded-2xl p-3 text-sm"><span>{e.data} — {e.descricao}</span><span className="text-red-400">{money(e.valor)}</span></div>)}
            </div>
          </form>
        </section>

        <section className="panel overflow-x-auto">
          <h2 className="title mb-4">Acompanhamento de clientes</h2>
          <table className="w-full text-sm text-left min-w-[1000px]">
            <thead className="text-zinc-400 border-b border-zinc-800">
              <tr>
                <th className="py-3">Cliente</th><th>Contato</th><th>Origem</th><th>Status</th><th>Venda</th><th>Custo</th><th>Lucro</th><th>Entrada</th><th>Vencimento</th><th>Observação</th><th></th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map((c) => (
                <tr key={c.id} className="border-b border-zinc-900 align-top">
                  <td className="py-3 font-semibold">{c.nome}</td>
                  <td>{c.telefone}</td>
                  <td>{c.origem}</td>
                  <td>
                    <select className="bg-zinc-800 rounded-xl px-2 py-1" value={c.status} onChange={(e) => updateClient(c.id, "status", e.target.value)}>{statusOptions.map((s) => <option key={s}>{s}</option>)}</select>
                  </td>
                  <td>{money(c.valor)}</td>
                  <td>{money(c.custo)}</td>
                  <td className="text-green-400 font-bold">{money(Number(c.valor) - Number(c.custo))}</td>
                  <td>{c.data}</td>
                  <td>{c.vencimento || "-"}</td>
                  <td className="max-w-[260px] text-zinc-300">{c.observacao}</td>
                  <td><button onClick={() => setClients(clients.filter((x) => x.id !== c.id))} className="text-red-400">Excluir</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>

      <style>{`
        .panel { background: #09090b; border: 1px solid rgba(34,211,238,.22); border-radius: 24px; padding: 20px; box-shadow: 0 0 40px rgba(34,211,238,.05); }
        .title { font-size: 22px; font-weight: 800; color: #22d3ee; }
        .input { width: 100%; background: #18181b; border: 1px solid #27272a; color: white; border-radius: 16px; padding: 12px 14px; outline: none; }
        .input:focus { border-color: #22d3ee; box-shadow: 0 0 0 2px rgba(34,211,238,.16); }
        .btn { background: #22d3ee; color: #000; font-weight: 800; border-radius: 16px; padding: 12px 16px; width: 100%; }
      `}</style>
    </div>
  );
}

function Card({ label, value, cyan, red, green }) {
  return (
    <div className="bg-zinc-950 rounded-3xl p-5 border border-cyan-500/20">
      <p className="text-zinc-400 text-sm">{label}</p>
      <h2 className={`text-2xl md:text-3xl font-black mt-2 ${cyan ? "text-cyan-400" : red ? "text-red-400" : green ? "text-green-400" : "text-white"}`}>{value}</h2>
    </div>
  );
}
