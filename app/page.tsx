"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";

var COLORS = {
  blue: "#2C5AA0", blueDark: "#1E3F73", blueLight: "#E8EFF8",
  pink: "#FE4F6B", pinkLight: "#FFF0F2",
  yellow: "#FFB800", yellowLight: "#FFF8E6",
  green: "#2ECC71", greenLight: "#EAFAF1",
  white: "#FFFFFF", bg: "#F5F7FB", text: "#1A2332", textMuted: "#6B7A90", border: "#E2E8F0",
};

function StatusBadge({ status }: { status: string }) {
  var config: Record<string, { bg: string; color: string; label: string }> = { pendente: { bg: COLORS.yellowLight, color: "#B8860B", label: "Pendente" }, aprovado: { bg: COLORS.greenLight, color: "#1B8A4A", label: "Aprovado" }, revisar: { bg: COLORS.pinkLight, color: COLORS.pink, label: "Revisar" } };
  var c = config[status] || config["pendente"];
  return <span style={{ background: c.bg, color: c.color, padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{c.label}</span>;
}

function SuccessMessage({ message, onClose }: { message: string; onClose: () => void }) {
  return (<div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 200, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}><div style={{ background: COLORS.white, borderRadius: 20, padding: "32px 24px", textAlign: "center", maxWidth: 320, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}><div style={{ fontSize: 48, marginBottom: 12 }}>&#9989;</div><h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, margin: "0 0 8px" }}>{message}</h3><button onClick={onClose} style={{ width: "100%", padding: 12, borderRadius: 12, border: "none", background: COLORS.blue, color: COLORS.white, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Ok</button></div></div>);
}

function ViewEventModal({ aviso, destinatarios, usuarios, onClose }: any) {
  var destInfo = destinatarios.filter(function(d: any) { return d.aviso_id === aviso.id; });
  var isTodos = destInfo.some(function(d: any) { return d.todos; });
  var assignedUsers = destInfo.filter(function(d: any) { return d.usuario_id; }).map(function(d: any) { var u = usuarios.find(function(u2: any) { return u2.id === d.usuario_id; }); return u ? u.nome : "?"; });
  return (<div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 200, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}><div style={{ background: COLORS.white, borderRadius: 20, padding: 20, maxWidth: 380, width: "100%" }}>
    <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, margin: "0 0 4px" }}>{aviso.titulo}</h3>
    {aviso.urgente && <span style={{ fontSize: 11, background: COLORS.pinkLight, color: COLORS.pink, padding: "2px 8px", borderRadius: 6, fontWeight: 600 }}>Urgente</span>}
    <div style={{ marginTop: 16, marginBottom: 12 }}><div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 4 }}>Data</div>{aviso.data_evento ? <div style={{ fontSize: 14, color: COLORS.blue, fontWeight: 600, background: COLORS.blueLight, padding: "8px 12px", borderRadius: 10, display: "inline-block" }}>&#128197; {new Date(aviso.data_evento + "T12:00:00").toLocaleDateString("pt-BR")}</div> : <div style={{ fontSize: 13, color: COLORS.textMuted }}>Sem data</div>}</div>
    <div style={{ marginBottom: 16 }}><div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, marginBottom: 4 }}>Responsaveis</div>{isTodos ? <div style={{ fontSize: 13, color: COLORS.green, fontWeight: 600, background: COLORS.greenLight, padding: "8px 12px", borderRadius: 10, display: "inline-block" }}>Todos</div> : assignedUsers.length > 0 ? <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{assignedUsers.map(function(n: string, i: number) { return <span key={i} style={{ fontSize: 12, background: COLORS.blueLight, color: COLORS.blue, padding: "4px 10px", borderRadius: 8, fontWeight: 600 }}>{n}</span>; })}</div> : <div style={{ fontSize: 13, color: COLORS.textMuted }}>Nenhum</div>}</div>
    <button onClick={onClose} style={{ width: "100%", padding: 12, borderRadius: 12, border: "none", background: COLORS.blue, color: COLORS.white, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Fechar</button>
  </div></div>);
}

function LoginScreen({ onLogin }: { onLogin: (user: any) => void }) {
  var _s = useState(""); var email = _s[0]; var setEmail = _s[1];
  var _s2 = useState(""); var pass = _s2[0]; var setPass = _s2[1];
  var _s3 = useState(""); var erro = _s3[0]; var setErro = _s3[1];
  var _s4 = useState(false); var loading = _s4[0]; var setLoading = _s4[1];
  async function handleLogin() {
    setErro(""); setLoading(true);
    var res = await supabase.from("usuarios").select("*, escolas(nome)").eq("email", email).eq("senha_hash", pass).single();
    setLoading(false);
    if (res.error || !res.data) { setErro("E-mail ou senha incorretos"); return; }
    onLogin(res.data);
  }
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(145deg, " + COLORS.blue + " 0%, " + COLORS.blueDark + " 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <div style={{ width: 72, height: 72, borderRadius: 20, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px", border: "1px solid rgba(255,255,255,0.2)" }}><span style={{ fontSize: 36 }}>&#128203;</span></div>
        <h1 style={{ color: COLORS.white, fontSize: 28, fontWeight: 700, margin: "0 0 4px" }}>Coordinator</h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, margin: 0, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 500 }}>by KidFly</p>
      </div>
      <div style={{ background: COLORS.white, borderRadius: 24, padding: "32px 24px", width: "100%", maxWidth: 380, boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: "0 0 4px" }}>Bem-vinda! &#128075;</h2>
        <p style={{ fontSize: 14, color: COLORS.textMuted, margin: "0 0 24px" }}>Entre com seu acesso KidFly</p>
        {erro && <div style={{ background: COLORS.pinkLight, color: COLORS.pink, padding: "10px 14px", borderRadius: 12, fontSize: 13, fontWeight: 600, marginBottom: 16 }}>{erro}</div>}
        <div style={{ marginBottom: 16 }}><label style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 6 }}>E-mail</label><input type="email" value={email} onChange={function(e) { setEmail(e.target.value); }} placeholder="seu@email.com" style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "2px solid " + COLORS.border, fontSize: 15, outline: "none", boxSizing: "border-box" }} /></div>
        <div style={{ marginBottom: 24 }}><label style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 6 }}>Senha</label><input type="password" value={pass} onChange={function(e) { setPass(e.target.value); }} placeholder="********" style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "2px solid " + COLORS.border, fontSize: 15, outline: "none", boxSizing: "border-box" }} /></div>
        <button onClick={handleLogin} disabled={loading} style={{ width: "100%", padding: "14px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, " + COLORS.pink + " 0%, #E8405A 100%)", color: COLORS.white, fontSize: 16, fontWeight: 700, cursor: "pointer", opacity: loading ? 0.7 : 1 }}>{loading ? "Entrando..." : "Entrar"}</button>
        <p style={{ textAlign: "center", fontSize: 11, color: COLORS.textMuted, marginTop: 12, marginBottom: 0, background: COLORS.blueLight, padding: "8px", borderRadius: 8 }}>Demo: maria@escola.com / 123456</p>
      </div>
    </div>
  );
}

function DashboardScreen({ user, avisos, planos, eventos, turmas }: any) {
  var nomeFirst = user.nome.split(" ")[0];
  var escolaNome = user.escolas?.nome || "Minha Escola";
  var pendentes = planos.filter(function(p: any) { return p.status === "pendente"; }).length;
  var allEventos = [...eventos, ...avisos.filter(function(a: any) { return a.data_evento; }).map(function(a: any) { return { id: "a-" + a.id, titulo: a.titulo, data: a.data_evento, cor: a.urgente ? COLORS.pink : COLORS.blue }; })].sort(function(a: any, b: any) { return a.data > b.data ? 1 : -1; });
  return (
    <div>
      <div style={{ marginBottom: 24 }}><h2 style={{ fontSize: 22, fontWeight: 700, color: COLORS.text, margin: "0 0 4px" }}>Bom dia, {nomeFirst}! &#9728;&#65039;</h2><p style={{ fontSize: 14, color: COLORS.textMuted, margin: 0 }}>{escolaNome}</p></div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
        {[{ label: "Planos pendentes", value: String(pendentes), icon: "&#128221;", bg: COLORS.yellowLight },{ label: "Avisos ativos", value: String(avisos.length), icon: "&#128226;", bg: COLORS.pinkLight },{ label: "Eventos", value: String(allEventos.length), icon: "&#128197;", bg: COLORS.blueLight },{ label: "Professoras", value: String(turmas.length), icon: "&#128105;&#8205;&#127979;", bg: COLORS.greenLight }].map(function(stat, i) {
          return (<div key={i} style={{ background: COLORS.white, borderRadius: 16, padding: 16, border: "1px solid " + COLORS.border }}><div style={{ width: 40, height: 40, borderRadius: 12, background: stat.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 10 }} dangerouslySetInnerHTML={{ __html: stat.icon }} /><div style={{ fontSize: 24, fontWeight: 700, color: COLORS.text }}>{stat.value}</div><div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>{stat.label}</div></div>);
        })}
      </div>
      <div style={{ background: COLORS.white, borderRadius: 16, padding: 16, border: "1px solid " + COLORS.border, marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, margin: "0 0 12px" }}>Planos recentes</h3>
        {planos.slice(0, 3).map(function(p: any) { return (<div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderTop: "1px solid " + COLORS.border }}><div><div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{p.titulo}</div><div style={{ fontSize: 12, color: COLORS.textMuted }}>{p.turmas?.nome}</div></div><StatusBadge status={p.status} /></div>); })}
      </div>
      <div style={{ background: COLORS.white, borderRadius: 16, padding: 16, border: "1px solid " + COLORS.border }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, margin: "0 0 12px" }}>Agenda</h3>
        {allEventos.slice(0, 4).map(function(ev: any) { return (<div key={ev.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderTop: "1px solid " + COLORS.border }}><div style={{ width: 4, height: 36, borderRadius: 4, background: ev.cor, flexShrink: 0 }} /><div><div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{ev.titulo}</div><div style={{ fontSize: 12, color: COLORS.textMuted }}>{new Date(ev.data + "T12:00:00").toLocaleDateString("pt-BR")}</div></div></div>); })}
      </div>
    </div>
  );
}

function MuralScreen({ avisos, user, usuarios, destinatarios, onAvisoCreated, onAvisoUpdated, onAvisoDeleted }: any) {
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
  var _s13 = useState("todos"); var editAtrib = _s13[0]; var setEditAtrib = _s13[1];
  var _s14 = useState<string[]>([]); var editSelUsers = _s14[0]; var setEditSelUsers = _s14[1];
  var _s15 = useState<any>(null); var viewingAviso = _s15[0]; var setViewingAviso = _s15[1];
  var isEditor = user.papel === "coordenadora" || user.papel === "diretora";
  var outrosUsuarios = usuarios.filter(function(u: any) { return u.id !== user.id; });
  async function criarAviso() {
    if (!titulo.trim()) return;
    var d: any = { escola_id: user.escola_id, autor_id: user.id, titulo: titulo, urgente: urgente };
    if (dataEvento) d.data_evento = dataEvento;
    var res = await supabase.from("avisos").insert(d).select().single();
    if (res.data) {
      if (atribuicao === "todos") await supabase.from("aviso_destinatarios").insert({ aviso_id: res.data.id, todos: true });
      else { var ds = selectedUsers.map(function(uid) { return { aviso_id: res.data.id, usuario_id: uid, todos: false }; }); if (ds.length > 0) await supabase.from("aviso_destinatarios").insert(ds); }
      setLista([res.data, ...lista]); setTitulo(""); setDataEvento(""); setUrgente(false); setAtribuicao("todos"); setSelectedUsers([]); setMostrarForm(false); setSuccessMsg("Aviso publicado!"); if (onAvisoCreated) onAvisoCreated(res.data);
    }
  }
  function startEdit(aviso: any) {
    setEditingAviso(aviso); setEditTitulo(aviso.titulo); setEditData(aviso.data_evento || ""); setEditUrgente(aviso.urgente);
    var di = destinatarios.filter(function(d: any) { return d.aviso_id === aviso.id; });
    if (di.some(function(d: any) { return d.todos; })) { setEditAtrib("todos"); setEditSelUsers([]); }
    else { setEditAtrib("selecionar"); setEditSelUsers(di.filter(function(d: any) { return d.usuario_id; }).map(function(d: any) { return d.usuario_id; })); }
  }
  async function salvarEdicao() {
    if (!editingAviso || !editTitulo.trim()) return;
    var ud: any = { titulo: editTitulo, urgente: editUrgente, data_evento: editData || null };
    await supabase.from("avisos").update(ud).eq("id", editingAviso.id);
    await supabase.from("aviso_destinatarios").delete().eq("aviso_id", editingAviso.id);
    if (editAtrib === "todos") await supabase.from("aviso_destinatarios").insert({ aviso_id: editingAviso.id, todos: true });
    else { var ds = editSelUsers.map(function(uid) { return { aviso_id: editingAviso.id, usuario_id: uid, todos: false }; }); if (ds.length > 0) await supabase.from("aviso_destinatarios").insert(ds); }
    setLista(lista.map(function(a: any) { return a.id === editingAviso.id ? Object.assign({}, a, ud) : a; })); setEditingAviso(null); setSuccessMsg("Aviso atualizado!"); if (onAvisoUpdated) onAvisoUpdated();
  }
  async function excluirAviso() {
    if (!editingAviso) return;
    await supabase.from("aviso_destinatarios").delete().eq("aviso_id", editingAviso.id);
    await supabase.from("avisos").delete().eq("id", editingAviso.id);
    setLista(lista.filter(function(a: any) { return a.id !== editingAviso.id; })); setEditingAviso(null); setSuccessMsg("Aviso excluido!"); if (onAvisoDeleted) onAvisoDeleted();
  }
  function toggleUser(uid: string, sel: string[], setSel: any) { if (sel.includes(uid)) setSel(sel.filter(function(id) { return id !== uid; })); else setSel([...sel, uid]); }
  function UserSel({ users, selected, onToggle }: any) {
    return (<div style={{ marginBottom: 12, maxHeight: 120, overflowY: "auto", border: "1px solid " + COLORS.border, borderRadius: 10, padding: 8 }}>{users.map(function(u: any) { var s = selected.includes(u.id); return (<div key={u.id} onClick={function() { onToggle(u.id); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 4px", cursor: "pointer", borderBottom: "1px solid " + COLORS.border }}><div style={{ width: 22, height: 22, borderRadius: 6, border: "2px solid " + (s ? COLORS.green : COLORS.border), background: s ? COLORS.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s && <span style={{ color: COLORS.white, fontSize: 12, fontWeight: 700 }}>&#10003;</span>}</div><div><div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{u.nome}</div><div style={{ fontSize: 11, color: COLORS.textMuted }}>{u.papel}</div></div></div>); })}</div>);
  }
  return (
    <div>
      {successMsg && <SuccessMessage message={successMsg} onClose={function() { setSuccessMsg(""); }} />}
      {viewingAviso && <ViewEventModal aviso={viewingAviso} destinatarios={destinatarios} usuarios={usuarios} onClose={function() { setViewingAviso(null); }} />}
      {editingAviso && (<div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 200, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}><div style={{ background: COLORS.white, borderRadius: 20, padding: 20, maxWidth: 380, width: "100%", maxHeight: "85vh", overflowY: "auto" }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: COLORS.text, margin: "0 0 16px" }}>Editar aviso</h3>
        <input value={editTitulo} onChange={function(e) { setEditTitulo(e.target.value); }} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "2px solid " + COLORS.border, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 10 }} />
        <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 6 }}>Data</label>
        <input type="date" value={editData} onChange={function(e) { setEditData(e.target.value); }} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "2px solid " + COLORS.border, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 12 }} />
        <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 8 }}>Atribuir a:</label>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          <button onClick={function() { setEditAtrib("todos"); setEditSelUsers([]); }} style={{ flex: 1, padding: "8px", borderRadius: 10, border: "none", background: editAtrib === "todos" ? COLORS.blue : COLORS.blueLight, color: editAtrib === "todos" ? COLORS.white : COLORS.blue, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Todos</button>
          <button onClick={function() { setEditAtrib("selecionar"); }} style={{ flex: 1, padding: "8px", borderRadius: 10, border: "none", background: editAtrib === "selecionar" ? COLORS.blue : COLORS.blueLight, color: editAtrib === "selecionar" ? COLORS.white : COLORS.blue, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Selecionar</button>
        </div>
        {editAtrib === "selecionar" && <UserSel users={outrosUsuarios} selected={editSelUsers} onToggle={function(uid: string) { toggleUser(uid, editSelUsers, setEditSelUsers); }} />}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}><div onClick={function() { setEditUrgente(!editUrgente); }} style={{ width: 22, height: 22, borderRadius: 6, border: "2px solid " + (editUrgente ? COLORS.pink : COLORS.border), background: editUrgente ? COLORS.pink : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>{editUrgente && <span style={{ color: COLORS.white, fontSize: 12, fontWeight: 700 }}>&#10003;</span>}</div><span style={{ fontSize: 13, color: COLORS.text }}>Urgente</span></div>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}><button onClick={function() { setEditingAviso(null); }} style={{ flex: 1, padding: 10, borderRadius: 10, border: "2px solid " + COLORS.border, background: "transparent", color: COLORS.text, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Cancelar</button><button onClick={salvarEdicao} style={{ flex: 1, padding: 10, borderRadius: 10, border: "none", background: COLORS.blue, color: COLORS.white, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Salvar</button></div>
        <button onClick={excluirAviso} style={{ width: "100%", padding: 10, borderRadius: 10, border: "2px solid " + COLORS.pink, background: "transparent", color: COLORS.pink, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>&#128465; Excluir</button>
      </div></div>)}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: 0 }}>Mural de Avisos</h2>
        {isEditor && <button onClick={function() { setMostrarForm(!mostrarForm); }} style={{ background: COLORS.pink, color: COLORS.white, border: "none", borderRadius: 12, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{mostrarForm ? "X Fechar" : "+ Novo"}</button>}
      </div>
      {mostrarForm && (<div style={{ background: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 16, border: "1px solid " + COLORS.border }}>
        <input value={titulo} onChange={function(e) { setTitulo(e.target.value); }} placeholder="Titulo do aviso..." style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "2px solid " + COLORS.border, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 10 }} />
        <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 6 }}>Data (opcional)</label>
        <input type="date" value={dataEvento} onChange={function(e) { setDataEvento(e.target.value); }} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "2px solid " + COLORS.border, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 12 }} />
        <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 8 }}>Atribuir a:</label>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}><button onClick={function() { setAtribuicao("todos"); setSelectedUsers([]); }} style={{ flex: 1, padding: "8px", borderRadius: 10, border: "none", background: atribuicao === "todos" ? COLORS.blue : COLORS.blueLight, color: atribuicao === "todos" ? COLORS.white : COLORS.blue, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Todos</button><button onClick={function() { setAtribuicao("selecionar"); }} style={{ flex: 1, padding: "8px", borderRadius: 10, border: "none", background: atribuicao === "selecionar" ? COLORS.blue : COLORS.blueLight, color: atribuicao === "selecionar" ? COLORS.white : COLORS.blue, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Selecionar</button></div>
        {atribuicao === "selecionar" && <UserSel users={outrosUsuarios} selected={selectedUsers} onToggle={function(uid: string) { toggleUser(uid, selectedUsers, setSelectedUsers); }} />}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}><div onClick={function() { setUrgente(!urgente); }} style={{ width: 22, height: 22, borderRadius: 6, border: "2px solid " + (urgente ? COLORS.pink : COLORS.border), background: urgente ? COLORS.pink : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>{urgente && <span style={{ color: COLORS.white, fontSize: 12, fontWeight: 700 }}>&#10003;</span>}</div><span style={{ fontSize: 13, color: COLORS.text }}>Urgente</span></div>
        <button onClick={criarAviso} style={{ width: "100%", padding: 10, borderRadius: 10, border: "none", background: COLORS.blue, color: COLORS.white, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Publicar</button>
      </div>)}
      {lista.length === 0 && <p style={{ fontSize: 13, color: COLORS.textMuted, textAlign: "center", marginTop: 40 }}>Nenhum aviso</p>}
      {lista.map(function(av: any) { return (<div key={av.id} style={{ background: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, border: "1px solid " + (av.urgente ? COLORS.pink + "33" : COLORS.border), borderLeft: av.urgente ? "4px solid " + COLORS.pink : "4px solid " + COLORS.border }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, margin: "0 0 6px" }}>{av.urgente && <span style={{ color: COLORS.pink, marginRight: 6 }}>&#9679;</span>}{av.titulo}</h3>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }}><span style={{ fontSize: 12, color: COLORS.textMuted }}>{new Date(av.created_at).toLocaleDateString("pt-BR")}</span>{av.data_evento && <span style={{ fontSize: 11, background: COLORS.blueLight, color: COLORS.blue, padding: "2px 8px", borderRadius: 6, fontWeight: 600 }}>&#128197; {new Date(av.data_evento + "T12:00:00").toLocaleDateString("pt-BR")}</span>}</div>
        <div style={{ display: "flex", gap: 8 }}><button onClick={function() { setViewingAviso(av); }} style={{ flex: 1, padding: "6px 12px", borderRadius: 8, border: "1px solid " + COLORS.border, background: COLORS.white, fontSize: 12, fontWeight: 600, color: COLORS.blue, cursor: "pointer" }}>&#128065; Visualizar</button>{isEditor && <button onClick={function() { startEdit(av); }} style={{ padding: "6px 12px", borderRadius: 8, border: "none", background: COLORS.blueLight, fontSize: 12, fontWeight: 600, color: COLORS.blue, cursor: "pointer" }}>&#9998; Editar</button>}</div>
      </div>); })}
    </div>
  );
}

function ChatScreen({ turmas, user, usuarios }: any) {
  var _s = useState<any>(null); var activeTurma = _s[0]; var setActiveTurma = _s[1];
  var _s2 = useState<any[]>([]); var mensagens = _s2[0]; var setMensagens = _s2[1];
  var _s3 = useState(""); var newMsg = _s3[0]; var setNewMsg = _s3[1];
  var _s4 = useState(false); var loadingMsgs = _s4[0]; var setLoadingMsgs = _s4[1];
  var _s5 = useState(false); var sending = _s5[0]; var setSending = _s5[1];
  var scrollRef = useRef<HTMLDivElement>(null);
  function getName(uid: string) { var u = usuarios.find(function(u2: any) { return u2.id === uid; }); return u ? u.nome : "?"; }
  function getInitials(uid: string) { var n = getName(uid); var p = n.split(" "); return p.length >= 2 ? p[0][0] + p[1][0] : n.substring(0, 2); }
  async function openChat(turma: any) { setActiveTurma(turma); setLoadingMsgs(true); var res = await supabase.from("mensagens").select("*").eq("turma_id", turma.id).order("created_at", { ascending: true }); setMensagens(res.data || []); setLoadingMsgs(false); }
  useEffect(function() { if (!activeTurma) return; var ch = supabase.channel("chat-" + activeTurma.id).on("postgres_changes", { event: "INSERT", schema: "public", table: "mensagens", filter: "turma_id=eq." + activeTurma.id }, function(payload: any) { setMensagens(function(prev) { if (prev.find(function(m) { return m.id === payload.new.id; })) return prev; return [...prev, payload.new]; }); }).subscribe(); return function() { supabase.removeChannel(ch); }; }, [activeTurma]);
  useEffect(function() { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [mensagens]);
  async function sendMessage() { if (!newMsg.trim() || !activeTurma || sending) return; setSending(true); await supabase.from("mensagens").insert({ turma_id: activeTurma.id, autor_id: user.id, conteudo: newMsg.trim() }); setNewMsg(""); setSending(false); }
  if (activeTurma) {
    return (<div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 160px)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
        <button onClick={function() { setActiveTurma(null); setMensagens([]); }} style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid " + COLORS.border, background: COLORS.white, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>&#9664;</button>
        <div><h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, margin: 0 }}>{activeTurma.nome}</h3><div style={{ fontSize: 12, color: COLORS.textMuted }}>{activeTurma.usuarios?.nome ? "Prof. " + activeTurma.usuarios.nome : ""}</div></div>
      </div>
      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", background: COLORS.white, borderRadius: 16, padding: 16, border: "1px solid " + COLORS.border, marginBottom: 12 }}>
        {loadingMsgs && <p style={{ fontSize: 13, color: COLORS.textMuted, textAlign: "center" }}>Carregando...</p>}
        {!loadingMsgs && mensagens.length === 0 && <p style={{ fontSize: 13, color: COLORS.textMuted, textAlign: "center", marginTop: 40 }}>Nenhuma mensagem ainda.</p>}
        {mensagens.map(function(msg: any) { var isMe = msg.autor_id === user.id; var time = new Date(msg.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }); return (<div key={msg.id} style={{ display: "flex", flexDirection: isMe ? "row-reverse" : "row", gap: 8, marginBottom: 12, alignItems: "flex-end" }}>
          {!isMe && <div style={{ width: 32, height: 32, borderRadius: 10, background: COLORS.blueLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: COLORS.blue, flexShrink: 0 }}>{getInitials(msg.autor_id)}</div>}
          <div style={{ maxWidth: "75%" }}>{!isMe && <div style={{ fontSize: 11, fontWeight: 600, color: COLORS.blue, marginBottom: 2, paddingLeft: 4 }}>{getName(msg.autor_id)}</div>}<div style={{ background: isMe ? COLORS.blue : COLORS.bg, color: isMe ? COLORS.white : COLORS.text, padding: "10px 14px", borderRadius: isMe ? "16px 16px 4px 16px" : "16px 16px 16px 4px", fontSize: 14, lineHeight: "1.4" }}>{msg.conteudo}</div><div style={{ fontSize: 10, color: COLORS.textMuted, marginTop: 2, textAlign: isMe ? "right" : "left", padding: "0 4px" }}>{time}</div></div>
        </div>); })}
      </div>
      <div style={{ display: "flex", gap: 8 }}><input value={newMsg} onChange={function(e) { setNewMsg(e.target.value); }} onKeyDown={function(e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} placeholder="Mensagem..." style={{ flex: 1, padding: "12px 16px", borderRadius: 14, border: "2px solid " + COLORS.border, fontSize: 14, outline: "none", boxSizing: "border-box" }} /><button onClick={sendMessage} disabled={sending || !newMsg.trim()} style={{ width: 48, height: 48, borderRadius: 14, border: "none", background: COLORS.blue, color: COLORS.white, fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: sending || !newMsg.trim() ? 0.5 : 1, flexShrink: 0 }}>&#10148;</button></div>
    </div>);
  }
  return (<div>
    <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: "0 0 20px" }}>Chat por Turma</h2>
    {turmas.map(function(t: any) { return (<div key={t.id} onClick={function() { openChat(t); }} style={{ background: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, border: "1px solid " + COLORS.border, cursor: "pointer" }}><div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 48, height: 48, borderRadius: 14, background: COLORS.blueLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{t.nome.includes("Ber") ? "&#127868;" : t.nome.includes("Maternal") ? "&#129528;" : "&#127912;"}</div><div style={{ flex: 1 }}><h3 style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, margin: 0 }}>{t.nome}</h3><div style={{ fontSize: 13, color: COLORS.textMuted }}>{t.usuarios?.nome ? "Prof. " + t.usuarios.nome : ""} - {t.qtd_alunos} alunos</div></div><div style={{ width: 32, height: 32, borderRadius: 8, background: COLORS.blueLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: COLORS.blue, flexShrink: 0 }}>&#9654;</div></div></div>); })}
  </div>);
}

function PlanosScreen({ planos: init }: any) {
  var _s = useState(init); var planos = _s[0]; var setPlanos = _s[1];
  var _s2 = useState("todos"); var filter = _s2[0]; var setFilter = _s2[1];
  var _s3 = useState<string | null>(null); var fbId = _s3[0]; var setFbId = _s3[1];
  var _s4 = useState(""); var fbText = _s4[0]; var setFbText = _s4[1];
  var filtered = filter === "todos" ? planos : planos.filter(function(p: any) { return p.status === filter; });
  async function upd(id: string, status: string, fb?: string) { var d: any = { status: status }; if (fb) d.feedback = fb; await supabase.from("planos").update(d).eq("id", id); setPlanos(planos.map(function(p: any) { return p.id === id ? Object.assign({}, p, d) : p; })); setFbId(null); setFbText(""); }
  return (<div>
    <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: "0 0 16px" }}>Planos de Aula</h2>
    <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto" }}>{[{ key: "todos", label: "Todos" },{ key: "pendente", label: "Pendentes" },{ key: "aprovado", label: "Aprovados" },{ key: "revisar", label: "Revisar" }].map(function(f) { return <button key={f.key} onClick={function() { setFilter(f.key); }} style={{ padding: "8px 16px", borderRadius: 20, border: "none", background: filter === f.key ? COLORS.blue : COLORS.blueLight, color: filter === f.key ? COLORS.white : COLORS.blue, fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>{f.label}</button>; })}</div>
    {filtered.length === 0 && <p style={{ fontSize: 13, color: COLORS.textMuted, textAlign: "center", marginTop: 40 }}>Nenhum plano</p>}
    {filtered.map(function(p: any) { return (<div key={p.id} style={{ background: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 12, border: "1px solid " + COLORS.border }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}><div><h3 style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, margin: "0 0 2px" }}>{p.titulo}</h3><span style={{ fontSize: 13, color: COLORS.textMuted }}>{p.turmas?.nome}</span></div><StatusBadge status={p.status} /></div>
      {p.feedback && p.status === "revisar" && <div style={{ background: COLORS.yellowLight, borderRadius: 10, padding: "8px 12px", marginTop: 8 }}><div style={{ fontSize: 11, fontWeight: 600, color: "#B8860B", marginBottom: 2 }}>Ajustes:</div><div style={{ fontSize: 13, color: COLORS.text }}>{p.feedback}</div></div>}
      {p.status === "pendente" && (<div>{fbId === p.id ? (<div style={{ marginTop: 12 }}><textarea value={fbText} onChange={function(e) { setFbText(e.target.value); }} placeholder="Descreva os ajustes..." style={{ width: "100%", minHeight: 70, padding: 10, borderRadius: 10, border: "2px solid " + COLORS.yellow, fontSize: 13, outline: "none", boxSizing: "border-box", marginBottom: 8, resize: "vertical" }} /><div style={{ display: "flex", gap: 8 }}><button onClick={function() { setFbId(null); setFbText(""); }} style={{ flex: 1, padding: "8px", borderRadius: 10, border: "2px solid " + COLORS.border, background: "transparent", color: COLORS.text, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancelar</button><button onClick={function() { upd(p.id, "revisar", fbText); }} style={{ flex: 1, padding: "8px", borderRadius: 10, border: "none", background: COLORS.yellow, color: COLORS.white, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Enviar</button></div></div>) : (<div style={{ display: "flex", gap: 8, marginTop: 12 }}><button onClick={function() { upd(p.id, "aprovado"); }} style={{ flex: 1, padding: "8px", borderRadius: 10, border: "none", background: COLORS.green, color: COLORS.white, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>&#10003; Aprovar</button><button onClick={function() { setFbId(p.id); }} style={{ flex: 1, padding: "8px", borderRadius: 10, border: "2px solid " + COLORS.yellow, background: "transparent", color: "#B8860B", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>&#8635; Pedir ajuste</button></div>)}</div>)}
    </div>); })}
  </div>);
}

function CalendarioScreen({ eventos, avisos }: any) {
  var today = new Date();
  var _s = useState(today.getMonth()); var cm = _s[0]; var setCm = _s[1];
  var _s2 = useState(today.getFullYear()); var cy = _s2[0]; var setCy = _s2[1];
  var all = [...eventos, ...avisos.filter(function(a: any) { return a.data_evento; }).map(function(a: any) { return { id: "a-" + a.id, titulo: a.titulo, data: a.data_evento, cor: a.urgente ? COLORS.pink : COLORS.blue, fromMural: true }; })].sort(function(a: any, b: any) { return a.data > b.data ? 1 : -1; });
  var dates = all.map(function(e: any) { return e.data; });
  var dim = new Date(cy, cm + 1, 0).getDate();
  var fd = new Date(cy, cm, 1).getDay();
  var mn = ["Janeiro","Fevereiro","Marco","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
  function prev() { if (cm === 0) { setCm(11); setCy(cy - 1); } else setCm(cm - 1); }
  function next() { if (cm === 11) { setCm(0); setCy(cy + 1); } else setCm(cm + 1); }
  var mp = cy + "-" + String(cm + 1).padStart(2, "0");
  var me = all.filter(function(e: any) { return e.data.startsWith(mp); });
  return (<div>
    <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: "0 0 20px" }}>Calendario</h2>
    <div style={{ background: COLORS.white, borderRadius: 16, padding: 16, border: "1px solid " + COLORS.border, marginBottom: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <button onClick={prev} style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid " + COLORS.border, background: COLORS.white, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>&#9664;</button>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, margin: 0 }}>{mn[cm]} {cy}</h3>
        <button onClick={next} style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid " + COLORS.border, background: COLORS.white, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>&#9654;</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, textAlign: "center" }}>
        {["D","S","T","Q","Q","S","S"].map(function(d, i) { return <div key={i} style={{ fontSize: 11, color: COLORS.textMuted, fontWeight: 600, padding: 4 }}>{d}</div>; })}
        {Array.from({ length: fd }, function(_, i) { return <div key={"e" + i} />; })}
        {Array.from({ length: dim }, function(_, i) { var day = i + 1; var ds = cy + "-" + String(cm + 1).padStart(2, "0") + "-" + String(day).padStart(2, "0"); var he = dates.includes(ds); var it = day === today.getDate() && cm === today.getMonth() && cy === today.getFullYear(); return <div key={day} style={{ padding: "6px 2px", borderRadius: 8, fontSize: 13, fontWeight: it ? 700 : 400, background: it ? COLORS.blue : he ? COLORS.pinkLight : "transparent", color: it ? COLORS.white : he ? COLORS.pink : COLORS.text }}>{day}</div>; })}
      </div>
    </div>
    <h3 style={{ fontSize: 16, fontWeight: 700, color: COLORS.text, margin: "0 0 12px" }}>Eventos de {mn[cm]}</h3>
    {me.length === 0 && <p style={{ fontSize: 13, color: COLORS.textMuted }}>Nenhum evento</p>}
    {me.map(function(ev: any) { return (<div key={ev.id} style={{ background: COLORS.white, borderRadius: 14, padding: 14, marginBottom: 10, display: "flex", alignItems: "center", gap: 12, border: "1px solid " + COLORS.border }}><div style={{ width: 44, height: 44, borderRadius: 12, background: ev.cor + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><div style={{ width: 10, height: 10, borderRadius: "50%", background: ev.cor }} /></div><div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600, color: COLORS.text }}>{ev.titulo}</div><div style={{ display: "flex", gap: 6, alignItems: "center" }}><span style={{ fontSize: 12, color: COLORS.textMuted }}>{new Date(ev.data + "T12:00:00").toLocaleDateString("pt-BR")}</span>{ev.fromMural && <span style={{ fontSize: 10, background: COLORS.yellowLight, color: "#B8860B", padding: "1px 6px", borderRadius: 4, fontWeight: 600 }}>Mural</span>}</div></div></div>); })}
  </div>);
}

function ChecklistScreen() {
  var _s = useState([{ id: 1, text: "Rotina da manha organizada", checked: true },{ id: 2, text: "Materiais acessiveis", checked: true },{ id: 3, text: "Interacao positiva", checked: false },{ id: 4, text: "Espaco limpo e seguro", checked: true },{ id: 5, text: "Atividade alinhada", checked: false },{ id: 6, text: "Registro fotografico", checked: false }]); var items = _s[0]; var setItems = _s[1];
  return (<div>
    <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: "0 0 20px" }}>Checklist</h2>
    <div style={{ background: COLORS.white, borderRadius: 16, padding: 16, border: "1px solid " + COLORS.border, marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}><div><h3 style={{ fontSize: 15, fontWeight: 600, color: COLORS.text, margin: "0 0 2px" }}>Visita - Bercario II</h3><span style={{ fontSize: 12, color: COLORS.textMuted }}>24/03/2026</span></div><div style={{ width: 44, height: 44, borderRadius: 12, background: COLORS.blueLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: COLORS.blue }}>{items.filter(function(i) { return i.checked; }).length}/{items.length}</div></div>
      {items.map(function(item) { return (<div key={item.id} onClick={function() { setItems(items.map(function(i) { return i.id === item.id ? Object.assign({}, i, { checked: !i.checked }) : i; })); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderTop: "1px solid " + COLORS.border, cursor: "pointer" }}><div style={{ width: 24, height: 24, borderRadius: 8, border: "2px solid " + (item.checked ? COLORS.green : COLORS.border), background: item.checked ? COLORS.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{item.checked && <span style={{ color: COLORS.white, fontSize: 14, fontWeight: 700 }}>&#10003;</span>}</div><span style={{ fontSize: 14, color: item.checked ? COLORS.textMuted : COLORS.text, textDecoration: item.checked ? "line-through" : "none" }}>{item.text}</span></div>); })}
    </div>
  </div>);
}

function GaleriaScreen({ user, turmas }: any) {
  var _s = useState<any[]>([]); var fotos = _s[0]; var setFotos = _s[1];
  var _s2 = useState(false); var loadingFotos = _s2[0]; var setLoadingFotos = _s2[1];
  var _s3 = useState(false); var showUpload = _s3[0]; var setShowUpload = _s3[1];
  var _s4 = useState("todas"); var filtro = _s4[0]; var setFiltro = _s4[1];
  var _s5 = useState<File | null>(null); var selectedFile = _s5[0]; var setSelectedFile = _s5[1];
  var _s6 = useState(""); var descricao = _s6[0]; var setDescricao = _s6[1];
  var _s7 = useState(""); var turmaId = _s7[0]; var setTurmaId = _s7[1];
  var _s8 = useState(false); var uploading = _s8[0]; var setUploading = _s8[1];
  var _s9 = useState(""); var successMsg = _s9[0]; var setSuccessMsg = _s9[1];
  var _s10 = useState<any>(null); var viewingFoto = _s10[0]; var setViewingFoto = _s10[1];
  var _s11 = useState<string | null>(null); var previewUrl = _s11[0]; var setPreviewUrl = _s11[1];
  var fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(function() {
    setLoadingFotos(true);
    supabase.from("fotos").select("*, turmas(nome)").order("created_at", { ascending: false }).then(function(res) { setFotos(res.data || []); setLoadingFotos(false); });
  }, []);

  function handleFileSelect(e: any) {
    var file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      var reader = new FileReader();
      reader.onload = function(ev) { setPreviewUrl(ev.target?.result as string); };
      reader.readAsDataURL(file);
    }
  }

  async function uploadFoto() {
    if (!selectedFile || !turmaId || uploading) return;
    setUploading(true);
    var timestamp = Date.now();
    var ext = selectedFile.name.split(".").pop() || "jpg";
    var fileName = user.id + "-" + timestamp + "." + ext;
    var uploadRes = await supabase.storage.from("fotos").upload(fileName, selectedFile);
    if (uploadRes.error) { setUploading(false); return; }
    var urlRes = supabase.storage.from("fotos").getPublicUrl(fileName);
    var publicUrl = urlRes.data.publicUrl;
    var insertRes = await supabase.from("fotos").insert({ turma_id: turmaId, autor_id: user.id, url: publicUrl, descricao: descricao || "Foto" }).select("*, turmas(nome)").single();
    if (insertRes.data) {
      setFotos([insertRes.data, ...fotos]);
      setSelectedFile(null); setPreviewUrl(null); setDescricao(""); setTurmaId(""); setShowUpload(false);
      setSuccessMsg("Foto enviada com sucesso!");
    }
    setUploading(false);
  }

  async function deleteFoto(foto: any) {
    var parts = foto.url.split("/");
    var fileName = parts[parts.length - 1];
    await supabase.storage.from("fotos").remove([fileName]);
    await supabase.from("fotos").delete().eq("id", foto.id);
    setFotos(fotos.filter(function(f: any) { return f.id !== foto.id; }));
    setViewingFoto(null);
    setSuccessMsg("Foto excluida!");
  }

  var filteredFotos = filtro === "todas" ? fotos : fotos.filter(function(f: any) { return f.turma_id === filtro; });
  var turmaNames = ["todas"].concat(turmas.map(function(t: any) { return t.id; }));
  var turmaLabels: Record<string, string> = { todas: "Todas" };
  turmas.forEach(function(t: any) { turmaLabels[t.id] = t.nome; });

  return (
    <div>
      {successMsg && <SuccessMessage message={successMsg} onClose={function() { setSuccessMsg(""); }} />}

      {viewingFoto && (<div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 200, background: "rgba(0,0,0,0.9)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
        <div style={{ position: "absolute", top: 16, right: 16, display: "flex", gap: 8 }}>
          <button onClick={function() { deleteFoto(viewingFoto); }} style={{ padding: "8px 16px", borderRadius: 10, border: "none", background: COLORS.pink, color: COLORS.white, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>&#128465; Excluir</button>
          <button onClick={function() { setViewingFoto(null); }} style={{ padding: "8px 16px", borderRadius: 10, border: "none", background: COLORS.white, color: COLORS.text, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>X Fechar</button>
        </div>
        <img src={viewingFoto.url} alt={viewingFoto.descricao} style={{ maxWidth: "100%", maxHeight: "70vh", borderRadius: 12, objectFit: "contain" }} />
        <div style={{ marginTop: 16, textAlign: "center" }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: COLORS.white }}>{viewingFoto.descricao}</div>
          <div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>{viewingFoto.turmas?.nome} - {new Date(viewingFoto.created_at).toLocaleDateString("pt-BR")}</div>
        </div>
      </div>)}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: COLORS.text, margin: 0 }}>Galeria de Fotos</h2>
        <button onClick={function() { setShowUpload(!showUpload); }} style={{ background: COLORS.pink, color: COLORS.white, border: "none", borderRadius: 12, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{showUpload ? "X Fechar" : "&#128247; Upload"}</button>
      </div>

      {showUpload && (<div style={{ background: COLORS.white, borderRadius: 16, padding: 16, marginBottom: 16, border: "1px solid " + COLORS.border }}>
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} style={{ display: "none" }} />
        {previewUrl ? (
          <div style={{ marginBottom: 12 }}>
            <img src={previewUrl} alt="Preview" style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 12, marginBottom: 8 }} />
            <button onClick={function() { setSelectedFile(null); setPreviewUrl(null); if (fileInputRef.current) fileInputRef.current.value = ""; }} style={{ fontSize: 12, color: COLORS.pink, background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Remover foto</button>
          </div>
        ) : (
          <div onClick={function() { if (fileInputRef.current) fileInputRef.current.click(); }} style={{ width: "100%", height: 140, borderRadius: 12, border: "2px dashed " + COLORS.border, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", marginBottom: 12 }}>
            <div style={{ fontSize: 36, marginBottom: 4 }}>&#128247;</div>
            <div style={{ fontSize: 13, color: COLORS.textMuted }}>Toque para escolher foto</div>
          </div>
        )}
        <input value={descricao} onChange={function(e) { setDescricao(e.target.value); }} placeholder="Descricao da foto..." style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "2px solid " + COLORS.border, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 10 }} />
        <label style={{ fontSize: 13, fontWeight: 600, color: COLORS.text, display: "block", marginBottom: 6 }}>Turma</label>
        <select value={turmaId} onChange={function(e) { setTurmaId(e.target.value); }} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "2px solid " + COLORS.border, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 12, background: COLORS.white }}>
          <option value="">Selecione a turma</option>
          {turmas.map(function(t: any) { return <option key={t.id} value={t.id}>{t.nome}</option>; })}
        </select>
        <button onClick={uploadFoto} disabled={uploading || !selectedFile || !turmaId} style={{ width: "100%", padding: 10, borderRadius: 10, border: "none", background: COLORS.blue, color: COLORS.white, fontSize: 14, fontWeight: 600, cursor: "pointer", opacity: uploading || !selectedFile || !turmaId ? 0.5 : 1 }}>{uploading ? "Enviando..." : "Enviar foto"}</button>
      </div>)}

      <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto" }}>
        {turmaNames.map(function(id) { return <button key={id} onClick={function() { setFiltro(id); }} style={{ padding: "8px 16px", borderRadius: 20, border: "none", background: filtro === id ? COLORS.blue : COLORS.blueLight, color: filtro === id ? COLORS.white : COLORS.blue, fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>{turmaLabels[id] || id}</button>; })}
      </div>

      {loadingFotos && <p style={{ fontSize: 13, color: COLORS.textMuted, textAlign: "center" }}>Carregando fotos...</p>}
      {!loadingFotos && filteredFotos.length === 0 && <p style={{ fontSize: 13, color: COLORS.textMuted, textAlign: "center", marginTop: 40 }}>Nenhuma foto ainda. Envie a primeira!</p>}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        {filteredFotos.map(function(foto: any) { return (
          <div key={foto.id} onClick={function() { setViewingFoto(foto); }} style={{ borderRadius: 14, overflow: "hidden", background: COLORS.white, border: "1px solid " + COLORS.border, cursor: "pointer" }}>
            <img src={foto.url} alt={foto.descricao} style={{ width: "100%", height: 120, objectFit: "cover" }} />
            <div style={{ padding: 10 }}><div style={{ fontSize: 13, fontWeight: 600, color: COLORS.text }}>{foto.descricao}</div><div style={{ fontSize: 11, color: COLORS.textMuted }}>{foto.turmas?.nome} - {new Date(foto.created_at).toLocaleDateString("pt-BR")}</div></div>
          </div>
        ); })}
      </div>
    </div>
  );
}

var TABS = [{ id: "dashboard", icon: "&#127968;", label: "Inicio" },{ id: "mural", icon: "&#128226;", label: "Mural" },{ id: "chat", icon: "&#128172;", label: "Chat" },{ id: "planos", icon: "&#128221;", label: "Planos" },{ id: "calendario", icon: "&#128197;", label: "Agenda" },{ id: "checklist", icon: "&#9989;", label: "Visitas" },{ id: "galeria", icon: "&#128247;", label: "Fotos" }];

export default function Home() {
  var _s = useState<any>(null); var user = _s[0]; var setUser = _s[1];
  var _s2 = useState("dashboard"); var activeTab = _s2[0]; var setActiveTab = _s2[1];
  var _s3 = useState<any[]>([]); var avisos = _s3[0]; var setAvisos = _s3[1];
  var _s4 = useState<any[]>([]); var planos = _s4[0]; var setPlanos = _s4[1];
  var _s5 = useState<any[]>([]); var eventos = _s5[0]; var setEventos = _s5[1];
  var _s6 = useState<any[]>([]); var turmas = _s6[0]; var setTurmas = _s6[1];
  var _s7 = useState<any[]>([]); var usuarios = _s7[0]; var setUsuarios = _s7[1];
  var _s8 = useState<any[]>([]); var destinatarios = _s8[0]; var setDestinatarios = _s8[1];
  var _s9 = useState(false); var loading = _s9[0]; var setLoading = _s9[1];
  async function loadData(ud: any) {
    setLoading(true);
    var r = await Promise.all([supabase.from("avisos").select("*").eq("escola_id", ud.escola_id).order("created_at", { ascending: false }), supabase.from("planos").select("*, turmas(nome)").order("created_at", { ascending: false }), supabase.from("eventos").select("*").eq("escola_id", ud.escola_id).order("data", { ascending: true }), supabase.from("turmas").select("*, usuarios(nome)").eq("escola_id", ud.escola_id), supabase.from("usuarios").select("*").eq("escola_id", ud.escola_id), supabase.from("aviso_destinatarios").select("*")]);
    setAvisos(r[0].data || []); setPlanos(r[1].data || []); setEventos(r[2].data || []); setTurmas(r[3].data || []); setUsuarios(r[4].data || []); setDestinatarios(r[5].data || []);
    setLoading(false);
  }
  function handleLogin(ud: any) { setUser(ud); loadData(ud); }
  function handleAvisoCreated(a: any) { setAvisos(function(p) { if (p.find(function(x) { return x.id === a.id; })) return p; return [a, ...p]; }); }
  function reloadDest() { supabase.from("aviso_destinatarios").select("*").then(function(r) { setDestinatarios(r.data || []); }); }
  if (!user) return <LoginScreen onLogin={handleLogin} />;
  if (loading) return (<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: COLORS.bg }}><div style={{ textAlign: "center" }}><div style={{ fontSize: 40, marginBottom: 12 }}>&#128203;</div><p style={{ color: COLORS.textMuted, fontSize: 14 }}>Carregando...</p></div></div>);
  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", maxWidth: 480, margin: "0 auto", position: "relative" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: COLORS.white, borderBottom: "1px solid " + COLORS.border, padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, " + COLORS.blue + ", " + COLORS.blueDark + ")", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: COLORS.white, fontSize: 16 }}>&#128203;</span></div><div><div style={{ fontSize: 15, fontWeight: 700, color: COLORS.text }}>Coordinator</div><div style={{ fontSize: 10, color: COLORS.textMuted, letterSpacing: 1, textTransform: "uppercase" }}>by KidFly</div></div></div>
        <div onClick={function() { setUser(null); setActiveTab("dashboard"); }} style={{ width: 36, height: 36, borderRadius: 10, background: COLORS.pinkLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, cursor: "pointer" }}>&#128100;</div>
      </div>
      <div style={{ padding: "20px 20px 100px" }}>
        {activeTab === "dashboard" && <DashboardScreen user={user} avisos={avisos} planos={planos} eventos={eventos} turmas={turmas} />}
        {activeTab === "mural" && <MuralScreen avisos={avisos} user={user} usuarios={usuarios} destinatarios={destinatarios} onAvisoCreated={handleAvisoCreated} onAvisoUpdated={reloadDest} onAvisoDeleted={function() { loadData(user); }} />}
        {activeTab === "chat" && <ChatScreen turmas={turmas} user={user} usuarios={usuarios} />}
        {activeTab === "planos" && <PlanosScreen planos={planos} />}
        {activeTab === "calendario" && <CalendarioScreen eventos={eventos} avisos={avisos} />}
        {activeTab === "checklist" && <ChecklistScreen />}
        {activeTab === "galeria" && <GaleriaScreen user={user} turmas={turmas} />}
      </div>
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: COLORS.white, borderTop: "1px solid " + COLORS.border, display: "flex", justifyContent: "space-around", padding: "6px 4px 20px", zIndex: 50, boxShadow: "0 -4px 20px rgba(0,0,0,0.05)" }}>
        {TABS.map(function(tab) { return (<button key={tab.id} onClick={function() { setActiveTab(tab.id); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: "none", border: "none", padding: "4px 6px", cursor: "pointer", opacity: activeTab === tab.id ? 1 : 0.5 }}><span style={{ fontSize: 20, display: "block", transform: activeTab === tab.id ? "scale(1.15)" : "scale(1)", transition: "transform 0.2s" }} dangerouslySetInnerHTML={{ __html: tab.icon }} /><span style={{ fontSize: 10, fontWeight: activeTab === tab.id ? 700 : 500, color: activeTab === tab.id ? COLORS.blue : COLORS.textMuted }}>{tab.label}</span>{activeTab === tab.id && <div style={{ width: 4, height: 4, borderRadius: "50%", background: COLORS.pink, marginTop: 1 }} />}</button>); })}
      </div>
    </div>
  );
}
