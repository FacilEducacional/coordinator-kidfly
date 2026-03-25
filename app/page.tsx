"use client";
import { useState } from "react";

const COLORS = {
  blue: "#2C5AA0",
  blueDark: "#1E3F73",
  blueLight: "#E8EFF8",
  pink: "#FE4F6B",
  pinkLight: "#FFF0F2",
  yellow: "#FFB800",
  yellowLight: "#FFF8E6",
  green: "#2ECC71",
  greenLight: "#EAFAF1",
  white: "#FFFFFF",
  bg: "#F5F7FB",
  text: "#1A2332",
  textMuted: "#6B7A90",
  border: "#E2E8F0",
};

const MOCK_AVISOS = [
  { id: 1, title: "Reunião pedagógica sexta-feira", date: "24/03", author: "Coord. Maria", urgent: true, vistos: 2, total: 3 },
  { id: 2, title: "Entrega dos relatórios do 1º bimestre", date: "22/03", author: "Coord. Maria", urgent: false, vistos: 3, total: 3 },
  { id: 3, title: "Novo material disponível na KidFly", date: "20/03", author: "Coord. Maria", urgent: false, vistos: 1, total: 3 },
];

const MOCK_PLANOS = [
  { id: 1, prof: "Ana Paula", turma: "Berçário II", status: "pendente", date: "24/03" },
  { id: 2, prof: "Juliana", turma: "Maternal I", status: "aprovado", date: "23/03" },
  { id: 3, prof: "Carla", turma: "Jardim I", status: "revisar", date: "22/03" },
];

const MOCK_EVENTOS = [
  { id: 1, title: "Reunião pedagógica", date: "28/03", color: COLORS.blue },
  { id: 2, title: "Dia do Circo", date: "27/03", color: COLORS.pink },
  { id: 3, title: "Entrega de relatórios", date: "31/03", color: COLORS.yellow },
  { id: 4, title: "Formação continuada", date: "02/04", color: COLORS.green },
];

const MOCK_TURMAS = [
  { id: 1, name: "Berçário II", prof: "Ana Paula", alunos: 12, lastMsg: "Bom dia! Atividade de hoje..." },
  { id: 2, name: "Maternal I", prof: "Juliana", alunos: 18, lastMsg: "Fotos da atividade enviadas" },
  { id: 3, name: "Jardim I", prof: "Carla", alunos: 22, lastMsg: "Plano de aula atualizado" },
];

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; color: string; label: string }> = {
    pendente: { bg: COLORS.yellowLight, color: "#B8860B", label: "Pendente" },
    aprovado: { bg: COLORS.greenLight, color: "#1B8A4A", label: "Aprovado" },
    revisar: { bg: COLORS.pinkLight, color: COLORS.pink, label: "Revisar" },
  };
  const c = config[status];
  return (
    <span style={{ background: c.bg, color: c.color, padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
      {c.label}
    </span>
  );
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(145deg, ${COLORS.blue} 0%, ${COLORS.blueDark} 100%)`,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
    }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{
          width: 72,
          height: 72,
          borderRadius: 20,
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(10px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 16px",
          border: "1px solid rgba(255,255,255,0.2)",
        }}>
          <span style={{ fontSize: 36 }}>📋</span>
        </div>
        <h1 style={{ color: COLORS.white, fontSize: 28, fontWeight: 700, margin: "0 0 4px" }}>
          Coordinator
        </h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, margin: 0, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 500 }}>
          by KidFly
        </p>
      </div>

      <div style={{
        background: COLORS.white,
        borderRadius: 24,
        padding: "32px 24px",
        width: "100%",
        maxWidth: 380,
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
      }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: "0 0 4px" }}>
          Bem-vinda! 👋
        </h2>
        <p style={{ fontSize: 14, color: COLORS.textMuted, margin: "0 0 24px" }}>
          Entre com seu acesso KidFly
        </p>

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 6 }}>
            E-mail
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="seu@email.com"
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: 12,
              border: `2px solid ${COLORS.border}`,
              fontSize: 15,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 6 }}>
            Senha
          </label>
          <input
            type="password"
            value={pass}
            onChange={e => setPass(e.target.value)}
            placeholder="••••••••"
            style={{
              width: "100%",
              padding: "12px 16px",
              borderRadius: 12,
              border: `2px solid ${COLORS.border}`,
              fontSize: 15,
              outline: "none",
              boxSizing: "border-box",
            }}
          />
        </div>

        <button
          onClick={onLogin}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: 14,
            border: "none",
            background: `linear-gradient(135deg, ${COLORS.pink} 0%, #E8405A 100%)`,
            color: COLORS.white,
            fontSize: 16,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: `0 4px 15px ${COLORS.pink}44`,
          }}
        >
          Entrar
        </button>

        <p style={{ textAlign: "center", fontSize: 13, color: COLORS.textMuted, marginTop: 16, marginBottom: 0 }}>
          Acesso exclusivo para assinantes<br />KidFly Equipe e Escola
        </p>
      </div>

      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 32 }}>
        © 2026 KidFly · Todos os direitos reservados
      </p>
    </div>
  );
}

function DashboardScreen() {
  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, margin: "0 0 4px" }}>
          Bom dia, Maria! ☀️
        </h2>
        <p style={{ fontSize: 14, color: COLORS.textMuted, margin: 0 }}>
          Escola Pequenos Brilhantes
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Planos pendentes", value: "1", icon: "📝", color: COLORS.yellow, bg: COLORS.yellowLight },
          { label: "Avisos ativos", value: "3", icon: "📢", color: COLORS.pink, bg: COLORS.pinkLight },
          { label: "Eventos da semana", value: "2", icon: "📅", color: COLORS.blue, bg: COLORS.blueLight },
          { label: "Professoras", value: "3", icon: "👩‍🏫", color: COLORS.green, bg: COLORS.greenLight },
        ].map((stat, i) => (
          <div key={i} style={{
            background: COLORS.white,
            borderRadius: 16,
            padding: 16,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            border: `1px solid ${COLORS.border}`,
          }}>
            <div style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: stat.bg,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 20,
              marginBottom: 10,
            }}>
              {stat.icon}
            </div>
            <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.text }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      <div style={{
        background: COLORS.white,
        borderRadius: 16,
        padding: 16,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        border: `1px solid ${COLORS.border}`,
        marginBottom: 16,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, margin: 0 }}>Planos recentes</h3>
          <span style={{ fontSize: 13, color: COLORS.blue, fontWeight: 600 }}>Ver todos →</span>
        </div>
        {MOCK_PLANOS.map(p => (
          <div key={p.id} style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 0",
            borderTop: `1px solid ${COLORS.border}`,
          }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>Prof. {p.prof}</div>
              <div style={{ fontSize: 12, color: COLORS.textMuted }}>{p.turma} · {p.date}</div>
            </div>
            <StatusBadge status={p.status} />
          </div>
        ))}
      </div>

      <div style={{
        background: COLORS.white,
        borderRadius: 16,
        padding: 16,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        border: `1px solid ${COLORS.border}`,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, margin: 0 }}>Próximos eventos</h3>
          <span style={{ fontSize: 13, color: COLORS.blue, fontWeight: 600 }}>Ver todos →</span>
        </div>
        {MOCK_EVENTOS.slice(0, 3).map(ev => (
          <div key={ev.id} style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            padding: "10px 0",
            borderTop: `1px solid ${COLORS.border}`,
          }}>
            <div style={{
              width: 4,
              height: 36,
              borderRadius: 4,
              background: ev.color,
              flexShrink: 0,
            }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{ev.title}</div>
              <div style={{ fontSize: 12, color: COLORS.textMuted }}>{ev.date}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MuralScreen() {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: 0 }}>Mural de Avisos</h2>
        <button style={{
          background: COLORS.pink,
          color: COLORS.white,
          border: "none",
          borderRadius: 12,
          padding: "8px 16px",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
        }}>
          + Novo
        </button>
      </div>
      {MOCK_AVISOS.map(aviso => (
        <div key={aviso.id} style={{
          background: COLORS.white,
          borderRadius: 16,
          padding: 16,
          marginBottom: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          border: `1px solid ${aviso.urgent ? COLORS.pink + "33" : COLORS.border}`,
          borderLeft: aviso.urgent ? `4px solid ${COLORS.pink}` : `4px solid ${COLORS.border}`,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, margin: 0, flex: 1 }}>
              {aviso.urgent && <span style={{ color: COLORS.pink, marginRight: 6 }}>●</span>}
              {aviso.title}
            </h3>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 12, color: COLORS.textMuted }}>{aviso.author} · {aviso.date}</span>
            <span style={{
              fontSize: 12,
              color: aviso.vistos === aviso.total ? COLORS.green : COLORS.yellow,
              fontWeight: 600,
              background: aviso.vistos === aviso.total ? COLORS.greenLight : COLORS.yellowLight,
              padding: "3px 8px",
              borderRadius: 8,
            }}>
              👁 {aviso.vistos}/{aviso.total}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ChatScreen() {
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: "0 0 20px" }}>Chat por Turma</h2>
      {MOCK_TURMAS.map(turma => (
        <div key={turma.id} style={{
          background: COLORS.white,
          borderRadius: 16,
          padding: 16,
          marginBottom: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          border: `1px solid ${COLORS.border}`,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 48,
              height: 48,
              borderRadius: 14,
              background: COLORS.blueLight,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 22,
              flexShrink: 0,
            }}>
              {turma.name.includes("Berçário") ? "🍼" : turma.name.includes("Maternal") ? "🧸" : "🎨"}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, margin: 0 }}>{turma.name}</h3>
                <span style={{ fontSize: 11, color: COLORS.textMuted }}>10:30</span>
              </div>
              <div style={{ fontSize: 13, color: COLORS.textMuted, margin: "2px 0" }}>Prof. {turma.prof} · {turma.alunos} alunos</div>
              <div style={{
                fontSize: 13,
                color: COLORS.textMuted,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>
                {turma.lastMsg}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function PlanosScreen() {
  const [filter, setFilter] = useState("todos");
  const filtered = filter === "todos" ? MOCK_PLANOS : MOCK_PLANOS.filter(p => p.status === filter);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: 0 }}>Planos de Aula</h2>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto" }}>
        {[
          { key: "todos", label: "Todos" },
          { key: "pendente", label: "Pendentes" },
          { key: "aprovado", label: "Aprovados" },
          { key: "revisar", label: "Revisar" },
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            style={{
              padding: "8px 16px",
              borderRadius: 20,
              border: "none",
              background: filter === f.key ? COLORS.blue : COLORS.blueLight,
              color: filter === f.key ? COLORS.white : COLORS.blue,
              fontSize: 13,
              fontWeight: 600,
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>
      {filtered.map(p => (
        <div key={p.id} style={{
          background: COLORS.white,
          borderRadius: 16,
          padding: 16,
          marginBottom: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          border: `1px solid ${COLORS.border}`,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, margin: "0 0 2px" }}>Prof. {p.prof}</h3>
              <span style={{ fontSize: 13, color: COLORS.textMuted }}>{p.turma}</span>
            </div>
            <StatusBadge status={p.status} />
          </div>
          <div style={{ fontSize: 12, color: COLORS.textMuted }}>Enviado em {p.date}</div>
          {p.status === "pendente" && (
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <button style={{
                flex: 1,
                padding: "8px",
                borderRadius: 10,
                border: "none",
                background: COLORS.green,
                color: COLORS.white,
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}>
                ✓ Aprovar
              </button>
              <button style={{
                flex: 1,
                padding: "8px",
                borderRadius: 10,
                border: `2px solid ${COLORS.yellow}`,
                background: "transparent",
                color: "#B8860B",
                fontSize: 13,
                fontWeight: 600,
                cursor: "pointer",
              }}>
                ↻ Pedir ajuste
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function CalendarioScreen() {
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: "0 0 20px" }}>Calendário Pedagógico</h2>
      <div style={{
        background: COLORS.white,
        borderRadius: 16,
        padding: 16,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        border: `1px solid ${COLORS.border}`,
        marginBottom: 20,
      }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, margin: "0 0 4px" }}>Março 2026</h3>
        <p style={{ fontSize: 13, color: COLORS.textMuted, margin: "0 0 16px" }}>Semana 24-30</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, textAlign: "center" }}>
          {["D", "S", "T", "Q", "Q", "S", "S"].map((d, i) => (
            <div key={i} style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600, padding: 4 }}>{d}</div>
          ))}
          {Array.from({ length: 31 }, (_, i) => {
            const day = i + 1;
            const hasEvent = [27, 28, 31].includes(day);
            const isToday = day === 24;
            return (
              <div key={day} style={{
                padding: "6px 2px",
                borderRadius: 8,
                fontSize: 13,
                fontWeight: isToday ? 700 : 400,
                background: isToday ? COLORS.blue : hasEvent ? COLORS.pinkLight : "transparent",
                color: isToday ? COLORS.white : hasEvent ? COLORS.pink : COLORS.text,
              }}>
                {day}
              </div>
            );
          })}
        </div>
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, margin: "0 0 12px" }}>Próximos eventos</h3>
      {MOCK_EVENTOS.map(ev => (
        <div key={ev.id} style={{
          background: COLORS.white,
          borderRadius: 14,
          padding: 14,
          marginBottom: 10,
          display: "flex",
          alignItems: "center",
          gap: 12,
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          border: `1px solid ${COLORS.border}`,
        }}>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: ev.color + "18",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}>
            <div style={{ width: 10, height: 10, borderRadius: "50%", background: ev.color }} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{ev.title}</div>
            <div style={{ fontSize: 12, color: COLORS.textMuted }}>{ev.date}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function ChecklistScreen() {
  const [items, setItems] = useState([
    { id: 1, text: "Rotina da manhã organizada", checked: true },
    { id: 2, text: "Materiais acessíveis às crianças", checked: true },
    { id: 3, text: "Interação professora-criança positiva", checked: false },
    { id: 4, text: "Espaço limpo e seguro", checked: true },
    { id: 5, text: "Atividade alinhada ao planejamento", checked: false },
    { id: 6, text: "Registro fotográfico realizado", checked: false },
  ]);

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: "0 0 20px" }}>Checklist de Observação</h2>

      <div style={{
        background: COLORS.white,
        borderRadius: 16,
        padding: 16,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        border: `1px solid ${COLORS.border}`,
        marginBottom: 16,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, margin: "0 0 2px" }}>Visita - Berçário II</h3>
            <span style={{ fontSize: 12, color: COLORS.textMuted }}>Prof. Ana Paula · 24/03/2026</span>
          </div>
          <div style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: COLORS.blueLight,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 14,
            fontWeight: 700,
            color: COLORS.blue,
          }}>
            {items.filter(i => i.checked).length}/{items.length}
          </div>
        </div>

        {items.map(item => (
          <div
            key={item.id}
            onClick={() => setItems(items.map(i => i.id === item.id ? { ...i, checked: !i.checked } : i))}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "12px 0",
              borderTop: `1px solid ${COLORS.border}`,
              cursor: "pointer",
            }}
          >
            <div style={{
              width: 24,
              height: 24,
              borderRadius: 8,
              border: `2px solid ${item.checked ? COLORS.green : COLORS.border}`,
              background: item.checked ? COLORS.green : "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}>
              {item.checked && <span style={{ color: COLORS.white, fontSize: 14, fontWeight: 700 }}>✓</span>}
            </div>
            <span style={{
              fontSize: 14,
              color: item.checked ? COLORS.textMuted : COLORS.text,
              textDecoration: item.checked ? "line-through" : "none",
            }}>
              {item.text}
            </span>
          </div>
        ))}
      </div>

      <div style={{
        background: COLORS.white,
        borderRadius: 16,
        padding: 16,
        boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
        border: `1px solid ${COLORS.border}`,
      }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 8 }}>
          Comentário da visita
        </label>
        <textarea
          placeholder="Observações gerais sobre a visita..."
          style={{
            width: "100%",
            minHeight: 80,
            padding: 12,
            borderRadius: 12,
            border: `2px solid ${COLORS.border}`,
            fontSize: 14,
            resize: "vertical",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
        <button style={{
          width: "100%",
          marginTop: 12,
          padding: 12,
          borderRadius: 12,
          border: "none",
          background: COLORS.blue,
          color: COLORS.white,
          fontSize: 14,
          fontWeight: 600,
          cursor: "pointer",
        }}>
          📷 Adicionar foto + Salvar
        </button>
      </div>
    </div>
  );
}

function GaleriaScreen() {
  const fotos = [
    { id: 1, turma: "Berçário II", desc: "Atividade sensorial", color: "#FFB8C6" },
    { id: 2, turma: "Berçário II", desc: "Hora da música", color: "#B8D4FF" },
    { id: 3, turma: "Maternal I", desc: "Pintura com guache", color: "#FFE0B8" },
    { id: 4, turma: "Maternal I", desc: "Parquinho", color: "#B8FFCF" },
    { id: 5, turma: "Jardim I", desc: "Contação de história", color: "#E0B8FF" },
    { id: 6, turma: "Jardim I", desc: "Atividade coletiva", color: "#FFB8B8" },
  ];

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: 0 }}>Galeria de Fotos</h2>
        <button style={{
          background: COLORS.pink,
          color: COLORS.white,
          border: "none",
          borderRadius: 12,
          padding: "8px 16px",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
        }}>
          📷 Upload
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto" }}>
        {["Todas", "Berçário II", "Maternal I", "Jardim I"].map((t, i) => (
          <button key={t} style={{
            padding: "8px 16px",
            borderRadius: 20,
            border: "none",
            background: i === 0 ? COLORS.blue : COLORS.blueLight,
            color: i === 0 ? COLORS.white : COLORS.blue,
            fontSize: 13,
            fontWeight: 600,
            cursor: "pointer",
            whiteSpace: "nowrap",
          }}>
            {t}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {fotos.map(foto => (
          <div key={foto.id} style={{
            borderRadius: 14,
            overflow: "hidden",
            background: COLORS.white,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            border: `1px solid ${COLORS.border}`,
          }}>
            <div style={{
              height: 120,
              background: foto.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
            }}>
              📸
            </div>
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
  { id: "dashboard", icon: "🏠", label: "Início" },
  { id: "mural", icon: "📢", label: "Mural" },
  { id: "chat", icon: "💬", label: "Chat" },
  { id: "planos", icon: "📝", label: "Planos" },
  { id: "calendario", icon: "📅", label: "Agenda" },
  { id: "checklist", icon: "✅", label: "Visitas" },
  { id: "galeria", icon: "📷", label: "Fotos" },
];

export default function Home() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  if (!loggedIn) {
    return <LoginScreen onLogin={() => setLoggedIn(true)} />;
  }

  return (
    <div style={{
      background: COLORS.bg,
      minHeight: "100vh",
      maxWidth: 480,
      margin: "0 auto",
      position: "relative",
    }}>
      <div style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: COLORS.white,
        borderBottom: `1px solid ${COLORS.border}`,
        padding: "12px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: `linear-gradient(135deg, ${COLORS.blue}, ${COLORS.blueDark})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}>
            <span style={{ color: COLORS.white, fontSize: 16 }}>📋</span>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text }}>Coordinator</div>
            <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, textTransform: "uppercase" }}>by KidFly</div>
          </div>
        </div>
        <div style={{
          width: 36,
          height: 36,
          borderRadius: 10,
          background: COLORS.pinkLight,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
        }}>
          👤
        </div>
      </div>

      <div style={{ padding: "20px 20px 100px" }}>
        {activeTab === "dashboard" && <DashboardScreen />}
        {activeTab === "mural" && <MuralScreen />}
        {activeTab === "chat" && <ChatScreen />}
        {activeTab === "planos" && <PlanosScreen />}
        {activeTab === "calendario" && <CalendarioScreen />}
        {activeTab === "checklist" && <ChecklistScreen />}
        {activeTab === "galeria" && <GaleriaScreen />}
      </div>

      <div style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: 480,
        background: COLORS.white,
        borderTop: `1px solid ${COLORS.border}`,
        display: "flex",
        justifyContent: "space-around",
        padding: "6px 4px env(safe-area-inset-bottom, 20px)",
        zIndex: 50,
        boxShadow: "0 -4px 20px rgba(0,0,0,0.05)",
      }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              background: "none",
              border: "none",
              padding: "4px 6px",
              cursor: "pointer",
              opacity: activeTab === tab.id ? 1 : 0.5,
            }}
          >
            <span style={{
              fontSize: 20,
              display: "block",
              transform: activeTab === tab.id ? "scale(1.15)" : "scale(1)",
              transition: "transform 0.2s",
            }}>
              {tab.icon}
            </span>
            <span style={{
              fontSize: 10,
              fontWeight: activeTab === tab.id ? 700 : 500,
              color: activeTab === tab.id ? COLORS.blue : COLORS.textMuted,
            }}>
              {tab.label}
            </span>
            {activeTab === tab.id && (
              <div style={{
                width: 4,
                height: 4,
                borderRadius: "50%",
                background: COLORS.pink,
                marginTop: 1,
              }} />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
