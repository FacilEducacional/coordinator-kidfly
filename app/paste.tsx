"use client";
import { useState } from "react";
import { supabase } from "./supabase";

var COLORS = {
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

function StatusBadge({ status }: { status: string }) {
  var config: Record<string, { bg: string; color: string; label: string }> = {
    pendente: { bg: COLORS.yellowLight, color: "#B8860B", label: "Pendente" },
    aprovado: { bg: COLORS.greenLight, color: "#1B8A4A", label: "Aprovado" },
    revisar: { bg: COLORS.pinkLight, color: COLORS.pink, label: "Revisar" },
  };
  var c = config[status] || config["pendente"];
  return (
    <span style={{ background: c.bg, color: c.color, padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
      {c.label}
    </span>
  );
}

function SuccessMessage({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 200,
      background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div style={{
        background: COLORS.white, borderRadius: 20, padding: "32px 24px", textAlign: "center",
        maxWidth: 320, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
      }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>&#9989;</div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, margin: "0 0 8px" }}>{message}</h3>
        <p style={{ fontSize: 13, color: COLORS.textMuted, margin: "0 0 20px" }}>O aviso ja esta visivel para os destinatarios.</p>
        <button onClick={onClose} style={{
          width: "100%", padding: 12, borderRadius: 12, border: "none",
          background: COLORS.blue, color: COLORS.white, fontSize: 14, fontWeight: 600, cursor: "pointer",
        }}>Ok, entendi</button>
      </div>
    </div>
  );
}

function LoginScreen({ onLogin }: { onLogin: (user: any) => void }) {
  var _s = useState(""); var email = _s[0]; var setEmail = _s[1];
  var _s2 = useState(""); var pass = _s2[0]; var setPass = _s2[1];
  var _s3 = useState(""); var erro = _s3[0]; var setErro = _s3[1];
  var _s4 = useState(false); var loading = _s4[0]; var setLoading = _s4[1];

  async function handleLogin() {
    setErro("");
    setLoading(true);
    var res = await supabase.from("usuarios").select("*, escolas(nome)").eq("email", email).eq("senha_hash", pass).single();
    setLoading(false);
    if (res.error || !res.data) { setErro("E-mail ou senha incorretos"); return; }
    onLogin(res.data);
  }

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(145deg, " + COLORS.blue + " 0%, " + COLORS.blueDark + " 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24,
    }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ width: 72, height: 72, borderRadius: 20, background: "rgba(255,255,255,0.15)", backdropFilter: "blur(10px)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", border: "1px solid rgba(255,255,255,0.2)" }}>
          <span style={{ fontSize: 36 }}>&#128203;</span>
        </div>
        <h1 style={{ color: COLORS.white, fontSize: 28, fontWeight: 700, margin: "0 0 4px" }}>Coordinator</h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, margin: 0, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 500 }}>by KidFly</p>
      </div>
      <div style={{ background: COLORS.white, borderRadius: 24, padding: "32px 24px", width: "100%", maxWidth: 380, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: "0 0 4px" }}>Bem-vinda! &#128075;</h2>
        <p style={{ fontSize: 14, color: COLORS.textMuted, margin: "0 0 24px" }}>Entre com seu acesso KidFly</p>
        {erro && <div style={{ background: COLORS.pinkLight, color: COLORS.pink, padding: "10px 14px", borderRadius: 12, fontSize: 13, fontWeight: 600, marginBottom: 16 }}>{erro}</div>}
        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 6 }}>E-mail</label>
          <input type="email" value={email} onChange={function(e) { setEmail(e.target.value); }} placeholder="seu@email.com" style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "2px solid " + COLORS.border, fontSize: 15, outline: "none", boxSizing: "border-box" }} />
        </div>
        <div style={{ marginBottom: 24 }}>
          <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 6 }}>Senha</label>
          <input type="password" value={pass} onChange={function(e) { setPass(e.target.value); }} placeholder="********" style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "2px solid " + COLORS.border, fontSize: 15, outline: "none", boxSizing: "border-box" }} />
        </div>
        <button onClick={handleLogin} disabled={loading} style={{ width: "100%", padding: "14px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, " + COLORS.pink + " 0%, #E8405A 100%)", color: COLORS.white, fontSize: 16, fontWeight: 700, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
        <p style={{ textAlign: "center", fontSize: 13, color: COLORS.textMuted, marginTop: 16, marginBottom: 0 }}>Acesso exclusivo para assinantes KidFly Equipe e Escola</p>
        <p style={{ textAlign: "center", fontSize: 11, color: COLORS.textMuted, marginTop: 12, marginBottom: 0, background: COLORS.blueLight, padding: "8px", borderRadius: 8 }}>Demo: maria@escola.com / 123456</p>
      </div>
      <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 12, marginTop: 32 }}>&#169; 2026 KidFly</p>
    </div>
  );
}

function DashboardScreen({ user, avisos, planos, eventos, turmas }: any) {
  var nomeFirst = user.nome.split(" ")[0];
  var escolaNome = user.escolas?.nome || "Minha Escola";
  var pendentes = planos.filter(function(p: any) { return p.status === "pendente"; }).length;
  var allEventos = [
    ...eventos,
    ...avisos.filter(function(a: any) { return a.data_evento; }).map(function(a: any) {
      return { id: "aviso-" + a.id, titulo: a.titulo, data: a.data_evento, cor: a.urgente ? COLORS.pink : COLORS.blue };
    }),
  ].sort(function(a: any, b: any) { return a.data > b.data ? 1 : -1; });

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, margin: "0 0 4px" }}>Bom dia, {nomeFirst}! &#9728;&#65039;</h2>
        <p style={{ fontSize: 14, color: COLORS.textMuted, margin: 0 }}>{escolaNome}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        {[
          { label: "Planos pendentes", value: String(pendentes), icon: "&#128221;", bg: COLORS.yellowLight },
          { label: "Avisos ativos", value: String(avisos.length), icon: "&#128226;", bg: COLORS.pinkLight },
          { label: "Eventos", value: String(allEventos.length), icon: "&#128197;", bg: COLORS.blueLight },
          { label: "Professoras", value: String(turmas.length), icon: "&#128105;&#8205;&#127979;", bg: COLORS.greenLight },
        ].map(function(stat, i) {
          return (
            <div key={i} style={{ background: COLORS.white, borderRadius: 16, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", border: "1px solid " + COLORS.border }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 10 }} dangerouslySetInnerHTML={{ __html: stat.icon }} />
              <div style={{ fontSize: 24, fontWeight: 700, color: COLORS.text }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>{stat.label}</div>
            </div>
          );
        })}
      </div>
      <div style={{ background: COLORS.white, borderRadius: 16, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", border: "1px solid " + COLORS.border, marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, margin: "0 0 12px" }}>Planos recentes</h3>
        {planos.length === 0 && <p style={{ fontSize: 13, color: COLORS.textMuted }}>Nenhum plano ainda</p>}
        {planos.slice(0, 3).map(function(p: any) {
          return (
            <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderTop: "1px solid " + COLORS.border }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{p.titulo}</div>
                <div style={{ fontSize: 12, color: COLORS.textMuted }}>{p.turmas?.nome}</div>
              </div>
              <StatusBadge status={p.status} />
            </div>
          );
        })}
      </div>
      <div style={{ background: COLORS.white, borderRadius: 16, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", border: "1px solid " + COLORS.border }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, margin: "0 0 12px" }}>Agenda</h3>
        {allEventos.length === 0 && <p style={{ fontSize: 13, color: COLORS.textMuted }}>Nenhum evento</p>}
        {allEventos.slice(0, 4).map(function(ev: any) {
          return (
            <div key={ev.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderTop: "1px solid " + COLORS.border }}>
              <div style={{ width: 4, height: 36, borderRadius: 4, background: ev.cor, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{ev.titulo}</div>
                <div style={{ fontSize: 12, color: COLORS.textMuted }}>{new Date(ev.data + "T12:00:00").toLocaleDateString("pt-BR")}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function MuralScreen({ avisos, user, usuarios, onAvisoCreated }: any) {
  var _s = useState(avisos); var lista = _s[0]; var setLista = _s[1];
  var _s2 = useState(false); var mostrarForm = _s2[0]; var setMostrarForm = _s2[1];
  var _s3 = useState(""); var titulo = _s3[0]; var setTitulo = _s3[1];
  var _s4 = useState(false); var urgente = _s4[0]; var setUrgente = _s4[1];
  var _s5 = useState(""); var dataEvento = _s5[0]; var setDataEvento = _s5[1];
  var _s6 = useState("todos"); var atribuicao = _s6[0]; var setAtribuicao = _s6[1];
  var _s7 = useState<string[]>([]); var selectedUsers = _s7[0]; var setSelectedUsers = _s7[1];
  var _s8 = useState(""); var successMsg = _s8[0]; var setSuccessMsg = _s8[1];
  var _s9 = useState<any>(null); var editingAviso = _s9[0]; var setEditingAviso = _s9[1];
  var _s10 = useState(""); var editTitulo = _s10[0]; var setEditTitulo = _s10[1];
  var _s11 = useState(""); var editData = _s11[0]; var setEditData = _s11[1];
  var _s12 = useState(false); var editUrgente = _s12[0]; var setEditUrgente = _s12[1];

  async function criarAviso() {
    if (!titulo.trim()) return;
    var insertData: any = { escola_id: user.escola_id, autor_id: user.id, titulo: titulo, urgente: urgente };
    if (dataEvento) insertData.data_evento = dataEvento;
    var res = await supabase.from("avisos").insert(insertData).select().single();
    if (res.data) {
      var avisoId = res.data.id;
      if (atribuicao === "todos") {
        await supabase.from("aviso_destinatarios").insert({ aviso_id: avisoId, todos: true });
      } else {
        var destinatarios = selectedUsers.map(function(uid) { return { aviso_id: avisoId, usuario_id: uid, todos: false }; });
        if (destinatarios.length > 0) await supabase.from("aviso_destinatarios").insert(destinatarios);
      }
      setLista([res.data, ...lista]);
      setTitulo(""); setDataEvento(""); setUrgente(false); setAtribuicao("todos"); setSelectedUsers([]);
      setMostrarForm(false);
      setSuccessMsg("Aviso publicado com sucesso!");
      if (onAvisoCreated) onAvisoCreated(res.data);
    }
  }

  function startEdit(aviso: any) {
    setEditingAviso(aviso);
    setEditTitulo(aviso.titulo);
    setEditData(aviso.data_evento || "");
    setEditUrgente(aviso.urgente);
  }

  async function salvarEdicao() {
    if (!editingAviso || !editTitulo.trim()) return;
    var updateData: any = { titulo: editTitulo, urgente: editUrgente };
    if (editData) { updateData.data_evento = editData; } else { updateData.data_evento = null; }
    await supabase.from("avisos").update(updateData).eq("id", editingAviso.id);
    setLista(lista.map(function(a: any) {
      if (a.id === editingAviso.id) return Object.assign({}, a, updateData);
      return a;
    }));
    setEditingAviso(null);
    setSuccessMsg("Aviso atualizado com sucesso!");
  }

  function toggleUser(uid: string) {
    if (selectedUsers.includes(uid)) { setSelectedUsers(selectedUsers.filter(function(id) { return id !== uid; })); }
    else { setSelectedUsers([...selectedUsers, uid]); }
  }

  var outrosUsuarios = usuarios.filter(function(u: any) { return u.id !== user.id; });

  return (
    <div>
      {successMsg && <SuccessMessage message={successMsg} onClose={function() { setSuccessMsg(""); }} />}

      {editingAviso && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 200, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
          <div style={{ background: COLORS.white, borderRadius: 20, padding: 20, maxWidth: 380, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, margin: "0 0 16px" }}>Editar aviso</h3>
            <input value={editTitulo} onChange={function(e) { setEditTitulo(e.target.value); }} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "2px solid " + COLORS.border, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 10 }} />
            <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 6 }}>Data do evento</label>
            <input type="date" value={editData} onChange={function(e) { setEditData(e.target.value); }} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "2px solid " + COLORS.border, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 12 }} />
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <div onClick={function() { setEditUrgente(!editUrgente); }} style={{ width: 22, height: 22, borderRadius: 6, border: "2px solid " + (editUrgente ? COLORS.pink : COLORS.border), background: editUrgente ? COLORS.pink : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                {editUrgente && <span style={{ color: COLORS.white, fontSize: 12, fontWeight: 700 }}>&#10003;</span>}
              </div>
              <span style={{ fontSize: 13, color: COLORS.text }}>Urgente</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={function() { setEditingAviso(null); }} style={{ flex: 1, padding: 10, borderRadius: 10, border: "2px solid " + COLORS.border, background: "transparent", color: COLORS.text, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Cancelar</button>
              <button onClick={salvarEdicao} style={{ flex: 1, padding: 10, borderRadius: 10, border: "none", background: COLORS.blue, color: COLORS.white, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Salvar</button>
            </div>
          </div>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: 0 }}>Mural de Avisos</h2>
        <button onClick={function() { setMostrarForm(!mostrarForm); }} style={{ background: COLORS.pink, color: COLORS.white, border: "none", borderRadius: 12, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
          {mostrarForm ? "X Fechar" : "+ Novo"}
        </button>
      </div>

      {mostrarForm && (
        <div style={{ background: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 16, border: "1px solid " + COLORS.border }}>
          <input value={titulo} onChange={function(e) { setTitulo(e.target.value); }} placeholder="Titulo do aviso ou evento..." style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "2px solid " + COLORS.border, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 10 }} />
          <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 6 }}>Data do evento (opcional)</label>
          <input type="date" value={dataEvento} onChange={function(e) { setDataEvento(e.target.value); }} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "2px solid " + COLORS.border, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 12 }} />
          <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 8 }}>Atribuir a:</label>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <button onClick={function() { setAtribuicao("todos"); setSelectedUsers([]); }} style={{ flex: 1, padding: "8px", borderRadius: 10, border: "none", background: atribuicao === "todos" ? COLORS.blue : COLORS.blueLight, color: atribuicao === "todos" ? COLORS.white : COLORS.blue, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Todos</button>
            <button onClick={function() { setAtribuicao("selecionar"); }} style={{ flex: 1, padding: "8px", borderRadius: 10, border: "none", background: atribuicao === "selecionar" ? COLORS.blue : COLORS.blueLight, color: atribuicao === "selecionar" ? COLORS.white : COLORS.blue, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Selecionar</button>
          </div>
          {atribuicao === "selecionar" && (
            <div style={{ marginBottom: 12, maxHeight: 150, overflowY: "auto", border: "1px solid " + COLORS.border, borderRadius: 10, padding: 8 }}>
              {outrosUsuarios.map(function(u: any) {
                var selected = selectedUsers.includes(u.id);
                return (
                  <div key={u.id} onClick={function() { toggleUser(u.id); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 4px", cursor: "pointer", borderBottom: "1px solid " + COLORS.border }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, border: "2px solid " + (selected ? COLORS.green : COLORS.border), background: selected ? COLORS.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {selected && <span style={{ color: COLORS.white, fontSize: 12, fontWeight: 700 }}>&#10003;</span>}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{u.nome}</div>
                      <div style={{ fontSize: 11, color: COLORS.textMuted }}>{u.papel}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <div onClick={function() { setUrgente(!urgente); }} style={{ width: 22, height: 22, borderRadius: 6, border: "2px solid " + (urgente ? COLORS.pink : COLORS.border), background: urgente ? COLORS.pink : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              {urgente && <span style={{ color: COLORS.white, fontSize: 12, fontWeight: 700 }}>&#10003;</span>}
            </div>
            <span style={{ fontSize: 13, color: COLORS.text }}>Urgente</span>
          </div>
          <button onClick={criarAviso} style={{ width: "100%", padding: 10, borderRadius: 10, border: "none", background: COLORS.blue, color: COLORS.white, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Publicar aviso</button>
        </div>
      )}

      {lista.length === 0 && <p style={{ fontSize: 13, color: COLORS.textMuted, textAlign: "center", marginTop: 40 }}>Nenhum aviso ainda</p>}
      {lista.map(function(aviso: any) {
        return (
          <div key={aviso.id} style={{
            background: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12,
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            border: "1px solid " + (aviso.urgente ? COLORS.pink + "33" : COLORS.border),
            borderLeft: aviso.urgente ? "4px solid " + COLORS.pink : "4px solid " + COLORS.border,
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <h3 style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, margin: "0 0 6px", flex: 1 }}>
                {aviso.urgente && <span style={{ color: COLORS.pink, marginRight: 6 }}>&#9679;</span>}
                {aviso.titulo}
              </h3>
              <button onClick={function() { startEdit(aviso); }} style={{ background: COLORS.blueLight, border: "none", borderRadius: 8, padding: "4px 10px", fontSize: 11, fontWeight: 600, color: COLORS.blue, cursor: "pointer", flexShrink: 0, marginLeft: 8 }}>Editar</button>
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <span style={{ fontSize: 12, color: COLORS.textMuted }}>{new Date(aviso.created_at).toLocaleDateString("pt-BR")}</span>
              {aviso.data_evento && (
                <span style={{ fontSize: 11, background: COLORS.blueLight, color: COLORS.blue, padding: "2px 8px", borderRadius: 6, fontWeight: 600 }}>
                  &#128197; {new Date(aviso.data_evento + "T12:00:00").toLocaleDateString("pt-BR")}
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ChatScreen({ turmas }: any) {
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: "0 0 20px" }}>Chat por Turma</h2>
      {turmas.map(function(turma: any) {
        return (
          <div key={turma.id} style={{ background: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", border: "1px solid " + COLORS.border }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{ width: 48, height: 48, borderRadius: 14, background: COLORS.blueLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
                {turma.nome.includes("Ber") ? "&#127868;" : turma.nome.includes("Maternal") ? "&#129528;" : "&#127912;"}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, margin: 0 }}>{turma.nome}</h3>
                <div style={{ fontSize: 13, color: COLORS.textMuted }}>{turma.usuarios?.nome ? "Prof. " + turma.usuarios.nome : ""} - {turma.qtd_alunos} alunos</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function PlanosScreen({ planos: initialPlanos }: any) {
  var _s = useState(initialPlanos); var planos = _s[0]; var setPlanos = _s[1];
  var _s2 = useState("todos"); var filter = _s2[0]; var setFilter = _s2[1];
  var _s3 = useState<string | null>(null); var feedbackId = _s3[0]; var setFeedbackId = _s3[1];
  var _s4 = useState(""); var feedbackText = _s4[0]; var setFeedbackText = _s4[1];
  var filtered = filter === "todos" ? planos : planos.filter(function(p: any) { return p.status === filter; });

  async function updateStatus(id: string, status: string, feedback?: string) {
    var updateData: any = { status: status };
    if (feedback) updateData.feedback = feedback;
    await supabase.from("planos").update(updateData).eq("id", id);
    setPlanos(planos.map(function(p: any) { return p.id === id ? Object.assign({}, p, updateData) : p; }));
    setFeedbackId(null);
    setFeedbackText("");
  }

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: "0 0 16px" }}>Planos de Aula</h2>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto" }}>
        {[{ key: "todos", label: "Todos" }, { key: "pendente", label: "Pendentes" }, { key: "aprovado", label: "Aprovados" }, { key: "revisar", label: "Revisar" }].map(function(f) {
          return (
            <button key={f.key} onClick={function() { setFilter(f.key); }} style={{ padding: "8px 16px", borderRadius: 20, border: "none", background: filter === f.key ? COLORS.blue : COLORS.blueLight, color: filter === f.key ? COLORS.white : COLORS.blue, fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>
              {f.label}
            </button>
          );
        })}
      </div>
      {filtered.length === 0 && <p style={{ fontSize: 13, color: COLORS.textMuted, textAlign: "center", marginTop: 40 }}>Nenhum plano nesta categoria</p>}
      {filtered.map(function(p: any) {
        return (
          <div key={p.id} style={{ background: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", border: "1px solid " + COLORS.border }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, margin: "0 0 2px" }}>{p.titulo}</h3>
                <span style={{ fontSize: 13, color: COLORS.textMuted }}>{p.turmas?.nome}</span>
              </div>
              <StatusBadge status={p.status} />
            </div>
            {p.feedback && p.status === "revisar" && (
              <div style={{ background: COLORS.yellowLight, borderRadius: 10, padding: "8px 12px", marginTop: 8, marginBottom: 4 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#B8860B", marginBottom: 2 }}>Ajustes solicitados:</div>
                <div style={{ fontSize: 13, color: COLORS.text }}>{p.feedback}</div>
              </div>
            )}
            {p.status === "pendente" && (
              <div>
                {feedbackId === p.id ? (
                  <div style={{ marginTop: 12 }}>
                    <textarea value={feedbackText} onChange={function(e) { setFeedbackText(e.target.value); }} placeholder="Descreva os ajustes necessarios..." style={{ width: "100%", minHeight: 70, padding: 10, borderRadius: 10, border: "2px solid " + COLORS.yellow, fontSize: 13, outline: "none", boxSizing: "border-box", marginBottom: 8, resize: "vertical" }} />
                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={function() { setFeedbackId(null); setFeedbackText(""); }} style={{ flex: 1, padding: "8px", borderRadius: 10, border: "2px solid " + COLORS.border, background: "transparent", color: COLORS.text, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancelar</button>
                      <button onClick={function() { updateStatus(p.id, "revisar", feedbackText); }} style={{ flex: 1, padding: "8px", borderRadius: 10, border: "none", background: COLORS.yellow, color: COLORS.white, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Enviar ajuste</button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button onClick={function() { updateStatus(p.id, "aprovado"); }} style={{ flex: 1, padding: "8px", borderRadius: 10, border: "none", background: COLORS.green, color: COLORS.white, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>&#10003; Aprovar</button>
                    <button onClick={function() { setFeedbackId(p.id); }} style={{ flex: 1, padding: "8px", borderRadius: 10, border: "2px solid " + COLORS.yellow, background: "transparent", color: "#B8860B", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>&#8635; Pedir ajuste</button>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function CalendarioScreen({ eventos, avisos }: any) {
  var today = new Date();
  var _s = useState(today.getMonth()); var currentMonth = _s[0]; var setCurrentMonth = _s[1];
  var _s2 = useState(today.getFullYear()); var currentYear = _s2[0]; var setCurrentYear = _s2[1];

  var allEventos = [
    ...eventos,
    ...avisos.filter(function(a: any) { return a.data_evento; }).map(function(a: any) {
      return { id: "aviso-" + a.id, titulo: a.titulo, data: a.data_evento, cor: a.urgente ? COLORS.pink : COLORS.blue, fromMural: true };
    }),
  ].sort(function(a: any, b: any) { return a.data > b.data ? 1 : -1; });

  var eventDates = allEventos.map(function(e: any) { return e.data; });
  var daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  var firstDay = new Date(currentYear, currentMonth, 1).getDay();
  var monthNames = ["Janeiro", "Fevereiro", "Marco", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

  function prevMonth() {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else { setCurrentMonth(currentMonth - 1); }
  }
  function nextMonth() {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else { setCurrentMonth(currentMonth + 1); }
  }

  var monthPrefix = currentYear + "-" + String(currentMonth + 1).padStart(2, "0");
  var monthEventos = allEventos.filter(function(e: any) { return e.data.startsWith(monthPrefix); });

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: "0 0 20px" }}>Calendario Pedagogico</h2>
      <div style={{ background: COLORS.white, borderRadius: 16, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", border: "1px solid " + COLORS.border, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <button onClick={prevMonth} style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid " + COLORS.border, background: COLORS.white, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>&#9664;</button>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, margin: 0 }}>{monthNames[currentMonth]} {currentYear}</h3>
          <button onClick={nextMonth} style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid " + COLORS.border, background: COLORS.white, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>&#9654;</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, textAlign: "center" }}>
          {["D", "S", "T", "Q", "Q", "S", "S"].map(function(d, i) {
            return <div key={i} style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600, padding: 4 }}>{d}</div>;
          })}
          {Array.from({ length: firstDay }, function(_, i) { return <div key={"e-" + i} />; })}
          {Array.from({ length: daysInMonth }, function(_, i) {
            var day = i + 1;
            var dateStr = currentYear + "-" + String(currentMonth + 1).padStart(2, "0") + "-" + String(day).padStart(2, "0");
            var hasEvent = eventDates.includes(dateStr);
            var isToday = day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
            return (
              <div key={day} style={{ padding: "6px 2px", borderRadius: 8, fontSize: 13, fontWeight: isToday ? 700 : 400, background: isToday ? COLORS.blue : hasEvent ? COLORS.pinkLight : "transparent", color: isToday ? COLORS.white : hasEvent ? COLORS.pink : COLORS.text }}>
                {day}
              </div>
            );
          })}
        </div>
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, margin: "0 0 12px" }}>Eventos de {monthNames[currentMonth]}</h3>
      {monthEventos.length === 0 && <p style={{ fontSize: 13, color: COLORS.textMuted }}>Nenhum evento neste mes</p>}
      {monthEventos.map(function(ev: any) {
        return (
          <div key={ev.id} style={{ background: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 10, display: "flex", alignItems: "center", gap: 12, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", border: "1px solid " + COLORS.border }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: ev.cor + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: ev.cor }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{ev.titulo}</div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span style={{ fontSize: 12, color: COLORS.textMuted }}>{new Date(ev.data + "T12:00:00").toLocaleDateString("pt-BR")}</span>
                {ev.fromMural && <span style={{ fontSize: 10, background: COLORS.yellowLight, color: "#B8860B", padding: "1px 6px", borderRadius: 4, fontWeight: 600 }}>Mural</span>}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ChecklistScreen() {
  var _s = useState([
    { id: 1, text: "Rotina da manha organizada", checked: true },
    { id: 2, text: "Materiais acessiveis as criancas", checked: true },
    { id: 3, text: "Interacao professora-crianca positiva", checked: false },
    { id: 4, text: "Espaco limpo e seguro", checked: true },
    { id: 5, text: "Atividade alinhada ao planejamento", checked: false },
    { id: 6, text: "Registro fotografico realizado", checked: false },
  ]); var items = _s[0]; var setItems = _s[1];

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: "0 0 20px" }}>Checklist de Observacao</h2>
      <div style={{ background: COLORS.white, borderRadius: 16, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", border: "1px solid " + COLORS.border, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, margin: "0 0 2px" }}>Visita - Bercario II</h3>
            <span style={{ fontSize: 12, color: COLORS.textMuted }}>24/03/2026</span>
          </div>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: COLORS.blueLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: COLORS.blue }}>
            {items.filter(function(i) { return i.checked; }).length}/{items.length}
          </div>
        </div>
        {items.map(function(item) {
          return (
            <div key={item.id} onClick={function() { setItems(items.map(function(i) { return i.id === item.id ? Object.assign({}, i, { checked: !i.checked }) : i; })); }}
              style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderTop: "1px solid " + COLORS.border, cursor: "pointer" }}>
              <div style={{ width: 24, height: 24, borderRadius: 8, border: "2px solid " + (item.checked ? COLORS.green : COLORS.border), background: item.checked ? COLORS.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {item.checked && <span style={{ color: COLORS.white, fontSize: 14, fontWeight: 700 }}>&#10003;</span>}
              </div>
              <span style={{ fontSize: 14, color: item.checked ? COLORS.textMuted : COLORS.text, textDecoration: item.checked ? "line-through" : "none" }}>{item.text}</span>
            </div>
          );
        })}
      </div>
      <div style={{ background: COLORS.white, borderRadius: 16, padding: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", border: "1px solid " + COLORS.border }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 8 }}>Comentario da visita</label>
        <textarea placeholder="Observacoes gerais sobre a visita..." style={{ width: "100%", minHeight: 80, padding: 12, borderRadius: 12, border: "2px solid " + COLORS.border, fontSize: 14, resize: "vertical", outline: "none", boxSizing: "border-box" }} />
        <button style={{ width: "100%", marginTop: 12, padding: 12, borderRadius: 12, border: "none", background: COLORS.blue, color: COLORS.white, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Adicionar foto + Salvar</button>
      </div>
    </div>
  );
}

function GaleriaScreen() {
  var fotos = [
    { id: 1, turma: "Bercario II", desc: "Atividade sensorial", color: "#FFB8C6" },
    { id: 2, turma: "Bercario II", desc: "Hora da musica", color: "#B8D4FF" },
    { id: 3, turma: "Maternal I", desc: "Pintura com guache", color: "#FFE0B8" },
    { id: 4, turma: "Maternal I", desc: "Parquinho", color: "#B8FFCF" },
    { id: 5, turma: "Jardim I", desc: "Contacao de historia", color: "#E0B8FF" },
    { id: 6, turma: "Jardim I", desc: "Atividade coletiva", color: "#FFB8B8" },
  ];
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: 0 }}>Galeria de Fotos</h2>
        <button style={{ background: COLORS.pink, color: COLORS.white, border: "none", borderRadius: 12, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Upload</button>
      </div>
      <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto" }}>
        {["Todas", "Bercario II", "Maternal I", "Jardim I"].map(function(t, i) {
          return <button key={t} style={{ padding: "8px 16px", borderRadius: 20, border: "none", background: i === 0 ? COLORS.blue : COLORS.blueLight, color: i === 0 ? COLORS.white : COLORS.blue, fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>{t}</button>;
        })}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {fotos.map(function(foto) {
          return (
            <div key={foto.id} style={{ borderRadius: 14, overflow: "hidden", background: COLORS.white, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", border: "1px solid " + COLORS.border }}>
              <div style={{ height: 120, background: foto.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32 }}>&#128248;</div>
              <div style={{ padding: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{foto.desc}</div>
                <div style={{ fontSize: 11, color: COLORS.textMuted }}>{foto.turma}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

var TABS = [
  { id: "dashboard", icon: "&#127968;", label: "Inicio" },
  { id: "mural", icon: "&#128226;", label: "Mural" },
  { id: "chat", icon: "&#128172;", label: "Chat" },
  { id: "planos", icon: "&#128221;", label: "Planos" },
  { id: "calendario", icon: "&#128197;", label: "Agenda" },
  { id: "checklist", icon: "&#9989;", label: "Visitas" },
  { id: "galeria", icon: "&#128247;", label: "Fotos" },
];

export default function Home() {
  var _s = useState<any>(null); var user = _s[0]; var setUser = _s[1];
  var _s2 = useState("dashboard"); var activeTab = _s2[0]; var setActiveTab = _s2[1];
  var _s3 = useState<any[]>([]); var avisos = _s3[0]; var setAvisos = _s3[1];
  var _s4 = useState<any[]>([]); var planos = _s4[0]; var setPlanos = _s4[1];
  var _s5 = useState<any[]>([]); var eventos = _s5[0]; var setEventos = _s5[1];
  var _s6 = useState<any[]>([]); var turmas = _s6[0]; var setTurmas = _s6[1];
  var _s7 = useState<any[]>([]); var usuarios = _s7[0]; var setUsuarios = _s7[1];
  var _s8 = useState(false); var loading = _s8[0]; var setLoading = _s8[1];

  async function loadData(userData: any) {
    setLoading(true);
    var results = await Promise.all([
      supabase.from("avisos").select("*").eq("escola_id", userData.escola_id).order("created_at", { ascending: false }),
      supabase.from("planos").select("*, turmas(nome)").order("created_at", { ascending: false }),
      supabase.from("eventos").select("*").eq("escola_id", userData.escola_id).order("data", { ascending: true }),
      supabase.from("turmas").select("*, usuarios(nome)").eq("escola_id", userData.escola_id),
      supabase.from("usuarios").select("*").eq("escola_id", userData.escola_id),
    ]);
    setAvisos(results[0].data || []);
    setPlanos(results[1].data || []);
    setEventos(results[2].data || []);
    setTurmas(results[3].data || []);
    setUsuarios(results[4].data || []);
    setLoading(false);
  }

  function handleLogin(userData: any) { setUser(userData); loadData(userData); }

  function handleAvisoCreated(newAviso: any) {
    setAvisos(function(prev) {
      if (prev.find(function(a) { return a.id === newAviso.id; })) return prev;
      return [newAviso, ...prev];
    });
  }

  if (!user) return <LoginScreen onLogin={handleLogin} />;

  if (loading) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: COLORS.bg }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>&#128203;</div>
        <p style={{ color: COLORS.textMuted, fontSize: 14 }}>Carregando...</p>
      </div>
    </div>
  );

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", maxWidth: 480, margin: "0 auto", position: "relative" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: COLORS.white, borderBottom: "1px solid " + COLORS.border, padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, " + COLORS.blue + ", " + COLORS.blueDark + ")", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: COLORS.white, fontSize: 16 }}>&#128203;</span>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text }}>Coordinator</div>
            <div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, textTransform: "uppercase" }}>by KidFly</div>
          </div>
        </div>
        <div onClick={function() { setUser(null); setActiveTab("dashboard"); }} style={{ width: 36, height: 36, borderRadius: 10, background: COLORS.pinkLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, cursor: "pointer" }}>&#128100;</div>
      </div>

      <div style={{ padding: "20px 20px 100px" }}>
        {activeTab === "dashboard" && <DashboardScreen user={user} avisos={avisos} planos={planos} eventos={eventos} turmas={turmas} />}
        {activeTab === "mural" && <MuralScreen avisos={avisos} user={user} usuarios={usuarios} onAvisoCreated={handleAvisoCreated} />}
        {activeTab === "chat" && <ChatScreen turmas={turmas} />}
        {activeTab === "planos" && <PlanosScreen planos={planos} />}
        {activeTab === "calendario" && <CalendarioScreen eventos={eventos} avisos={avisos} />}
        {activeTab === "checklist" && <ChecklistScreen />}
        {activeTab === "galeria" && <GaleriaScreen />}
      </div>

      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: COLORS.white, borderTop: "1px solid " + COLORS.border, display: "flex", justifyContent: "space-around", padding: "6px 4px 20px", zIndex: 50, boxShadow: "0 -4px 20px rgba(0,0,0,0.05)" }}>
        {TABS.map(function(tab) {
          return (
            <button key={tab.id} onClick={function() { setActiveTab(tab.id); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: "none", border: "none", padding: "4px 6px", cursor: "pointer", opacity: activeTab === tab.id ? 1 : 0.5 }}>
              <span style={{ fontSize: 20, display: "block", transform: activeTab === tab.id ? "scale(1.15)" : "scale(1)", transition: "transform 0.2s" }} dangerouslySetInnerHTML={{ __html: tab.icon }} />
              <span style={{ fontSize: 10, fontWeight: activeTab === tab.id ? 700 : 500, color: activeTab === tab.id ? COLORS.blue : COLORS.textMuted }}>{tab.label}</span>
              {activeTab === tab.id && <div style={{ width: 4, height: 4, borderRadius: "50%", background: COLORS.pink, marginTop: 1 }} />}
            </button>
          );
        })}
      </div>
    </div>
  );
}
