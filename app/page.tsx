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
            <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2​​​​​​​​​​​​​​​​
