“use client”;
import { useState, useEffect } from “react”;
import { supabase } from “./supabase”;

const COLORS = {
blue: “#2C5AA0”,
blueDark: “#1E3F73”,
blueLight: “#E8EFF8”,
pink: “#FE4F6B”,
pinkLight: “#FFF0F2”,
yellow: “#FFB800”,
yellowLight: “#FFF8E6”,
green: “#2ECC71”,
greenLight: “#EAFAF1”,
white: “#FFFFFF”,
bg: “#F5F7FB”,
text: “#1A2332”,
textMuted: “#6B7A90”,
border: “#E2E8F0”,
};

function StatusBadge({ status }: { status: string }) {
const config: Record<string, { bg: string; color: string; label: string }> = {
pendente: { bg: COLORS.yellowLight, color: “#B8860B”, label: “Pendente” },
aprovado: { bg: COLORS.greenLight, color: “#1B8A4A”, label: “Aprovado” },
revisar: { bg: COLORS.pinkLight, color: COLORS.pink, label: “Revisar” },
};
const c = config[status] || config[“pendente”];
return (
<span style={{ background: c.bg, color: c.color, padding: “4px 10px”, borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
{c.label}
</span>
);
}

function LoginScreen({ onLogin }: { onLogin: (user: any) => void }) {
const [email, setEmail] = useState(””);
const [pass, setPass] = useState(””);
const [erro, setErro] = useState(””);
const [loading, setLoading] = useState(false);

async function handleLogin() {
setErro(””);
setLoading(true);
const { data, error } = await supabase
.from(“usuarios”)
.select(”*, escolas(nome)”)
.eq(“email”, email)
.eq(“senha_hash”, pass)
.single();
setLoading(false);
if (error || !data) {
setErro(“E-mail ou senha incorretos”);
return;
}
onLogin(data);
}

return (
<div style={{
minHeight: “100vh”,
background: `linear-gradient(145deg, ${COLORS.blue} 0%, ${COLORS.blueDark} 100%)`,
display: “flex”,
flexDirection: “column”,
alignItems: “center”,
justifyContent: “center”,
padding: 24,
}}>
<div style={{ textAlign: “center”, marginBottom: 40 }}>
<div style={{
width: 72, height: 72, borderRadius: 20,
background: “rgba(255,255,255,0.15)”,
backdropFilter: “blur(10px)”,
display: “flex”, alignItems: “center”, justifyContent: “center”,
margin: “0 auto 16px”,
border: “1px solid rgba(255,255,255,0.2)”,
}}>
<span style={{ fontSize: 36 }}>📋</span>
</div>
<h1 style={{ color: COLORS.white, fontSize: 28, fontWeight: 700, margin: “0 0 4px” }}>Coordinator</h1>
<p style={{ color: “rgba(255,255,255,0.7)”, fontSize: 14, margin: 0, letterSpacing: 1.5, textTransform: “uppercase”, fontWeight: 500 }}>by KidFly</p>
</div>

```
  <div style={{
    background: COLORS.white, borderRadius: 24, padding: "32px 24px",
    width: "100%", maxWidth: 380, boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
  }}>
    <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: "0 0 4px" }}>Bem-vinda! 👋</h2>
    <p style={{ fontSize: 14, color: COLORS.textMuted, margin: "0 0 24px" }}>Entre com seu acesso KidFly</p>

    {erro && (
      <div style={{ background: COLORS.pinkLight, color: COLORS.pink, padding: "10px 14px", borderRadius: 12, fontSize: 13, fontWeight: 600, marginBottom: 16 }}>
        {erro}
      </div>
    )}

    <div style={{ marginBottom: 16 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 6 }}>E-mail</label>
      <input type="email" value={email} onChange={e => setEmail(e.target.value)}
        placeholder="seu@email.com"
        style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `2px solid ${COLORS.border}`, fontSize: 15, outline: "none", boxSizing: "border-box" }}
      />
    </div>

    <div style={{ marginBottom: 24 }}>
      <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 6 }}>Senha</label>
      <input type="password" value={pass} onChange={e => setPass(e.target.value)}
        placeholder="••••••••"
        style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `2px solid ${COLORS.border}`, fontSize: 15, outline: "none", boxSizing: "border-box" }}
      />
    </div>

    <button onClick={handleLogin} disabled={loading}
      style={{
        width: "100%", padding: "14px", borderRadius: 14, border: "none",
        background: `linear-gradient(135deg, ${COLORS.pink} 0%, #E8405A 100%)`,
        color: COLORS.white, fontSize: 16, fontWeight: 700, cursor: "pointer",
        boxShadow: `0 4px 15px ${COLORS.pink}44`, opacity: loading ? 0.7 : 1,
      }}>
      {loading ? "Entrando..." : "Entrar"}
    </button>

    <p style={{ textAlign: "center", fontSize: 13, color: COLORS.textMuted, marginTop: 16, marginBottom: 0 }}>
      Acesso exclusivo para assinantes<br />KidFly Equipe e Escola
    </p>
    <p style={{ textAlign: "center", fontSize: 11, color: COLORS.textMuted, marginTop: 12, marginBottom: 0, background: COLORS.blueLight, padding: "8px", borderRadius: 8 }}>
      Demo: maria@escola.com / 123456
    </p>
  </div>

  <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 32 }}>© 2026 KidFly · Todos os direitos reservados</p>
</div>
```

);
}

function DashboardScreen({ user, avisos, planos, eventos, turmas }: any) {
const nomeFirst = user.nome.split(” “)[0];
const escolaNome = user.escolas?.nome || “Minha Escola”;
const pendentes = planos.filter((p: any) => p.status === “pendente”).length;

return (
<div>
<div style={{ marginBottom: 24 }}>
<h2 style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, margin: “0 0 4px” }}>Bom dia, {nomeFirst}! ☀️</h2>
<p style={{ fontSize: 14, color: COLORS.textMuted, margin: 0 }}>{escolaNome}</p>
</div>

```
  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
    {[
      { label: "Planos pendentes", value: String(pendentes), icon: "📝", bg: COLORS.yellowLight },
      { label: "Avisos ativos", value: String(avisos.length), icon: "📢", bg: COLORS.pinkLight },
      { label: "Próximos eventos", value: String(eventos.length), icon: "📅", bg: COLORS.blueLight },
      { label: "Professoras", value: String(turmas.length), icon: "👩‍🏫", bg: COLORS.greenLight },
    ].map((stat, i) => (
      <div key={i} style={{ background: COLORS.white, borderRadius: 16, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", border: `1px solid ${COLORS.border}` }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 10 }}>{stat.icon}</div>
        <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.text }}>{stat.value}</div>
        <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>{stat.label}</div>
      </div>
    ))}
  </div>

  <div style={{ background: COLORS.white, borderRadius: 16, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", border: `1px solid ${COLORS.border}`, marginBottom: 16 }}>
    <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, margin: "0 0 12px" }}>Planos recentes</h3>
    {planos.length === 0 && <p style={{ fontSize: 13, color: COLORS.textMuted }}>Nenhum plano ainda</p>}
    {planos.slice(0, 3).map((p: any) => (
      <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderTop: `1px solid ${COLORS.border}` }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{p.titulo}</div>
          <div style={{ fontSize: 12, color: COLORS.textMuted }}>{p.turmas?.nome}</div>
        </div>
        <StatusBadge status={p.status} />
      </div>
    ))}
  </div>

  <div style={{ background: COLORS.white, borderRadius: 16, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", border: `1px solid ${COLORS.border}` }}>
    <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, margin: "0 0 12px" }}>Próximos eventos</h3>
    {eventos.length === 0 && <p style={{ fontSize: 13, color: COLORS.textMuted }}>Nenhum evento</p>}
    {eventos.slice(0, 3).map((ev: any) => (
      <div key={ev.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderTop: `1px solid ${COLORS.border}` }}>
        <div style={{ width: 4, height: 36, borderRadius: 4, background: ev.cor, flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{ev.titulo}</div>
          <div style={{ fontSize: 12, color: COLORS.textMuted }}>{new Date(ev.data + "T12:00:00").toLocaleDateString("pt-BR")}</div>
        </div>
      </div>
    ))}
  </div>
</div>
```

);
}

function MuralScreen({ avisos, user }: any) {
const [lista, setLista] = useState(avisos);
const [mostrarForm, setMostrarForm] = useState(false);
const [titulo, setTitulo] = useState(””);
const [urgente, setUrgente] = useState(false);

async function criarAviso() {
if (!titulo.trim()) return;
const { data } = await supabase.from(“avisos”).insert({ escola_id: user.escola_id, autor_id: user.id, titulo, urgente }).select().single();
if (data) { setLista([data, …lista]); setTitulo(””); setMostrarForm(false); }
}

return (
<div>
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “center”, marginBottom: 20 }}>
<h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: 0 }}>Mural de Avisos</h2>
<button onClick={() => setMostrarForm(!mostrarForm)} style={{ background: COLORS.pink, color: COLORS.white, border: “none”, borderRadius: 12, padding: “8px 16px”, fontSize: 13, fontWeight: 600, cursor: “pointer” }}>
{mostrarForm ? “✕ Fechar” : “+ Novo”}
</button>
</div>

```
  {mostrarForm && (
    <div style={{ background: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 16, border: `1px solid ${COLORS.border}` }}>
      <input value={titulo} onChange={e => setTitulo(e.target.value)} placeholder="Título do aviso..."
        style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: `2px solid ${COLORS.border}`, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 10 }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <div onClick={() => setUrgente(!urgente)} style={{ width: 22, height: 22, borderRadius: 6, border: `2px solid ${urgente ? COLORS.pink : COLORS.border}`, background: urgente ? COLORS.pink : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
          {urgente && <span style={{ color: COLORS.white, fontSize: 12, fontWeight: 700 }}>✓</span>}
        </div>
        <span style={{ fontSize: 13, color: COLORS.text }}>Urgente</span>
      </div>
      <button onClick={criarAviso} style={{ width: "100%", padding: 10, borderRadius: 10, border: "none", background: COLORS.blue, color: COLORS.white, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
        Publicar aviso
      </button>
    </div>
  )}

  {lista.length === 0 && <p style={{ fontSize: 13, color: COLORS.textMuted, textAlign: "center", marginTop: 40 }}>Nenhum aviso ainda</p>}
  {lista.map((aviso: any) => (
    <div key={aviso.id} style={{
      background: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12,
      boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
      border: `1px solid ${aviso.urgente ? COLORS.pink + "33" : COLORS.border}`,
      borderLeft: aviso.urgente ? `4px solid ${COLORS.pink}` : `4px solid ${COLORS.border}`,
    }}>
      <h3 style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, margin: "0 0 8px" }}>
        {aviso.urgente && <span style={{ color: COLORS.pink, marginRight: 6 }}>●</span>}
        {aviso.titulo}
      </h3>
      <span style={{ fontSize: 12, color: COLORS.textMuted }}>{new Date(aviso.created_at).toLocaleDateString("pt-BR")}</span>
    </div>
  ))}
</div>
```

);
}

function ChatScreen({ turmas }: any) {
return (
<div>
<h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: “0 0 20px” }}>Chat por Turma</h2>
{turmas.map((turma: any) => (
<div key={turma.id} style={{ background: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, boxShadow: “0 2px 8px rgba(0,0,0,0.04)”, border: `1px solid ${COLORS.border}` }}>
<div style={{ display: “flex”, alignItems: “center”, gap: 12 }}>
<div style={{ width: 48, height: 48, borderRadius: 14, background: COLORS.blueLight, display: “flex”, alignItems: “center”, justifyContent: “center”, fontSize: 22, flexShrink: 0 }}>
{turma.nome.includes(“Berçário”) ? “🍼” : turma.nome.includes(“Maternal”) ? “🧸” : “🎨”}
</div>
<div style={{ flex: 1 }}>
<h3 style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, margin: 0 }}>{turma.nome}</h3>
<div style={{ fontSize: 13, color: COLORS.textMuted }}>{turma.usuarios?.nome ? `Prof. ${turma.usuarios.nome}` : “”} · {turma.qtd_alunos} alunos</div>
</div>
</div>
</div>
))}
</div>
);
}

function PlanosScreen({ planos: initialPlanos }: any) {
const [planos, setPlanos] = useState(initialPlanos);
const [filter, setFilter] = useState(“todos”);
const filtered = filter === “todos” ? planos : planos.filter((p: any) => p.status === filter);

async function updateStatus(id: string, status: string) {
await supabase.from(“planos”).update({ status }).eq(“id”, id);
setPlanos(planos.map((p: any) => p.id === id ? { …p, status } : p));
}

return (
<div>
<h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: “0 0 16px” }}>Planos de Aula</h2>
<div style={{ display: “flex”, gap: 8, marginBottom: 20, overflowX: “auto” }}>
{[{ key: “todos”, label: “Todos” }, { key: “pendente”, label: “Pendentes” }, { key: “aprovado”, label: “Aprovados” }, { key: “revisar”, label: “Revisar” }].map(f => (
<button key={f.key} onClick={() => setFilter(f.key)}
style={{ padding: “8px 16px”, borderRadius: 20, border: “none”, background: filter === f.key ? COLORS.blue : COLORS.blueLight, color: filter === f.key ? COLORS.white : COLORS.blue, fontSize: 13, fontWeight: 600, cursor: “pointer”, whiteSpace: “nowrap” }}>
{f.label}
</button>
))}
</div>
{filtered.length === 0 && <p style={{ fontSize: 13, color: COLORS.textMuted, textAlign: “center”, marginTop: 40 }}>Nenhum plano nesta categoria</p>}
{filtered.map((p: any) => (
<div key={p.id} style={{ background: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, boxShadow: “0 2px 8px rgba(0,0,0,0.04)”, border: `1px solid ${COLORS.border}` }}>
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “center”, marginBottom: 8 }}>
<div>
<h3 style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, margin: “0 0 2px” }}>{p.titulo}</h3>
<span style={{ fontSize: 13, color: COLORS.textMuted }}>{p.turmas?.nome}</span>
</div>
<StatusBadge status={p.status} />
</div>
{p.status === “pendente” && (
<div style={{ display: “flex”, gap: 8, marginTop: 12 }}>
<button onClick={() => updateStatus(p.id, “aprovado”)} style={{ flex: 1, padding: “8px”, borderRadius: 10, border: “none”, background: COLORS.green, color: COLORS.white, fontSize: 13, fontWeight: 600, cursor: “pointer” }}>✓ Aprovar</button>
<button onClick={() => updateStatus(p.id, “revisar”)} style={{ flex: 1, padding: “8px”, borderRadius: 10, border: `2px solid ${COLORS.yellow}`, background: “transparent”, color: “#B8860B”, fontSize: 13, fontWeight: 600, cursor: “pointer” }}>↻ Pedir ajuste</button>
</div>
)}
</div>
))}
</div>
);
}

function CalendarioScreen({ eventos }: any) {
return (
<div>
<h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: “0 0 20px” }}>Calendário Pedagógico</h2>
<div style={{ background: COLORS.white, borderRadius: 16, padding: 16, boxShadow: “0 2px 8px rgba(0,0,0,0.04)”, border: `1px solid ${COLORS.border}`, marginBottom: 20 }}>
<h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, margin: “0 0 4px” }}>Março 2026</h3>
<p style={{ fontSize: 13, color: COLORS.textMuted, margin: “0 0 16px” }}>Semana 24-30</p>
<div style={{ display: “grid”, gridTemplateColumns: “repeat(7, 1fr)”, gap: 4, textAlign: “center” }}>
{[“D”, “S”, “T”, “Q”, “Q”, “S”, “S”].map((d, i) => (
<div key={i} style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600, padding: 4 }}>{d}</div>
))}
{Array.from({ length: 31 }, (_, i) => {
const day = i + 1;
const dateStr = `2026-03-${String(day).padStart(2, "0")}`;
const hasEvent = eventos.some((e: any) => e.data === dateStr);
const isToday = day === new Date().getDate();
return (
<div key={day} style={{ padding: “6px 2px”, borderRadius: 8, fontSize: 13, fontWeight: isToday ? 700 : 400, background: isToday ? COLORS.blue : hasEvent ? COLORS.pinkLight : “transparent”, color: isToday ? COLORS.white : hasEvent ? COLORS.pink : COLORS.text }}>
{day}
</div>
);
})}
</div>
</div>
<h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, margin: “0 0 12px” }}>Próximos eventos</h3>
{eventos.map((ev: any) => (
<div key={ev.id} style={{ background: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 10, display: “flex”, alignItems: “center”, gap: 12, boxShadow: “0 2px 8px rgba(0,0,0,0.04)”, border: `1px solid ${COLORS.border}` }}>
<div style={{ width: 44, height: 44, borderRadius: 12, background: ev.cor + “18”, display: “flex”, alignItems: “center”, justifyContent: “center”, flexShrink: 0 }}>
<div style={{ width: 10, height: 10, borderRadius: “50%”, background: ev.cor }} />
</div>
<div>
<div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{ev.titulo}</div>
<div style={{ fontSize: 12, color: COLORS.textMuted }}>{new Date(ev.data + “T12:00:00”).toLocaleDateString(“pt-BR”)}</div>
</div>
</div>
))}
</div>
);
}

function ChecklistScreen() {
const [items, setItems] = useState([
{ id: 1, text: “Rotina da manhã organizada”, checked: true },
{ id: 2, text: “Materiais acessíveis às crianças”, checked: true },
{ id: 3, text: “Interação professora-criança positiva”, checked: false },
{ id: 4, text: “Espaço limpo e seguro”, checked: true },
{ id: 5, text: “Atividade alinhada ao planejamento”, checked: false },
{ id: 6, text: “Registro fotográfico realizado”, checked: false },
]);

return (
<div>
<h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: “0 0 20px” }}>Checklist de Observação</h2>
<div style={{ background: COLORS.white, borderRadius: 16, padding: 16, boxShadow: “0 2px 8px rgba(0,0,0,0.04)”, border: `1px solid ${COLORS.border}`, marginBottom: 16 }}>
<div style={{ display: “flex”, justifyContent: “space-between”, marginBottom: 12 }}>
<div>
<h3 style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, margin: “0 0 2px” }}>Visita - Berçário II</h3>
<span style={{ fontSize: 12, color: COLORS.textMuted }}>24/03/2026</span>
</div>
<div style={{ width: 44, height: 44, borderRadius: 12, background: COLORS.blueLight, display: “flex”, alignItems: “center”, justifyContent: “center”, fontSize: 14, fontWeight: 700, color: COLORS.blue }}>
{items.filter(i => i.checked).length}/{items.length}
</div>
</div>
{items.map(item => (
<div key={item.id} onClick={() => setItems(items.map(i => i.id === item.id ? { …i, checked: !i.checked } : i))}
style={{ display: “flex”, alignItems: “center”, gap: 12, padding: “12px 0”, borderTop: `1px solid ${COLORS.border}`, cursor: “pointer” }}>
<div style={{ width: 24, height: 24, borderRadius: 8, border: `2px solid ${item.checked ? COLORS.green : COLORS.border}`, background: item.checked ? COLORS.green : “transparent”, display: “flex”, alignItems: “center”, justifyContent: “center”, flexShrink: 0 }}>
{item.checked && <span style={{ color: COLORS.white, fontSize: 14, fontWeight: 700 }}>✓</span>}
</div>
<span style={{ fontSize: 14, color: item.checked ? COLORS.textMuted : COLORS.text, textDecoration: item.checked ? “line-through” : “none” }}>{item.text}</span>
</div>
))}
</div>
<div style={{ background: COLORS.white, borderRadius: 16, padding: 16, boxShadow: “0 2px 8px rgba(0,0,0,0.04)”, border: `1px solid ${COLORS.border}` }}>
<label style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, display: “block”, marginBottom: 8 }}>Comentário da visita</label>
<textarea placeholder=“Observações gerais sobre a visita…”
style={{ width: “100%”, minHeight: 80, padding: 12, borderRadius: 12, border: `2px solid ${COLORS.border}`, fontSize: 14, resize: “vertical”, outline: “none”, boxSizing: “border-box” }} />
<button style={{ width: “100%”, marginTop: 12, padding: 12, borderRadius: 12, border: “none”, background: COLORS.blue, color: COLORS.white, fontSize: 14, fontWeight: 600, cursor: “pointer” }}>
📷 Adicionar foto + Salvar
</button>
</div>
</div>
);
}

function GaleriaScreen() {
const fotos = [
{ id: 1, turma: “Berçário II”, desc: “Atividade sensorial”, color: “#FFB8C6” },
{ id: 2, turma: “Berçário II”, desc: “Hora da música”, color: “#B8D4FF” },
{ id: 3, turma: “Maternal I”, desc: “Pintura com guache”, color: “#FFE0B8” },
{ id: 4, turma: “Maternal I”, desc: “Parquinho”, color: “#B8FFCF” },
{ id: 5, turma: “Jardim I”, desc: “Contação de história”, color: “#E0B8FF” },
{ id: 6, turma: “Jardim I”, desc: “Atividade coletiva”, color: “#FFB8B8” },
];

return (
<div>
<div style={{ display: “flex”, justifyContent: “space-between”, alignItems: “center”, marginBottom: 20 }}>
<h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: 0 }}>Galeria de Fotos</h2>
<button style={{ background: COLORS.pink, color: COLORS.white, border: “none”, borderRadius: 12, padding: “8px 16px”, fontSize: 13, fontWeight: 600, cursor: “pointer” }}>📷 Upload</button>
</div>
<div style={{ display: “flex”, gap: 8, marginBottom: 20, overflowX: “auto” }}>
{[“Todas”, “Berçário II”, “Maternal I”, “Jardim I”].map((t, i) => (
<button key={t} style={{ padding: “8px 16px”, borderRadius: 20, border: “none”, background: i === 0 ? COLORS.blue : COLORS.blueLight, color: i === 0 ? COLORS.white : COLORS.blue, fontSize: 13, fontWeight: 600, cursor: “pointer”, whiteSpace: “nowrap” }}>{t}</button>
))}
</div>
<div style={{ display: “grid”, gridTemplateColumns: “1fr 1fr”, gap: 10 }}>
{fotos.map(foto => (
<div key={foto.id} style={{ borderRadius: 14, overflow: “hidden”, background: COLORS.white, boxShadow: “0 2px 8px rgba(0,0,0,0.04)”, border: `1px solid ${COLORS.border}` }}>
<div style={{ height: 120, background: foto.color, display: “flex”, alignItems: “center”, justifyContent: “center”, fontSize: 32 }}>📸</div>
<div style={{ padding: 10 }}>
<div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{foto.desc}</div>
<div style={{ fontSize: 11, color: COLORS.textMuted }}>{foto.turma} · 24/03</div>
</div>
</div>
))}
</div>
</div>
);
}

const TABS = [
{ id: “dashboard”, icon: “🏠”, label: “Início” },
{ id: “mural”, icon: “📢”, label: “Mural” },
{ id: “chat”, icon: “💬”, label: “Chat” },
{ id: “planos”, icon: “📝”, label: “Planos” },
{ id: “calendario”, icon: “📅”, label: “Agenda” },
{ id: “checklist”, icon: “✅”, label: “Visitas” },
{ id: “galeria”, icon: “📷”, label: “Fotos” },
];

export default function Home() {
const [user, setUser] = useState<any>(null);
const [activeTab, setActiveTab] = useState(“dashboard”);
const [avisos, setAvisos] = useState<any[]>([]);
const [planos, setPlanos] = useState<any[]>([]);
const [eventos, setEventos] = useState<any[]>([]);
const [turmas, setTurmas] = useState<any[]>([]);
const [loading, setLoading] = useState(false);

async function loadData(userData: any) {
setLoading(true);
const [avisosRes, planosRes, eventosRes, turmasRes] = await Promise.all([
supabase.from(“avisos”).select(”*”).eq(“escola_id”, userData.escola_id).order(“created_at”, { ascending: false }),
supabase.from(“planos”).select(”*, turmas(nome)”).order(“created_at”, { ascending: false }),
supabase.from(“eventos”).select(”*”).eq(“escola_id”, userData.escola_id).order(“data”, { ascending: true }),
supabase.from(“turmas”).select(”*, usuarios(nome)”).eq(“escola_id”, userData.escola_id),
]);
setAvisos(avisosRes.data || []);
setPlanos(planosRes.data || []);
setEventos(eventosRes.data || []);
setTurmas(turmasRes.data || []);
setLoading(false);
}

function handleLogin(userData: any) {
setUser(userData);
loadData(userData);
}

if (!user) return <LoginScreen onLogin={handleLogin} />;

if (loading) return (
<div style={{ minHeight: “100vh”, display: “flex”, alignItems: “center”, justifyContent: “center”, background: COLORS.bg }}>
<div style={{ textAlign: “center” }}>
<div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
<p style={{ color: COLORS.textMuted, fontSize: 14 }}>Carregando…</p>
</div>
</div>
);

return (
<div style={{ background: COLORS.bg, minHeight: “100vh”, maxWidth: 480, margin: “0 auto”, position: “relative” }}>
<div style={{ position: “sticky”, top: 0, zIndex: 50, background: COLORS.white, borderBottom: `1px solid ${COLORS.border}`, padding: “12px 20px”, display: “flex”, justifyContent: “space-between”, alignItems: “center” }}>
<div style={{ display: “flex”, alignItems: “center”, gap: 10 }}>
<div style={{ width: 36, height: 36, borderRadius: 10, background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.blueDark})`, display: “flex”, alignItems: “center”, justifyContent: “center” }}>
<span style={{ color: COLORS.white, fontSize: 16 }}>📋</span>
</div>
<div>
<div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text }}>Coordinator</div>
<div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, textTransform: “uppercase” }}>by KidFly</div>
</div>
</div>
<div onClick={() => { setUser(null); setActiveTab(“dashboard”); }} style={{ width: 36, height: 36, borderRadius: 10, background: COLORS.pinkLight, display: “flex”, alignItems: “center”, justifyContent: “center”, fontSize: 18, cursor: “pointer” }}>
👤
</div>
</div>

```
  <div style={{ padding: "20px 20px 100px" }}>
    {activeTab === "dashboard" && <DashboardScreen user={user} avisos={avisos} planos={planos} eventos={eventos} turmas={turmas} />}
    {activeTab === "mural" && <MuralScreen avisos={avisos} user={user} />}
    {activeTab === "chat" && <ChatScreen turmas={turmas} />}
    {activeTab === "planos" && <PlanosScreen planos={planos} />}
    {activeTab === "calendario" && <CalendarioScreen eventos={eventos} />}
    {activeTab === "checklist" && <ChecklistScreen />}
    {activeTab === "galeria" && <GaleriaScreen />}
  </div>

  <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: COLORS.white, borderTop: `1px solid ${COLORS.border}`, display: "flex", justifyContent: "space-around", padding: "6px 4px env(safe-area-inset-bottom, 20px)", zIndex: 50, boxShadow: "0 -4px 20px rgba(0,0,0,0.05)" }}>
    {TABS.map(tab => (
      <button key={tab.id} onClick={() => setActiveTab(tab.id)}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: "none", border: "none", padding: "4px 6px", cursor: "pointer", opacity: activeTab === tab.id ? 1 : 0.5 }}>
        <span style={{ fontSize: 20, display: "block", transform: activeTab === tab.id ? "scale(1.15)" : "scale(1)", transition: "transform 0.2s" }}>{tab.icon}</span>
        <span style={{ fontSize: 10, fontWeight: activeTab === tab.id ? 700 : 500, color: activeTab === tab.id ? COLORS.blue : COLORS.textMuted }}>{tab.label}</span>
        {activeTab === tab.id && <div style={{ width: 4, height: 4, borderRadius: "50%", background: COLORS.pink, marginTop: 1 }} />}
      </button>
    ))}
  </div>
</div>
```

);
}
