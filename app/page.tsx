"use client";
import { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";

var C = { blue: "#2C5AA0", blueDark: "#1E3F73", blueLight: "#E8EFF8", pink: "#FE4F6B", pinkLight: "#FFF0F2", yellow: "#FFB800", yellowLight: "#FFF8E6", green: "#2ECC71", greenLight: "#EAFAF1", white: "#FFFFFF", bg: "#F5F7FB", text: "#1A2332", muted: "#6B7A90", border: "#E2E8F0" };

var MODULOS = [{ id: "mural", label: "Mural" },{ id: "chat", label: "Chat" },{ id: "planos", label: "Planos" },{ id: "calendario", label: "Calendario" },{ id: "checklist", label: "Checklist" },{ id: "galeria", label: "Galeria" }];

function canView(perms: any[], mod: string) { if (!perms || perms.length === 0) return true; var p = perms.find(function(x: any) { return x.modulo === mod; }); return !p || p.pode_visualizar; }
function canEdit(perms: any[], mod: string) { if (!perms || perms.length === 0) return true; var p = perms.find(function(x: any) { return x.modulo === mod; }); return p ? p.pode_editar : false; }

function SB({ status }: { status: string }) { var c: any = { pendente: { bg: C.yellowLight, color: "#B8860B", l: "Pendente" }, aprovado: { bg: C.greenLight, color: "#1B8A4A", l: "Aprovado" }, revisar: { bg: C.pinkLight, color: C.pink, l: "Revisar" } }; var s = c[status] || c["pendente"]; return <span style={{ background: s.bg, color: s.color, padding: "4px 10px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{s.l}</span>; }

function Msg({ message, onClose }: { message: string; onClose: () => void }) { return (<div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 200, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}><div style={{ background: C.white, borderRadius: 20, padding: "32px 24px", textAlign: "center", maxWidth: 320, width: "100%" }}><div style={{ fontSize: 48, marginBottom: 12 }}>&#9989;</div><h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: "0 0 8px" }}>{message}</h3><button onClick={onClose} style={{ width: "100%", padding: 12, borderRadius: 12, border: "none", background: C.blue, color: C.white, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Ok</button></div></div>); }

function VEModal({ aviso, dest, usuarios, onClose }: any) { var di = dest.filter(function(d: any) { return d.aviso_id === aviso.id; }); var isTodos = di.some(function(d: any) { return d.todos; }); var au = di.filter(function(d: any) { return d.usuario_id; }).map(function(d: any) { var u = usuarios.find(function(u2: any) { return u2.id === d.usuario_id; }); return u ? u.nome : "?"; }); return (<div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 200, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}><div style={{ background: C.white, borderRadius: 20, padding: 20, maxWidth: 380, width: "100%" }}><h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>{aviso.titulo}</h3>{aviso.urgente && <span style={{ fontSize: 11, background: C.pinkLight, color: C.pink, padding: "2px 8px", borderRadius: 6, fontWeight: 600 }}>Urgente</span>}<div style={{ marginTop: 16, marginBottom: 12 }}><div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 4 }}>Data</div>{aviso.data_evento ? <div style={{ fontSize: 14, color: C.blue, fontWeight: 600, background: C.blueLight, padding: "8px 12px", borderRadius: 10, display: "inline-block" }}>&#128197; {new Date(aviso.data_evento + "T12:00:00").toLocaleDateString("pt-BR")}{aviso.hora_evento ? " as " + aviso.hora_evento : ""}</div> : <div style={{ fontSize: 13, color: C.muted }}>Sem data</div>}</div><div style={{ marginBottom: 16 }}><div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 4 }}>Responsaveis</div>{isTodos ? <span style={{ fontSize: 13, color: C.green, fontWeight: 600, background: C.greenLight, padding: "8px 12px", borderRadius: 10 }}>Todos</span> : au.length > 0 ? <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>{au.map(function(n: string, i: number) { return <span key={i} style={{ fontSize: 12, background: C.blueLight, color: C.blue, padding: "4px 10px", borderRadius: 8, fontWeight: 600 }}>{n}</span>; })}</div> : <span style={{ fontSize: 13, color: C.muted }}>Nenhum</span>}</div><button onClick={onClose} style={{ width: "100%", padding: 12, borderRadius: 12, border: "none", background: C.blue, color: C.white, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Fechar</button></div></div>); }

function PasswordForm({ onDone }: { onDone: () => void }) {
  var _a = useState(""); var pw = _a[0]; var setPw = _a[1]; var _b = useState(""); var pw2 = _b[0]; var setPw2 = _b[1]; var _c = useState(""); var err = _c[0]; var setErr = _c[1]; var _d = useState(false); var ld = _d[0]; var setLd = _d[1];
  async function save() {
    if (pw.length < 6) { setErr("Minimo 6 caracteres"); return; }
    if (pw !== pw2) { setErr("Senhas nao conferem"); return; }
    setLd(true); var r = await supabase.auth.updateUser({ password: pw }); setLd(false);
    if (r.error) { setErr(r.error.message); return; }
    if (typeof window !== "undefined") { window.location.hash = ""; }
    onDone();
  }
  return (<div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 300, background: "linear-gradient(145deg, " + C.blue + " 0%, " + C.blueDark + " 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
    <div style={{ background: C.white, borderRadius: 24, padding: "32px 24px", width: "100%", maxWidth: 380 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>Defina sua senha</h2>
      <p style={{ fontSize: 14, color: C.muted, margin: "0 0 24px" }}>Crie uma senha para acessar o Coordinator</p>
      {err && <div style={{ background: C.pinkLight, color: C.pink, padding: "10px 14px", borderRadius: 12, fontSize: 13, fontWeight: 600, marginBottom: 16 }}>{err}</div>}
      <div style={{ marginBottom: 16 }}><label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Nova senha</label><input type="password" value={pw} onChange={function(e) { setPw(e.target.value); }} placeholder="Minimo 6 caracteres" style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "2px solid " + C.border, fontSize: 15, outline: "none", boxSizing: "border-box" }} /></div>
      <div style={{ marginBottom: 24 }}><label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Confirmar senha</label><input type="password" value={pw2} onChange={function(e) { setPw2(e.target.value); }} placeholder="Repita a senha" style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "2px solid " + C.border, fontSize: 15, outline: "none", boxSizing: "border-box" }} /></div>
      <button onClick={save} disabled={ld} style={{ width: "100%", padding: "14px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, " + C.pink + " 0%, #E8405A 100%)", color: C.white, fontSize: 16, fontWeight: 700, cursor: "pointer", opacity: ld ? 0.7 : 1 }}>{ld ? "Salvando..." : "Salvar senha"}</button>
    </div>
  </div>);
}

function LoginScreen({ onLogin }: { onLogin: (user: any) => void }) {
  var _a = useState(""); var email = _a[0]; var setEmail = _a[1]; var _b = useState(""); var pass = _b[0]; var setPass = _b[1]; var _c = useState(""); var err = _c[0]; var setErr = _c[1]; var _d = useState(false); var ld = _d[0]; var setLd = _d[1];
  var _e = useState(false); var showForgot = _e[0]; var setShowForgot = _e[1]; var _f = useState(""); var forgotEmail = _f[0]; var setForgotEmail = _f[1]; var _g = useState(""); var forgotMsg = _g[0]; var setForgotMsg = _g[1]; var _h = useState(false); var forgotLd = _h[0]; var setForgotLd = _h[1];

  async function handleLogin() {
    setErr(""); setLd(true);
    // Try Supabase Auth first
    var authRes = await supabase.auth.signInWithPassword({ email: email, password: pass });
    if (!authRes.error) {
      // Auth success - look up profile
      var profRes = await supabase.from("usuarios").select("*, escolas(nome)").eq("email", email).single();
      setLd(false);
      if (profRes.data) { onLogin(profRes.data); return; }
    }
    // Fallback: legacy login via API
    try {
      var res = await fetch("/api/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "legacy_login", email: email, password: pass }) });
      var data = await res.json();
      if (data.success) {
        // Migrated - now sign in with Supabase Auth
        await supabase.auth.signInWithPassword({ email: email, password: pass });
        var profRes2 = await supabase.from("usuarios").select("*, escolas(nome)").eq("email", email).single();
        setLd(false);
        if (profRes2.data) { onLogin(profRes2.data); return; }
      }
    } catch (e) {}
    setLd(false); setErr("E-mail ou senha incorretos");
  }

  async function handleForgot() {
    if (!forgotEmail.trim()) return;
    setForgotLd(true); setForgotMsg("");
    try {
      var res = await fetch("/api/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "reset_password", email: forgotEmail }) });
      var data = await res.json();
      if (data.success) { setForgotMsg("Link de recuperacao enviado para seu e-mail!"); }
      else { setForgotMsg(data.error || "Erro ao enviar e-mail"); }
    } catch (e) { setForgotMsg("Erro de conexao"); }
    setForgotLd(false);
  }

  return (<div style={{ minHeight: "100vh", background: "linear-gradient(145deg, " + C.blue + " 0%, " + C.blueDark + " 100%)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24 }}>
    <div style={{ textAlign: "center", marginBottom: 40 }}><div style={{ width: 72, height: 72, borderRadius: 20, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}><span style={{ fontSize: 36 }}>&#128203;</span></div><h1 style={{ color: C.white, fontSize: 28, fontWeight: 700, margin: "0 0 4px" }}>Coordinator</h1><p style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, margin: 0, letterSpacing: 1.5, textTransform: "uppercase", fontWeight: 500 }}>by KidFly</p></div>
    <div style={{ background: C.white, borderRadius: 24, padding: "32px 24px", width: "100%", maxWidth: 380 }}>
      {showForgot ? (<div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>Recuperar senha</h2>
        <p style={{ fontSize: 14, color: C.muted, margin: "0 0 24px" }}>Enviaremos um link para seu e-mail</p>
        {forgotMsg && <div style={{ background: forgotMsg.includes("enviado") ? C.greenLight : C.pinkLight, color: forgotMsg.includes("enviado") ? C.green : C.pink, padding: "10px 14px", borderRadius: 12, fontSize: 13, fontWeight: 600, marginBottom: 16 }}>{forgotMsg}</div>}
        <div style={{ marginBottom: 16 }}><label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>E-mail</label><input type="email" value={forgotEmail} onChange={function(e) { setForgotEmail(e.target.value); }} placeholder="seu@email.com" style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "2px solid " + C.border, fontSize: 15, outline: "none", boxSizing: "border-box" }} /></div>
        <button onClick={handleForgot} disabled={forgotLd} style={{ width: "100%", padding: "14px", borderRadius: 14, border: "none", background: C.blue, color: C.white, fontSize: 16, fontWeight: 700, cursor: "pointer", opacity: forgotLd ? 0.7 : 1, marginBottom: 12 }}>{forgotLd ? "Enviando..." : "Enviar link"}</button>
        <button onClick={function() { setShowForgot(false); setForgotMsg(""); }} style={{ width: "100%", padding: "12px", borderRadius: 14, border: "2px solid " + C.border, background: "transparent", color: C.text, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Voltar ao login</button>
      </div>) : (<div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>Bem-vinda! &#128075;</h2>
        <p style={{ fontSize: 14, color: C.muted, margin: "0 0 24px" }}>Entre com seu acesso KidFly</p>
        {err && <div style={{ background: C.pinkLight, color: C.pink, padding: "10px 14px", borderRadius: 12, fontSize: 13, fontWeight: 600, marginBottom: 16 }}>{err}</div>}
        <div style={{ marginBottom: 16 }}><label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>E-mail</label><input type="email" value={email} onChange={function(e) { setEmail(e.target.value); }} placeholder="seu@email.com" style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "2px solid " + C.border, fontSize: 15, outline: "none", boxSizing: "border-box" }} /></div>
        <div style={{ marginBottom: 16 }}><label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Senha</label><input type="password" value={pass} onChange={function(e) { setPass(e.target.value); }} placeholder="********" style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "2px solid " + C.border, fontSize: 15, outline: "none", boxSizing: "border-box" }} /></div>
        <button onClick={function() { setShowForgot(true); setForgotEmail(email); }} style={{ background: "none", border: "none", color: C.blue, fontSize: 13, fontWeight: 600, cursor: "pointer", marginBottom: 16, padding: 0 }}>Esqueci minha senha</button>
        <button onClick={handleLogin} disabled={ld} style={{ width: "100%", padding: "14px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, " + C.pink + " 0%, #E8405A 100%)", color: C.white, fontSize: 16, fontWeight: 700, cursor: "pointer", opacity: ld ? 0.7 : 1 }}>{ld ? "Entrando..." : "Entrar"}</button>
        <p style={{ textAlign: "center", fontSize: 11, color: C.muted, marginTop: 12, background: C.blueLight, padding: "8px", borderRadius: 8 }}>Demo: maria@escola.com / 123456</p>
      </div>)}
    </div>
  </div>);
}

function GestaoScreen({ user, turmas, usuarios, perms, onUpdate }: any) {
  var _a = useState(""); var msg = _a[0]; var setMsg = _a[1]; var _b = useState(false); var stf = _b[0]; var setStf = _b[1]; var _c = useState(""); var nt = _c[0]; var setNt = _c[1]; var _d = useState(0); var nq = _d[0]; var setNq = _d[1]; var _e = useState(""); var np = _e[0]; var setNp = _e[1];
  var _f = useState(false); var spf = _f[0]; var setSpf = _f[1]; var _g = useState(""); var pn = _g[0]; var setPn = _g[1]; var _h = useState(""); var pe = _h[0]; var setPe = _h[1]; var _i = useState("professora"); var pp = _i[0]; var setPp = _i[1]; var _j = useState(false); var inviting = _j[0]; var setInviting = _j[1];
  var _k = useState<any>(null); var et = _k[0]; var setEt = _k[1]; var _l = useState(""); var etn = _l[0]; var setEtn = _l[1]; var _m = useState(0); var etq = _m[0]; var setEtq = _m[1]; var _n = useState(""); var etp = _n[0]; var setEtp = _n[1];
  var _o = useState<Record<string, { v: boolean; e: boolean }>>({}); var modPerms = _o[0]; var setModPerms = _o[1];

  var profs = usuarios.filter(function(u: any) { return u.papel === "professora"; }); var en = user.escolas?.nome || "Escola";

  useEffect(function() {
    var initial: Record<string, { v: boolean; e: boolean }> = {};
    MODULOS.forEach(function(m) { initial[m.id] = { v: true, e: false }; });
    setModPerms(initial);
  }, []);

  function toggleModPerm(mod: string, type: string) {
    setModPerms(function(prev) {
      var cur = prev[mod] || { v: true, e: false };
      if (type === "v") return Object.assign({}, prev, { [mod]: { v: !cur.v, e: !cur.v ? cur.e : false } });
      return Object.assign({}, prev, { [mod]: { v: cur.v, e: !cur.e } });
    });
  }

  async function addTurma() { if (!nt.trim()) return; var d: any = { escola_id: user.escola_id, nome: nt, qtd_alunos: nq }; if (np) d.professora_id = np; await supabase.from("turmas").insert(d); setNt(""); setNq(0); setNp(""); setStf(false); setMsg("Turma adicionada!"); onUpdate(); }
  async function saveTurma() { if (!et) return; await supabase.from("turmas").update({ nome: etn, qtd_alunos: etq, professora_id: etp || null }).eq("id", et.id); setEt(null); setMsg("Turma atualizada!"); onUpdate(); }
  async function delTurma(id: string) { await supabase.from("turmas").delete().eq("id", id); setEt(null); setMsg("Turma removida!"); onUpdate(); }

  async function addProf() {
    if (!pn.trim() || !pe.trim()) return;
    setInviting(true);
    var permsList = MODULOS.map(function(m) { var mp = modPerms[m.id] || { v: true, e: false }; return { modulo: m.id, pode_visualizar: mp.v, pode_editar: mp.e }; });
    try {
      var res = await fetch("/api/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "invite", nome: pn, email: pe, papel: pp, escola_id: user.escola_id, permissoes: permsList }) });
      var data = await res.json();
      if (data.success) { setMsg("Convite enviado para " + pe + "!"); setPn(""); setPe(""); setPp("professora"); setSpf(false); onUpdate(); }
      else { setMsg("Erro: " + (data.error || "Tente novamente")); }
    } catch (e) { setMsg("Erro de conexao"); }
    setInviting(false);
  }

  async function delUser(id: string) { try { await fetch("/api/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "delete_user", usuario_id: id }) }); } catch(e) {} setMsg("Removido!"); onUpdate(); }

  return (<div>
    {msg && <Msg message={msg} onClose={function() { setMsg(""); }} />}
    {et && (<div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 200, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}><div style={{ background: C.white, borderRadius: 20, padding: 20, maxWidth: 380, width: "100%" }}>
      <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: "0 0 16px" }}>Editar turma</h3>
      <input value={etn} onChange={function(e) { setEtn(e.target.value); }} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "2px solid " + C.border, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 10 }} />
      <input type="number" value={etq} onChange={function(e) { setEtq(Number(e.target.value)); }} placeholder="Alunos" style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "2px solid " + C.border, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 10 }} />
      <select value={etp} onChange={function(e) { setEtp(e.target.value); }} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "2px solid " + C.border, fontSize: 14, boxSizing: "border-box", marginBottom: 16, background: C.white }}><option value="">Nenhuma</option>{profs.map(function(p: any) { return <option key={p.id} value={p.id}>{p.nome}</option>; })}</select>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}><button onClick={function() { setEt(null); }} style={{ flex: 1, padding: 10, borderRadius: 10, border: "2px solid " + C.border, background: "transparent", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Cancelar</button><button onClick={saveTurma} style={{ flex: 1, padding: 10, borderRadius: 10, border: "none", background: C.blue, color: C.white, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Salvar</button></div>
      <button onClick={function() { delTurma(et.id); }} style={{ width: "100%", padding: 10, borderRadius: 10, border: "2px solid " + C.pink, background: "transparent", color: C.pink, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>&#128465; Remover</button>
    </div></div>)}

    <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>Gestao da Escola</h2>
    <p style={{ fontSize: 14, color: C.muted, margin: "0 0 24px" }}>{en}</p>

    <div style={{ background: C.white, borderRadius: 16, padding: 16, border: "1px solid " + C.border, marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: 0 }}>Turmas ({turmas.length})</h3><button onClick={function() { setStf(!stf); }} style={{ background: C.blue, color: C.white, border: "none", borderRadius: 10, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{stf ? "X" : "+ Nova"}</button></div>
      {stf && (<div style={{ background: C.bg, borderRadius: 12, padding: 12, marginBottom: 12 }}>
        <input value={nt} onChange={function(e) { setNt(e.target.value); }} placeholder="Nome da turma" style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "2px solid " + C.border, fontSize: 13, outline: "none", boxSizing: "border-box", marginBottom: 8 }} />
        <input type="number" value={nq || ""} onChange={function(e) { setNq(Number(e.target.value)); }} placeholder="Qtd alunos" style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "2px solid " + C.border, fontSize: 13, outline: "none", boxSizing: "border-box", marginBottom: 8 }} />
        <select value={np} onChange={function(e) { setNp(e.target.value); }} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "2px solid " + C.border, fontSize: 13, boxSizing: "border-box", marginBottom: 8, background: C.white }}><option value="">Professora</option>{profs.map(function(p: any) { return <option key={p.id} value={p.id}>{p.nome}</option>; })}</select>
        <button onClick={addTurma} style={{ width: "100%", padding: 8, borderRadius: 8, border: "none", background: C.green, color: C.white, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Adicionar</button>
      </div>)}
      {turmas.map(function(t: any) { return (<div key={t.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderTop: "1px solid " + C.border }}><div><div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{t.nome}</div><div style={{ fontSize: 12, color: C.muted }}>{t.usuarios?.nome ? "Prof. " + t.usuarios.nome : "Sem prof."} - {t.qtd_alunos} alunos</div></div><button onClick={function() { setEt(t); setEtn(t.nome); setEtq(t.qtd_alunos || 0); setEtp(t.professora_id || ""); }} style={{ padding: "4px 10px", borderRadius: 8, border: "none", background: C.blueLight, fontSize: 11, fontWeight: 600, color: C.blue, cursor: "pointer" }}>Editar</button></div>); })}
    </div>

    <div style={{ background: C.white, borderRadius: 16, padding: 16, border: "1px solid " + C.border }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}><h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: 0 }}>Equipe ({usuarios.length})</h3><button onClick={function() { setSpf(!spf); }} style={{ background: C.blue, color: C.white, border: "none", borderRadius: 10, padding: "6px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{spf ? "X" : "+ Convidar"}</button></div>
      {spf && (<div style={{ background: C.bg, borderRadius: 12, padding: 12, marginBottom: 12 }}>
        <input value={pn} onChange={function(e) { setPn(e.target.value); }} placeholder="Nome completo" style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "2px solid " + C.border, fontSize: 13, outline: "none", boxSizing: "border-box", marginBottom: 8 }} />
        <input type="email" value={pe} onChange={function(e) { setPe(e.target.value); }} placeholder="E-mail" style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "2px solid " + C.border, fontSize: 13, outline: "none", boxSizing: "border-box", marginBottom: 8 }} />
        <select value={pp} onChange={function(e) { setPp(e.target.value); }} style={{ width: "100%", padding: "8px 12px", borderRadius: 8, border: "2px solid " + C.border, fontSize: 13, boxSizing: "border-box", marginBottom: 12, background: C.white }}><option value="professora">Professora</option><option value="coordenadora">Coordenadora</option><option value="diretora">Diretora</option><option value="administrativo">Administrativo</option></select>

        <label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "block", marginBottom: 8 }}>Permissoes por modulo:</label>
        <div style={{ border: "1px solid " + C.border, borderRadius: 10, overflow: "hidden", marginBottom: 12 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 70px 70px", padding: "8px 10px", background: C.blueLight, fontSize: 11, fontWeight: 600, color: C.blue }}>
            <span>Modulo</span><span style={{ textAlign: "center" }}>Ver</span><span style={{ textAlign: "center" }}>Editar</span>
          </div>
          {MODULOS.map(function(m) {
            var mp = modPerms[m.id] || { v: true, e: false };
            return (<div key={m.id} style={{ display: "grid", gridTemplateColumns: "1fr 70px 70px", padding: "8px 10px", borderTop: "1px solid " + C.border, alignItems: "center" }}>
              <span style={{ fontSize: 13, color: C.text }}>{m.label}</span>
              <div style={{ textAlign: "center" }}><div onClick={function() { toggleModPerm(m.id, "v"); }} style={{ width: 22, height: 22, borderRadius: 6, border: "2px solid " + (mp.v ? C.green : C.border), background: mp.v ? C.green : "transparent", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>{mp.v && <span style={{ color: C.white, fontSize: 12, fontWeight: 700 }}>&#10003;</span>}</div></div>
              <div style={{ textAlign: "center" }}><div onClick={function() { toggleModPerm(m.id, "e"); }} style={{ width: 22, height: 22, borderRadius: 6, border: "2px solid " + (mp.e ? C.blue : C.border), background: mp.e ? C.blue : "transparent", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>{mp.e && <span style={{ color: C.white, fontSize: 12, fontWeight: 700 }}>&#10003;</span>}</div></div>
            </div>);
          })}
        </div>

        <button onClick={addProf} disabled={inviting} style={{ width: "100%", padding: 8, borderRadius: 8, border: "none", background: C.green, color: C.white, fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: inviting ? 0.7 : 1 }}>{inviting ? "Enviando convite..." : "&#9993; Enviar convite por e-mail"}</button>
      </div>)}
      {usuarios.map(function(u: any) { var me = u.id === user.id; return (<div key={u.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderTop: "1px solid " + C.border }}><div><div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{u.nome} {me ? "(voce)" : ""}</div><div style={{ fontSize: 12, color: C.muted }}>{u.email} - {u.papel}</div></div>{!me && <button onClick={function() { delUser(u.id); }} style={{ padding: "4px 10px", borderRadius: 8, border: "none", background: C.pinkLight, fontSize: 11, fontWeight: 600, color: C.pink, cursor: "pointer" }}>Remover</button>}</div>); })}
    </div>
  </div>);
}

function DashboardScreen({ user, avisos, planos, eventos, turmas }: any) {
  var nf = user.nome.split(" ")[0]; var en = user.escolas?.nome || "Escola";
  var pend = planos.filter(function(p: any) { return p.status === "pendente"; }).length;
  var allEv = [...eventos, ...avisos.filter(function(a: any) { return a.data_evento; }).map(function(a: any) { return { id: "a-" + a.id, titulo: a.titulo, data: a.data_evento, cor: a.urgente ? C.pink : C.blue }; })].sort(function(a: any, b: any) { return a.data > b.data ? 1 : -1; });
  return (<div>
    <div style={{ marginBottom: 24 }}><h2 style={{ fontSize: 22, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>Bom dia, {nf}! &#9728;&#65039;</h2><p style={{ fontSize: 14, color: C.muted, margin: 0 }}>{en}</p></div>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>{[{ l: "Pendentes", v: String(pend), i: "&#128221;", bg: C.yellowLight },{ l: "Avisos", v: String(avisos.length), i: "&#128226;", bg: C.pinkLight },{ l: "Eventos", v: String(allEv.length), i: "&#128197;", bg: C.blueLight },{ l: "Equipe", v: String(turmas.length), i: "&#128105;&#8205;&#127979;", bg: C.greenLight }].map(function(s, i) { return (<div key={i} style={{ background: C.white, borderRadius: 16, padding: 16, border: "1px solid " + C.border }}><div style={{ width: 40, height: 40, borderRadius: 12, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 10 }} dangerouslySetInnerHTML={{ __html: s.i }} /><div style={{ fontSize: 24, fontWeight: 700, color: C.text }}>{s.v}</div><div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{s.l}</div></div>); })}</div>
    <div style={{ background: C.white, borderRadius: 16, padding: 16, border: "1px solid " + C.border, marginBottom: 16 }}><h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: "0 0 12px" }}>Planos recentes</h3>{planos.slice(0, 3).map(function(p: any) { return (<div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderTop: "1px solid " + C.border }}><div><div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{p.titulo}</div><div style={{ fontSize: 12, color: C.muted }}>{p.turmas?.nome}</div></div><SB status={p.status} /></div>); })}</div>
    <div style={{ background: C.white, borderRadius: 16, padding: 16, border: "1px solid " + C.border }}><h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: "0 0 12px" }}>Agenda</h3>{allEv.slice(0, 4).map(function(ev: any) { return (<div key={ev.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderTop: "1px solid " + C.border }}><div style={{ width: 4, height: 36, borderRadius: 4, background: ev.cor, flexShrink: 0 }} /><div><div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{ev.titulo}</div><div style={{ fontSize: 12, color: C.muted }}>{new Date(ev.data + "T12:00:00").toLocaleDateString("pt-BR")}</div></div></div>); })}</div>
  </div>);
}

function MuralScreen({ avisos, user, usuarios, dest, perms, onAC, onAU, onAD }: any) {
  var _a = useState(avisos); var lista = _a[0]; var setLista = _a[1]; var _b = useState(false); var sf = _b[0]; var setSf = _b[1]; var _c = useState(""); var tit = _c[0]; var setTit = _c[1]; var _d = useState(false); var urg = _d[0]; var setUrg = _d[1]; var _e = useState(""); var de = _e[0]; var setDe = _e[1]; var _f = useState("todos"); var atr = _f[0]; var setAtr = _f[1]; var _g = useState<string[]>([]); var su = _g[0]; var setSu = _g[1]; var _h = useState(""); var msg = _h[0]; var setMsg = _h[1]; var _i = useState<any>(null); var ed = _i[0]; var setEd = _i[1]; var _j = useState(""); var et = _j[0]; var setEt = _j[1]; var _k = useState(""); var edt = _k[0]; var setEdt = _k[1]; var _l = useState(false); var eu = _l[0]; var setEu = _l[1]; var _m = useState("todos"); var ea = _m[0]; var setEa = _m[1]; var _n = useState<string[]>([]); var esu = _n[0]; var setEsu = _n[1]; var _o = useState<any>(null); var vw = _o[0]; var setVw = _o[1];
  var _p = useState(""); var he = _p[0]; var setHe = _p[1]; var _q = useState(""); var edh = _q[0]; var setEdh = _q[1];
  var ce = canEdit(perms, "mural"); var ou = usuarios.filter(function(u: any) { return u.id !== user.id; });
  async function criar() { if (!tit.trim()) return; var d: any = { escola_id: user.escola_id, autor_id: user.id, titulo: tit, urgente: urg }; if (de) d.data_evento = de; if (he) d.hora_evento = he; var r = await supabase.from("avisos").insert(d).select().single(); if (r.data) { if (atr === "todos") await supabase.from("aviso_destinatarios").insert({ aviso_id: r.data.id, todos: true }); else { var ds = su.map(function(uid) { return { aviso_id: r.data.id, usuario_id: uid, todos: false }; }); if (ds.length > 0) await supabase.from("aviso_destinatarios").insert(ds); } setLista([r.data, ...lista]); setTit(""); setDe(""); setHe(""); setUrg(false); setAtr("todos"); setSu([]); setSf(false); setMsg("Publicado!"); if (onAC) onAC(r.data); } }
  function startEd(a: any) { setEd(a); setEt(a.titulo); setEdt(a.data_evento || ""); setEdh(a.hora_evento || ""); setEu(a.urgente); var di = dest.filter(function(d: any) { return d.aviso_id === a.id; }); if (di.some(function(d: any) { return d.todos; })) { setEa("todos"); setEsu([]); } else { setEa("selecionar"); setEsu(di.filter(function(d: any) { return d.usuario_id; }).map(function(d: any) { return d.usuario_id; })); } }
  async function salvar() { if (!ed) return; var ud: any = { titulo: et, urgente: eu, data_evento: edt || null, hora_evento: edh || null }; await supabase.from("avisos").update(ud).eq("id", ed.id); await supabase.from("aviso_destinatarios").delete().eq("aviso_id", ed.id); if (ea === "todos") await supabase.from("aviso_destinatarios").insert({ aviso_id: ed.id, todos: true }); else { var ds = esu.map(function(uid) { return { aviso_id: ed.id, usuario_id: uid, todos: false }; }); if (ds.length > 0) await supabase.from("aviso_destinatarios").insert(ds); } setLista(lista.map(function(a: any) { return a.id === ed.id ? Object.assign({}, a, ud) : a; })); setEd(null); setMsg("Atualizado!"); if (onAU) onAU(); }
  async function excluir() { if (!ed) return; await supabase.from("aviso_destinatarios").delete().eq("aviso_id", ed.id); await supabase.from("avisos").delete().eq("id", ed.id); setLista(lista.filter(function(a: any) { return a.id !== ed.id; })); setEd(null); setMsg("Excluido!"); if (onAD) onAD(); }
  function tog(uid: string, s: string[], ss: any) { if (s.includes(uid)) ss(s.filter(function(id) { return id !== uid; })); else ss([...s, uid]); }
  function US({ users, sel, onT }: any) { return (<div style={{ marginBottom: 12, maxHeight: 120, overflowY: "auto", border: "1px solid " + C.border, borderRadius: 10, padding: 8 }}>{users.map(function(u: any) { var s = sel.includes(u.id); return (<div key={u.id} onClick={function() { onT(u.id); }} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 4px", cursor: "pointer", borderBottom: "1px solid " + C.border }}><div style={{ width: 22, height: 22, borderRadius: 6, border: "2px solid " + (s ? C.green : C.border), background: s ? C.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s && <span style={{ color: C.white, fontSize: 12, fontWeight: 700 }}>&#10003;</span>}</div><div><div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{u.nome}</div><div style={{ fontSize: 11, color: C.muted }}>{u.papel}</div></div></div>); })}</div>); }
  return (<div>
    {msg && <Msg message={msg} onClose={function() { setMsg(""); }} />}{vw && <VEModal aviso={vw} dest={dest} usuarios={usuarios} onClose={function() { setVw(null); }} />}
    {ed && (<div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 200, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}><div style={{ background: C.white, borderRadius: 20, padding: 20, maxWidth: 380, width: "100%", maxHeight: "85vh", overflowY: "auto" }}><h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: "0 0 16px" }}>Editar</h3><input value={et} onChange={function(e) { setEt(e.target.value); }} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "2px solid " + C.border, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 10 }} /><label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Data</label><input type="date" value={edt} onChange={function(e) { setEdt(e.target.value); }} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "2px solid " + C.border, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 10 }} /><label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Horario</label><input type="time" value={edh} onChange={function(e) { setEdh(e.target.value); }} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "2px solid " + C.border, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 12 }} /><label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "block", marginBottom: 8 }}>Atribuir:</label><div style={{ display: "flex", gap: 8, marginBottom: 12 }}><button onClick={function() { setEa("todos"); setEsu([]); }} style={{ flex: 1, padding: "8px", borderRadius: 10, border: "none", background: ea === "todos" ? C.blue : C.blueLight, color: ea === "todos" ? C.white : C.blue, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Todos</button><button onClick={function() { setEa("selecionar"); }} style={{ flex: 1, padding: "8px", borderRadius: 10, border: "none", background: ea === "selecionar" ? C.blue : C.blueLight, color: ea === "selecionar" ? C.white : C.blue, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Selecionar</button></div>{ea === "selecionar" && <US users={ou} sel={esu} onT={function(uid: string) { tog(uid, esu, setEsu); }} />}<div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}><div onClick={function() { setEu(!eu); }} style={{ width: 22, height: 22, borderRadius: 6, border: "2px solid " + (eu ? C.pink : C.border), background: eu ? C.pink : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>{eu && <span style={{ color: C.white, fontSize: 12, fontWeight: 700 }}>&#10003;</span>}</div><span style={{ fontSize: 13, color: C.text }}>Urgente</span></div><div style={{ display: "flex", gap: 8, marginBottom: 10 }}><button onClick={function() { setEd(null); }} style={{ flex: 1, padding: 10, borderRadius: 10, border: "2px solid " + C.border, background: "transparent", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Cancelar</button><button onClick={salvar} style={{ flex: 1, padding: 10, borderRadius: 10, border: "none", background: C.blue, color: C.white, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Salvar</button></div><button onClick={excluir} style={{ width: "100%", padding: 10, borderRadius: 10, border: "2px solid " + C.pink, background: "transparent", color: C.pink, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>&#128465; Excluir</button></div></div>)}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}><h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: 0 }}>Mural</h2>{ce && <button onClick={function() { setSf(!sf); }} style={{ background: C.pink, color: C.white, border: "none", borderRadius: 12, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{sf ? "X" : "+ Novo"}</button>}</div>
    {sf && (<div style={{ background: C.white, borderRadius: 16, padding: 16, marginBottom: 16, border: "1px solid " + C.border }}><input value={tit} onChange={function(e) { setTit(e.target.value); }} placeholder="Titulo..." style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "2px solid " + C.border, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 10 }} /><label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Data (opcional)</label><input type="date" value={de} onChange={function(e) { setDe(e.target.value); }} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "2px solid " + C.border, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 10 }} /><label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Horario (opcional)</label><input type="time" value={he} onChange={function(e) { setHe(e.target.value); }} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "2px solid " + C.border, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 12 }} /><label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "block", marginBottom: 8 }}>Atribuir:</label><div style={{ display: "flex", gap: 8, marginBottom: 12 }}><button onClick={function() { setAtr("todos"); setSu([]); }} style={{ flex: 1, padding: "8px", borderRadius: 10, border: "none", background: atr === "todos" ? C.blue : C.blueLight, color: atr === "todos" ? C.white : C.blue, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Todos</button><button onClick={function() { setAtr("selecionar"); }} style={{ flex: 1, padding: "8px", borderRadius: 10, border: "none", background: atr === "selecionar" ? C.blue : C.blueLight, color: atr === "selecionar" ? C.white : C.blue, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Selecionar</button></div>{atr === "selecionar" && <US users={ou} sel={su} onT={function(uid: string) { tog(uid, su, setSu); }} />}<div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}><div onClick={function() { setUrg(!urg); }} style={{ width: 22, height: 22, borderRadius: 6, border: "2px solid " + (urg ? C.pink : C.border), background: urg ? C.pink : "transparent", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>{urg && <span style={{ color: C.white, fontSize: 12, fontWeight: 700 }}>&#10003;</span>}</div><span style={{ fontSize: 13, color: C.text }}>Urgente</span></div><button onClick={criar} style={{ width: "100%", padding: 10, borderRadius: 10, border: "none", background: C.blue, color: C.white, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Publicar</button></div>)}
    {lista.length === 0 && <p style={{ fontSize: 13, color: C.muted, textAlign: "center", marginTop: 40 }}>Nenhum aviso</p>}
    {lista.map(function(av: any) { return (<div key={av.id} style={{ background: C.white, borderRadius: 16, padding: 16, marginBottom: 12, border: "1px solid " + (av.urgente ? C.pink + "33" : C.border), borderLeft: av.urgente ? "4px solid " + C.pink : "4px solid " + C.border }}><h3 style={{ fontSize: 15, fontWeight: 600, color: C.text, margin: "0 0 6px" }}>{av.urgente && <span style={{ color: C.pink, marginRight: 6 }}>&#9679;</span>}{av.titulo}</h3><div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center", marginBottom: 10 }}><span style={{ fontSize: 12, color: C.muted }}>{new Date(av.created_at).toLocaleDateString("pt-BR")}</span>{av.data_evento && <span style={{ fontSize: 11, background: C.blueLight, color: C.blue, padding: "2px 8px", borderRadius: 6, fontWeight: 600 }}>&#128197; {new Date(av.data_evento + "T12:00:00").toLocaleDateString("pt-BR")}{av.hora_evento ? " - " + av.hora_evento : ""}</span>}</div><div style={{ display: "flex", gap: 8 }}><button onClick={function() { setVw(av); }} style={{ flex: 1, padding: "6px 12px", borderRadius: 8, border: "1px solid " + C.border, background: C.white, fontSize: 12, fontWeight: 600, color: C.blue, cursor: "pointer" }}>&#128065; Ver</button>{ce && <button onClick={function() { startEd(av); }} style={{ padding: "6px 12px", borderRadius: 8, border: "none", background: C.blueLight, fontSize: 12, fontWeight: 600, color: C.blue, cursor: "pointer" }}>&#9998; Editar</button>}</div></div>); })}
  </div>);
}

function ChatScreen({ turmas, user, usuarios }: any) {
  var _a = useState<any>(null); var at = _a[0]; var setAt = _a[1]; var _b = useState<any[]>([]); var ms = _b[0]; var setMs = _b[1]; var _c = useState(""); var nm = _c[0]; var setNm = _c[1]; var _d = useState(false); var ld = _d[0]; var setLd = _d[1]; var _e = useState(false); var sn = _e[0]; var setSn = _e[1]; var sr = useRef<HTMLDivElement>(null);
  function gn(uid: string) { var u = usuarios.find(function(u2: any) { return u2.id === uid; }); return u ? u.nome : "?"; }
  function gi(uid: string) { var n = gn(uid); var p = n.split(" "); return p.length >= 2 ? p[0][0] + p[1][0] : n.substring(0, 2); }
  async function oc(t: any) { setAt(t); setLd(true); var r = await supabase.from("mensagens").select("*").eq("turma_id", t.id).order("created_at", { ascending: true }); setMs(r.data || []); setLd(false); }
  useEffect(function() { if (!at) return; var ch = supabase.channel("c-" + at.id).on("postgres_changes", { event: "INSERT", schema: "public", table: "mensagens", filter: "turma_id=eq." + at.id }, function(p: any) { setMs(function(prev) { if (prev.find(function(m) { return m.id === p.new.id; })) return prev; return [...prev, p.new]; }); }).subscribe(); return function() { supabase.removeChannel(ch); }; }, [at]);
  useEffect(function() { if (sr.current) sr.current.scrollTop = sr.current.scrollHeight; }, [ms]);
  async function send() { if (!nm.trim() || !at || sn) return; setSn(true); await supabase.from("mensagens").insert({ turma_id: at.id, autor_id: user.id, conteudo: nm.trim() }); setNm(""); setSn(false); }
  if (at) return (<div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 160px)" }}><div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}><button onClick={function() { setAt(null); setMs([]); }} style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid " + C.border, background: C.white, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>&#9664;</button><div><h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: 0 }}>{at.nome}</h3><div style={{ fontSize: 12, color: C.muted }}>{at.usuarios?.nome ? "Prof. " + at.usuarios.nome : ""}</div></div></div><div ref={sr} style={{ flex: 1, overflowY: "auto", background: C.white, borderRadius: 16, padding: 16, border: "1px solid " + C.border, marginBottom: 12 }}>{ld && <p style={{ fontSize: 13, color: C.muted, textAlign: "center" }}>Carregando...</p>}{!ld && ms.length === 0 && <p style={{ fontSize: 13, color: C.muted, textAlign: "center", marginTop: 40 }}>Nenhuma mensagem.</p>}{ms.map(function(m: any) { var me = m.autor_id === user.id; var tm = new Date(m.created_at).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }); return (<div key={m.id} style={{ display: "flex", flexDirection: me ? "row-reverse" : "row", gap: 8, marginBottom: 12, alignItems: "flex-end" }}>{!me && <div style={{ width: 32, height: 32, borderRadius: 10, background: C.blueLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: C.blue, flexShrink: 0 }}>{gi(m.autor_id)}</div>}<div style={{ maxWidth: "75%" }}>{!me && <div style={{ fontSize: 11, fontWeight: 600, color: C.blue, marginBottom: 2, paddingLeft: 4 }}>{gn(m.autor_id)}</div>}<div style={{ background: me ? C.blue : C.bg, color: me ? C.white : C.text, padding: "10px 14px", borderRadius: me ? "16px 16px 4px 16px" : "16px 16px 16px 4px", fontSize: 14, lineHeight: "1.4" }}>{m.conteudo}</div><div style={{ fontSize: 10, color: C.muted, marginTop: 2, textAlign: me ? "right" : "left", padding: "0 4px" }}>{tm}</div></div></div>); })}</div><div style={{ display: "flex", gap: 8 }}><input value={nm} onChange={function(e) { setNm(e.target.value); }} onKeyDown={function(e) { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }} placeholder="Mensagem..." style={{ flex: 1, padding: "12px 16px", borderRadius: 14, border: "2px solid " + C.border, fontSize: 14, outline: "none", boxSizing: "border-box" }} /><button onClick={send} disabled={sn || !nm.trim()} style={{ width: 48, height: 48, borderRadius: 14, border: "none", background: C.blue, color: C.white, fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", opacity: sn || !nm.trim() ? 0.5 : 1, flexShrink: 0 }}>&#10148;</button></div></div>);
  return (<div><h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: "0 0 20px" }}>Chat por Turma</h2>{turmas.map(function(t: any) { return (<div key={t.id} onClick={function() { oc(t); }} style={{ background: C.white, borderRadius: 16, padding: 16, marginBottom: 12, border: "1px solid " + C.border, cursor: "pointer" }}><div style={{ display: "flex", alignItems: "center", gap: 12 }}><div style={{ width: 48, height: 48, borderRadius: 14, background: C.blueLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>{t.nome.includes("Ber") ? "&#127868;" : t.nome.includes("Mat") ? "&#129528;" : "&#127912;"}</div><div style={{ flex: 1 }}><h3 style={{ fontSize: 15, fontWeight: 600, color: C.text, margin: 0 }}>{t.nome}</h3><div style={{ fontSize: 13, color: C.muted }}>{t.usuarios?.nome ? "Prof. " + t.usuarios.nome : ""} - {t.qtd_alunos} alunos</div></div><div style={{ width: 32, height: 32, borderRadius: 8, background: C.blueLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: C.blue }}>&#9654;</div></div></div>); })}</div>);
}

function PlanosScreen({ planos: init, perms }: any) {
  var _a = useState(init); var pl = _a[0]; var setPl = _a[1]; var _b = useState("todos"); var fi = _b[0]; var setFi = _b[1]; var _c = useState<string | null>(null); var fbi = _c[0]; var setFbi = _c[1]; var _d = useState(""); var fbt = _d[0]; var setFbt = _d[1];
  var ce = canEdit(perms, "planos"); var filt = fi === "todos" ? pl : pl.filter(function(p: any) { return p.status === fi; });
  async function upd(id: string, st: string, fb?: string) { var d: any = { status: st }; if (fb) d.feedback = fb; await supabase.from("planos").update(d).eq("id", id); setPl(pl.map(function(p: any) { return p.id === id ? Object.assign({}, p, d) : p; })); setFbi(null); setFbt(""); }
  return (<div><h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: "0 0 16px" }}>Planos de Aula</h2><div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto" }}>{[{ k: "todos", l: "Todos" },{ k: "pendente", l: "Pendentes" },{ k: "aprovado", l: "Aprovados" },{ k: "revisar", l: "Revisar" }].map(function(f) { return <button key={f.k} onClick={function() { setFi(f.k); }} style={{ padding: "8px 16px", borderRadius: 20, border: "none", background: fi === f.k ? C.blue : C.blueLight, color: fi === f.k ? C.white : C.blue, fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>{f.l}</button>; })}</div>{filt.length === 0 && <p style={{ fontSize: 13, color: C.muted, textAlign: "center", marginTop: 40 }}>Nenhum plano</p>}{filt.map(function(p: any) { return (<div key={p.id} style={{ background: C.white, borderRadius: 16, padding: 16, marginBottom: 12, border: "1px solid " + C.border }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}><div><h3 style={{ fontSize: 15, fontWeight: 600, color: C.text, margin: "0 0 2px" }}>{p.titulo}</h3><span style={{ fontSize: 13, color: C.muted }}>{p.turmas?.nome}</span></div><SB status={p.status} /></div>{p.feedback && p.status === "revisar" && <div style={{ background: C.yellowLight, borderRadius: 10, padding: "8px 12px", marginTop: 8 }}><div style={{ fontSize: 11, fontWeight: 600, color: "#B8860B", marginBottom: 2 }}>Ajustes:</div><div style={{ fontSize: 13, color: C.text }}>{p.feedback}</div></div>}{p.status === "pendente" && ce && (<div>{fbi === p.id ? (<div style={{ marginTop: 12 }}><textarea value={fbt} onChange={function(e) { setFbt(e.target.value); }} placeholder="Descreva os ajustes..." style={{ width: "100%", minHeight: 70, padding: 10, borderRadius: 10, border: "2px solid " + C.yellow, fontSize: 13, outline: "none", boxSizing: "border-box", marginBottom: 8, resize: "vertical" }} /><div style={{ display: "flex", gap: 8 }}><button onClick={function() { setFbi(null); setFbt(""); }} style={{ flex: 1, padding: "8px", borderRadius: 10, border: "2px solid " + C.border, background: "transparent", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancelar</button><button onClick={function() { upd(p.id, "revisar", fbt); }} style={{ flex: 1, padding: "8px", borderRadius: 10, border: "none", background: C.yellow, color: C.white, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Enviar</button></div></div>) : (<div style={{ display: "flex", gap: 8, marginTop: 12 }}><button onClick={function() { upd(p.id, "aprovado"); }} style={{ flex: 1, padding: "8px", borderRadius: 10, border: "none", background: C.green, color: C.white, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>&#10003; Aprovar</button><button onClick={function() { setFbi(p.id); }} style={{ flex: 1, padding: "8px", borderRadius: 10, border: "2px solid " + C.yellow, background: "transparent", color: "#B8860B", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>&#8635; Ajuste</button></div>)}</div>)}</div>); })}</div>);
}

function CalendarioScreen({ eventos, avisos }: any) {
  var today = new Date(); var _a = useState(today.getMonth()); var cm = _a[0]; var setCm = _a[1]; var _b = useState(today.getFullYear()); var cy = _b[0]; var setCy = _b[1];
  var all = [...eventos, ...avisos.filter(function(a: any) { return a.data_evento; }).map(function(a: any) { return { id: "a-" + a.id, titulo: a.titulo, data: a.data_evento, cor: a.urgente ? C.pink : C.blue, fm: true }; })].sort(function(a: any, b: any) { return a.data > b.data ? 1 : -1; });
  var dates = all.map(function(e: any) { return e.data; }); var dim = new Date(cy, cm + 1, 0).getDate(); var fd = new Date(cy, cm, 1).getDay();
  var mn = ["Janeiro","Fevereiro","Marco","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];
  function prev() { if (cm === 0) { setCm(11); setCy(cy - 1); } else setCm(cm - 1); } function next() { if (cm === 11) { setCm(0); setCy(cy + 1); } else setCm(cm + 1); }
  var mp = cy + "-" + String(cm + 1).padStart(2, "0"); var me = all.filter(function(e: any) { return e.data.startsWith(mp); });
  return (<div><h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: "0 0 20px" }}>Calendario</h2><div style={{ background: C.white, borderRadius: 16, padding: 16, border: "1px solid " + C.border, marginBottom: 20 }}><div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}><button onClick={prev} style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid " + C.border, background: C.white, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>&#9664;</button><h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: 0 }}>{mn[cm]} {cy}</h3><button onClick={next} style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid " + C.border, background: C.white, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>&#9654;</button></div><div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, textAlign: "center" }}>{["D","S","T","Q","Q","S","S"].map(function(d, i) { return <div key={i} style={{ fontSize: 11, color: C.muted, fontWeight: 600, padding: 4 }}>{d}</div>; })}{Array.from({ length: fd }, function(_, i) { return <div key={"e" + i} />; })}{Array.from({ length: dim }, function(_, i) { var day = i + 1; var ds = cy + "-" + String(cm + 1).padStart(2, "0") + "-" + String(day).padStart(2, "0"); var he = dates.includes(ds); var it = day === today.getDate() && cm === today.getMonth() && cy === today.getFullYear(); return <div key={day} style={{ padding: "6px 2px", borderRadius: 8, fontSize: 13, fontWeight: it ? 700 : 400, background: it ? C.blue : he ? C.pinkLight : "transparent", color: it ? C.white : he ? C.pink : C.text }}>{day}</div>; })}</div></div><h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: "0 0 12px" }}>Eventos de {mn[cm]}</h3>{me.length === 0 && <p style={{ fontSize: 13, color: C.muted }}>Nenhum evento</p>}{me.map(function(ev: any) { return (<div key={ev.id} style={{ background: C.white, borderRadius: 14, padding: 14, marginBottom: 10, display: "flex", alignItems: "center", gap: 12, border: "1px solid " + C.border }}><div style={{ width: 44, height: 44, borderRadius: 12, background: ev.cor + "18", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><div style={{ width: 10, height: 10, borderRadius: "50%", background: ev.cor }} /></div><div style={{ flex: 1 }}><div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{ev.titulo}</div><div style={{ display: "flex", gap: 6 }}><span style={{ fontSize: 12, color: C.muted }}>{new Date(ev.data + "T12:00:00").toLocaleDateString("pt-BR")}</span>{ev.fm && <span style={{ fontSize: 10, background: C.yellowLight, color: "#B8860B", padding: "1px 6px", borderRadius: 4, fontWeight: 600 }}>Mural</span>}</div></div></div>); })}</div>);
}

function ChecklistScreen({ user, turmas, perms }: any) {
  var _a = useState<any[]>([]); var visitas = _a[0]; var setVisitas = _a[1];
  var _b = useState(false); var ldV = _b[0]; var setLdV = _b[1];
  var _c = useState(false); var showNew = _c[0]; var setShowNew = _c[1];
  var _d = useState(""); var selTurma = _d[0]; var setSelTurma = _d[1];
  var _e = useState<any[]>([]); var items = _e[0]; var setItems = _e[1];
  var _f = useState(""); var comentario = _f[0]; var setComentario = _f[1];
  var _g = useState(false); var saving = _g[0]; var setSaving = _g[1];
  var _h = useState(""); var msg = _h[0]; var setMsg = _h[1];
  var _i = useState<any>(null); var viewing = _i[0]; var setViewing = _i[1];
  var _j = useState<any[]>([]); var viewItems = _j[0]; var setViewItems = _j[1];
  var _k = useState<any[]>([]); var modelo = _k[0]; var setModelo = _k[1];
  var ce = canEdit(perms, "checklist");

  useEffect(function() {
    setLdV(true);
    Promise.all([
      supabase.from("checklists").select("*, turmas(nome)").eq("autor_id", user.id).order("created_at", { ascending: false }),
      supabase.from("checklist_modelo").select("*").eq("escola_id", user.escola_id).order("ordem", { ascending: true })
    ]).then(function(r) { setVisitas(r[0].data || []); setModelo(r[1].data || []); setLdV(false); });
  }, []);

  function startNew() {
    setShowNew(true);
    setItems(modelo.map(function(m: any) { return { texto: m.texto, marcado: false }; }));
    setComentario(""); setSelTurma("");
  }

  async function salvarVisita() {
    if (!selTurma || saving) return;
    setSaving(true);
    var cr = await supabase.from("checklists").insert({ turma_id: selTurma, autor_id: user.id, comentario: comentario || null }).select("*, turmas(nome)").single();
    if (cr.data) {
      var itens = items.map(function(it: any) { return { checklist_id: cr.data.id, texto: it.texto, marcado: it.marcado }; });
      await supabase.from("checklist_itens").insert(itens);
      setVisitas([cr.data, ...visitas]); setShowNew(false); setMsg("Visita salva com sucesso!");
    }
    setSaving(false);
  }

  async function openVisita(v: any) {
    setViewing(v);
    var r = await supabase.from("checklist_itens").select("*").eq("checklist_id", v.id);
    setViewItems(r.data || []);
  }

  async function deleteVisita(v: any) {
    await supabase.from("checklist_itens").delete().eq("checklist_id", v.id);
    await supabase.from("checklists").delete().eq("id", v.id);
    setVisitas(visitas.filter(function(x: any) { return x.id !== v.id; }));
    setViewing(null); setMsg("Visita excluida!");
  }

  if (viewing) {
    var marcados = viewItems.filter(function(i: any) { return i.marcado; }).length;
    return (<div>
      {msg && <Msg message={msg} onClose={function() { setMsg(""); }} />}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button onClick={function() { setViewing(null); }} style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid " + C.border, background: C.white, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>&#9664;</button>
        <div><h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: 0 }}>Visita - {viewing.turmas?.nome}</h2><div style={{ fontSize: 12, color: C.muted }}>{new Date(viewing.created_at).toLocaleDateString("pt-BR")}</div></div>
      </div>
      <div style={{ background: C.white, borderRadius: 16, padding: 16, border: "1px solid " + C.border, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Itens observados</span>
          <div style={{ background: C.blueLight, color: C.blue, padding: "4px 10px", borderRadius: 8, fontSize: 13, fontWeight: 700 }}>{marcados}/{viewItems.length}</div>
        </div>
        {viewItems.map(function(it: any) { return (<div key={it.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderTop: "1px solid " + C.border }}>
          <div style={{ width: 24, height: 24, borderRadius: 8, border: "2px solid " + (it.marcado ? C.green : C.border), background: it.marcado ? C.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{it.marcado && <span style={{ color: C.white, fontSize: 14, fontWeight: 700 }}>&#10003;</span>}</div>
          <span style={{ fontSize: 14, color: it.marcado ? C.muted : C.text, textDecoration: it.marcado ? "line-through" : "none" }}>{it.texto}</span>
        </div>); })}
      </div>
      {viewing.comentario && <div style={{ background: C.white, borderRadius: 16, padding: 16, border: "1px solid " + C.border, marginBottom: 16 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: C.text, marginBottom: 4 }}>Comentario</div>
        <div style={{ fontSize: 14, color: C.muted }}>{viewing.comentario}</div>
      </div>}
      {ce && <button onClick={function() { deleteVisita(viewing); }} style={{ width: "100%", padding: 12, borderRadius: 12, border: "2px solid " + C.pink, background: "transparent", color: C.pink, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>&#128465; Excluir visita</button>}
    </div>);
  }

  if (showNew) {
    var done = items.filter(function(i: any) { return i.marcado; }).length;
    return (<div>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button onClick={function() { setShowNew(false); }} style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid " + C.border, background: C.white, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>&#9664;</button>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: 0 }}>Nova visita</h2>
      </div>
      <div style={{ background: C.white, borderRadius: 16, padding: 16, border: "1px solid " + C.border, marginBottom: 16 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Turma</label>
        <select value={selTurma} onChange={function(e) { setSelTurma(e.target.value); }} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "2px solid " + C.border, fontSize: 14, boxSizing: "border-box", marginBottom: 16, background: C.white }}>
          <option value="">Selecione a turma</option>
          {turmas.map(function(t: any) { return <option key={t.id} value={t.id}>{t.nome}</option>; })}
        </select>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: C.text }}>Checklist</span>
          <span style={{ fontSize: 13, color: C.blue, fontWeight: 700 }}>{done}/{items.length}</span>
        </div>
        {items.map(function(item: any, idx: number) { return (<div key={idx} onClick={function() { setItems(items.map(function(it: any, i: number) { return i === idx ? Object.assign({}, it, { marcado: !it.marcado }) : it; })); }} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderTop: "1px solid " + C.border, cursor: "pointer" }}>
          <div style={{ width: 24, height: 24, borderRadius: 8, border: "2px solid " + (item.marcado ? C.green : C.border), background: item.marcado ? C.green : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{item.marcado && <span style={{ color: C.white, fontSize: 14, fontWeight: 700 }}>&#10003;</span>}</div>
          <span style={{ fontSize: 14, color: item.marcado ? C.muted : C.text, textDecoration: item.marcado ? "line-through" : "none" }}>{item.texto}</span>
        </div>); })}
      </div>
      <div style={{ background: C.white, borderRadius: 16, padding: 16, border: "1px solid " + C.border, marginBottom: 16 }}>
        <label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "block", marginBottom: 8 }}>Comentario (opcional)</label>
        <textarea value={comentario} onChange={function(e) { setComentario(e.target.value); }} placeholder="Observacoes da visita..." style={{ width: "100%", minHeight: 80, padding: 12, borderRadius: 12, border: "2px solid " + C.border, fontSize: 14, resize: "vertical", outline: "none", boxSizing: "border-box" }} />
      </div>
      <button onClick={salvarVisita} disabled={saving || !selTurma} style={{ width: "100%", padding: 14, borderRadius: 14, border: "none", background: C.blue, color: C.white, fontSize: 15, fontWeight: 700, cursor: "pointer", opacity: saving || !selTurma ? 0.5 : 1 }}>{saving ? "Salvando..." : "Salvar visita"}</button>
    </div>);
  }

  return (<div>
    {msg && <Msg message={msg} onClose={function() { setMsg(""); }} />}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: 0 }}>Visitas</h2>
      {ce && <button onClick={startNew} style={{ background: C.pink, color: C.white, border: "none", borderRadius: 12, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Nova visita</button>}
    </div>
    {ldV && <p style={{ fontSize: 13, color: C.muted, textAlign: "center" }}>Carregando...</p>}
    {!ldV && visitas.length === 0 && <p style={{ fontSize: 13, color: C.muted, textAlign: "center", marginTop: 40 }}>Nenhuma visita registrada ainda.</p>}
    {visitas.map(function(v: any) { return (<div key={v.id} onClick={function() { openVisita(v); }} style={{ background: C.white, borderRadius: 16, padding: 16, marginBottom: 12, border: "1px solid " + C.border, cursor: "pointer" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div><h3 style={{ fontSize: 15, fontWeight: 600, color: C.text, margin: "0 0 2px" }}>{v.turmas?.nome || "Turma"}</h3><span style={{ fontSize: 12, color: C.muted }}>{new Date(v.created_at).toLocaleDateString("pt-BR")}</span></div>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: C.blueLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: C.blue }}>&#9654;</div>
      </div>
      {v.comentario && <p style={{ fontSize: 13, color: C.muted, margin: "8px 0 0", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{v.comentario}</p>}
    </div>); })}
  </div>);
}

function GaleriaScreen({ user, turmas, perms }: any) {
  var _a = useState<any[]>([]); var fotos = _a[0]; var setFotos = _a[1]; var _b = useState(false); var ld = _b[0]; var setLd = _b[1]; var _c = useState(false); var su = _c[0]; var setSu = _c[1]; var _d = useState("todas"); var fi = _d[0]; var setFi = _d[1]; var _e = useState<File | null>(null); var sf = _e[0]; var setSf = _e[1]; var _f = useState(""); var desc = _f[0]; var setDesc = _f[1]; var _g = useState(""); var ti = _g[0]; var setTi = _g[1]; var _h = useState(false); var up = _h[0]; var setUp = _h[1]; var _i = useState(""); var msg = _i[0]; var setMsg = _i[1]; var _j = useState<any>(null); var vf = _j[0]; var setVf = _j[1]; var _k = useState<string | null>(null); var pv = _k[0]; var setPv = _k[1]; var fr = useRef<HTMLInputElement>(null);
  var ce = canEdit(perms, "galeria");
  useEffect(function() { setLd(true); supabase.from("fotos").select("*, turmas(nome)").order("created_at", { ascending: false }).then(function(r) { setFotos(r.data || []); setLd(false); }); }, []);
  function hfs(e: any) { var f = e.target.files?.[0]; if (f) { setSf(f); var r = new FileReader(); r.onload = function(ev) { setPv(ev.target?.result as string); }; r.readAsDataURL(f); } }
  async function upload() { if (!sf || !ti || up) return; setUp(true); var fn = user.id + "-" + Date.now() + "." + (sf.name.split(".").pop() || "jpg"); var ur = await supabase.storage.from("fotos").upload(fn, sf); if (ur.error) { setUp(false); return; } var pu = supabase.storage.from("fotos").getPublicUrl(fn).data.publicUrl; var ir = await supabase.from("fotos").insert({ turma_id: ti, autor_id: user.id, url: pu, descricao: desc || "Foto" }).select("*, turmas(nome)").single(); if (ir.data) { setFotos([ir.data, ...fotos]); setSf(null); setPv(null); setDesc(""); setTi(""); setSu(false); setMsg("Enviada!"); } setUp(false); }
  async function del(foto: any) { var p = foto.url.split("/"); await supabase.storage.from("fotos").remove([p[p.length - 1]]); await supabase.from("fotos").delete().eq("id", foto.id); setFotos(fotos.filter(function(f: any) { return f.id !== foto.id; })); setVf(null); setMsg("Excluida!"); }
  var ff = fi === "todas" ? fotos : fotos.filter(function(f: any) { return f.turma_id === fi; }); var tn = ["todas"].concat(turmas.map(function(t: any) { return t.id; })); var tl: Record<string, string> = { todas: "Todas" }; turmas.forEach(function(t: any) { tl[t.id] = t.nome; });
  return (<div>
    {msg && <Msg message={msg} onClose={function() { setMsg(""); }} />}
    {vf && (<div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 200, background: "rgba(0,0,0,0.9)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}><div style={{ position: "absolute", top: 16, right: 16, display: "flex", gap: 8 }}>{ce && <button onClick={function() { del(vf); }} style={{ padding: "8px 16px", borderRadius: 10, border: "none", background: C.pink, color: C.white, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>&#128465;</button>}<button onClick={function() { setVf(null); }} style={{ padding: "8px 16px", borderRadius: 10, border: "none", background: C.white, color: C.text, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>X</button></div><img src={vf.url} alt={vf.descricao} style={{ maxWidth: "100%", maxHeight: "70vh", borderRadius: 12, objectFit: "contain" }} /><div style={{ marginTop: 16, textAlign: "center" }}><div style={{ fontSize: 16, fontWeight: 600, color: C.white }}>{vf.descricao}</div><div style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>{vf.turmas?.nome}</div></div></div>)}
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}><h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: 0 }}>Galeria</h2>{ce && <button onClick={function() { setSu(!su); }} style={{ background: C.pink, color: C.white, border: "none", borderRadius: 12, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{su ? "X" : "&#128247; Upload"}</button>}</div>
    {su && (<div style={{ background: C.white, borderRadius: 16, padding: 16, marginBottom: 16, border: "1px solid " + C.border }}><input ref={fr} type="file" accept="image/*" onChange={hfs} style={{ display: "none" }} />{pv ? (<div style={{ marginBottom: 12 }}><img src={pv} alt="" style={{ width: "100%", height: 180, objectFit: "cover", borderRadius: 12, marginBottom: 8 }} /><button onClick={function() { setSf(null); setPv(null); if (fr.current) fr.current.value = ""; }} style={{ fontSize: 12, color: C.pink, background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>Remover</button></div>) : (<div onClick={function() { if (fr.current) fr.current.click(); }} style={{ width: "100%", height: 140, borderRadius: 12, border: "2px dashed " + C.border, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", marginBottom: 12 }}><div style={{ fontSize: 36, marginBottom: 4 }}>&#128247;</div><div style={{ fontSize: 13, color: C.muted }}>Toque para escolher</div></div>)}<input value={desc} onChange={function(e) { setDesc(e.target.value); }} placeholder="Descricao..." style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "2px solid " + C.border, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 10 }} /><select value={ti} onChange={function(e) { setTi(e.target.value); }} style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "2px solid " + C.border, fontSize: 14, boxSizing: "border-box", marginBottom: 12, background: C.white }}><option value="">Turma</option>{turmas.map(function(t: any) { return <option key={t.id} value={t.id}>{t.nome}</option>; })}</select><button onClick={upload} disabled={up || !sf || !ti} style={{ width: "100%", padding: 10, borderRadius: 10, border: "none", background: C.blue, color: C.white, fontSize: 14, fontWeight: 600, cursor: "pointer", opacity: up || !sf || !ti ? 0.5 : 1 }}>{up ? "Enviando..." : "Enviar"}</button></div>)}
    <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto" }}>{tn.map(function(id) { return <button key={id} onClick={function() { setFi(id); }} style={{ padding: "8px 16px", borderRadius: 20, border: "none", background: fi === id ? C.blue : C.blueLight, color: fi === id ? C.white : C.blue, fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>{tl[id] || id}</button>; })}</div>
    {ld && <p style={{ fontSize: 13, color: C.muted, textAlign: "center" }}>Carregando...</p>}
    {!ld && ff.length === 0 && <p style={{ fontSize: 13, color: C.muted, textAlign: "center", marginTop: 40 }}>Nenhuma foto</p>}
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>{ff.map(function(f: any) { return (<div key={f.id} onClick={function() { setVf(f); }} style={{ borderRadius: 14, overflow: "hidden", background: C.white, border: "1px solid " + C.border, cursor: "pointer" }}><img src={f.url} alt={f.descricao} style={{ width: "100%", height: 120, objectFit: "cover" }} /><div style={{ padding: 10 }}><div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{f.descricao}</div><div style={{ fontSize: 11, color: C.muted }}>{f.turmas?.nome}</div></div></div>); })}</div>
  </div>);
}

function SuperAdminPanel({ user, onLogout }: any) {
  var _a = useState("sa_dash"); var tab = _a[0]; var setTab = _a[1];
  var _b = useState<any[]>([]); var escolas = _b[0]; var setEscolas = _b[1];
  var _c = useState<any[]>([]); var allUsers = _c[0]; var setAllUsers = _c[1];
  var _d = useState(false); var ld = _d[0]; var setLd = _d[1];
  var _e = useState(""); var msg = _e[0]; var setMsg = _e[1];
  var _f = useState(false); var showNewEscola = _f[0]; var setShowNewEscola = _f[1];
  var _g = useState(""); var novaEscola = _g[0]; var setNovaEscola = _g[1];
  var _h = useState(""); var adminNome = _h[0]; var setAdminNome = _h[1];
  var _i = useState(""); var adminEmail = _i[0]; var setAdminEmail = _i[1];
  var _j = useState(false); var creating = _j[0]; var setCreating = _j[1];
  var _k = useState<any>(null); var viewEscola = _k[0]; var setViewEscola = _k[1];
  var _l = useState<any[]>([]); var escolaUsers = _l[0]; var setEscolaUsers = _l[1];
  var _m = useState<any[]>([]); var escolaTurmas = _m[0]; var setEscolaTurmas = _m[1];

  async function loadAll() {
    setLd(true);
    var r = await Promise.all([
      supabase.from("escolas").select("*").order("created_at", { ascending: false }),
      supabase.from("usuarios").select("*, escolas(nome)").order("created_at", { ascending: false }),
    ]);
    setEscolas(r[0].data || []);
    setAllUsers(r[1].data || []);
    setLd(false);
  }

  useEffect(function() { loadAll(); }, []);

  async function criarEscola() {
    if (!novaEscola.trim() || !adminNome.trim() || !adminEmail.trim()) return;
    setCreating(true);
    var er = await supabase.from("escolas").insert({ nome: novaEscola }).select().single();
    if (er.data) {
      try {
        var res = await fetch("/api/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "invite", nome: adminNome, email: adminEmail, papel: "coordenadora", escola_id: er.data.id, permissoes: [{ modulo: "mural", pode_visualizar: true, pode_editar: true },{ modulo: "chat", pode_visualizar: true, pode_editar: true },{ modulo: "planos", pode_visualizar: true, pode_editar: true },{ modulo: "calendario", pode_visualizar: true, pode_editar: true },{ modulo: "checklist", pode_visualizar: true, pode_editar: true },{ modulo: "galeria", pode_visualizar: true, pode_editar: true }] }) });
        var data = await res.json();
        if (data.success) { setMsg("Escola criada e convite enviado para " + adminEmail + "!"); }
        else { setMsg("Escola criada, mas erro no convite: " + (data.error || "")); }
      } catch(e) { setMsg("Escola criada, mas erro no convite."); }
      setNovaEscola(""); setAdminNome(""); setAdminEmail(""); setShowNewEscola(false);
      loadAll();
    }
    setCreating(false);
  }

  async function toggleEscola(id: string, ativa: boolean) {
    await supabase.from("escolas").update({ ativa: !ativa }).eq("id", id);
    setEscolas(escolas.map(function(e: any) { return e.id === id ? Object.assign({}, e, { ativa: !ativa }) : e; }));
    setMsg(ativa ? "Escola desativada" : "Escola ativada");
  }

  async function openEscola(escola: any) {
    setViewEscola(escola);
    var r = await Promise.all([
      supabase.from("usuarios").select("*").eq("escola_id", escola.id),
      supabase.from("turmas").select("*, usuarios(nome)").eq("escola_id", escola.id),
    ]);
    setEscolaUsers(r[0].data || []);
    setEscolaTurmas(r[1].data || []);
  }

  async function delUserSA(id: string) {
    try { await fetch("/api/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "delete_user", usuario_id: id }) }); } catch(e) {}
    setEscolaUsers(escolaUsers.filter(function(u: any) { return u.id !== id; }));
    setMsg("Usuario removido!"); loadAll();
  }

  async function resetSenha(email: string) {
    try {
      var res = await fetch("/api/auth", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "reset_password", email: email }) });
      var data = await res.json();
      if (data.success) { setMsg("Link de recuperacao enviado para " + email); }
      else { setMsg("Erro: " + (data.error || "")); }
    } catch(e) { setMsg("Erro de conexao"); }
  }

  if (viewEscola) {
    return (<div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      {msg && <Msg message={msg} onClose={function() { setMsg(""); }} />}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <button onClick={function() { setViewEscola(null); }} style={{ width: 36, height: 36, borderRadius: 10, border: "1px solid " + C.border, background: C.white, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>&#9664;</button>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: 0 }}>{viewEscola.nome}</h2>
          <span style={{ fontSize: 12, color: viewEscola.ativa !== false ? C.green : C.pink, fontWeight: 600 }}>{viewEscola.ativa !== false ? "Ativa" : "Inativa"}</span>
        </div>
      </div>
      <div style={{ background: C.white, borderRadius: 16, padding: 16, border: "1px solid " + C.border, marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: "0 0 12px" }}>Turmas ({escolaTurmas.length})</h3>
        {escolaTurmas.length === 0 && <p style={{ fontSize: 13, color: C.muted }}>Nenhuma turma</p>}
        {escolaTurmas.map(function(t: any) { return (<div key={t.id} style={{ padding: "10px 0", borderTop: "1px solid " + C.border }}><div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{t.nome}</div><div style={{ fontSize: 12, color: C.muted }}>{t.usuarios?.nome ? "Prof. " + t.usuarios.nome : "Sem prof."} - {t.qtd_alunos} alunos</div></div>); })}
      </div>
      <div style={{ background: C.white, borderRadius: 16, padding: 16, border: "1px solid " + C.border }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: "0 0 12px" }}>Usuarios ({escolaUsers.length})</h3>
        {escolaUsers.map(function(u: any) { return (<div key={u.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderTop: "1px solid " + C.border }}>
          <div><div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{u.nome}</div><div style={{ fontSize: 12, color: C.muted }}>{u.email} - {u.papel}</div></div>
          <div style={{ display: "flex", gap: 6 }}>
            <button onClick={function() { resetSenha(u.email); }} style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid " + C.border, background: C.white, fontSize: 10, fontWeight: 600, color: C.blue, cursor: "pointer" }}>Reset senha</button>
            <button onClick={function() { delUserSA(u.id); }} style={{ padding: "4px 8px", borderRadius: 6, border: "none", background: C.pinkLight, fontSize: 10, fontWeight: 600, color: C.pink, cursor: "pointer" }}>Remover</button>
          </div>
        </div>); })}
      </div>
    </div>);
  }

  var totalUsers = allUsers.filter(function(u: any) { return u.papel !== "superadmin"; }).length;
  var ativas = escolas.filter(function(e: any) { return e.ativa !== false; }).length;

  return (
    <div style={{ background: C.bg, minHeight: "100vh" }}>
      {msg && <Msg message={msg} onClose={function() { setMsg(""); }} />}
      <div style={{ position: "sticky", top: 0, zIndex: 50, background: C.blueDark, padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: C.white, fontSize: 16 }}>&#9881;</span></div>
          <div><div style={{ fontSize: 15, fontWeight: 700, color: C.white }}>Super Admin</div><div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", letterSpacing: 1, textTransform: "uppercase" }}>Coordinator by KidFly</div></div>
        </div>
        <button onClick={onLogout} style={{ padding: "6px 14px", borderRadius: 8, border: "none", background: "rgba(255,255,255,0.15)", color: C.white, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Sair</button>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto" }}>
          {[{ id: "sa_dash", l: "Painel" },{ id: "sa_escolas", l: "Escolas" },{ id: "sa_users", l: "Usuarios" }].map(function(t) {
            return <button key={t.id} onClick={function() { setTab(t.id); }} style={{ padding: "8px 16px", borderRadius: 20, border: "none", background: tab === t.id ? C.blue : C.blueLight, color: tab === t.id ? C.white : C.blue, fontSize: 13, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>{t.l}</button>;
          })}
        </div>

        {ld && <p style={{ fontSize: 13, color: C.muted, textAlign: "center" }}>Carregando...</p>}

        {!ld && tab === "sa_dash" && (<div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 24 }}>
            {[{ l: "Escolas ativas", v: String(ativas), bg: C.greenLight, ic: "&#127979;" },{ l: "Total escolas", v: String(escolas.length), bg: C.blueLight, ic: "&#128203;" },{ l: "Total usuarios", v: String(totalUsers), bg: C.yellowLight, ic: "&#128101;" },{ l: "Escolas inativas", v: String(escolas.length - ativas), bg: C.pinkLight, ic: "&#128683;" }].map(function(s, i) {
              return (<div key={i} style={{ background: C.white, borderRadius: 16, padding: 16, border: "1px solid " + C.border }}><div style={{ width: 40, height: 40, borderRadius: 12, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, marginBottom: 10 }} dangerouslySetInnerHTML={{ __html: s.ic }} /><div style={{ fontSize: 24, fontWeight: 700, color: C.text }}>{s.v}</div><div style={{ fontSize: 12, color: C.muted, marginTop: 2 }}>{s.l}</div></div>);
            })}
          </div>
          <div style={{ background: C.white, borderRadius: 16, padding: 16, border: "1px solid " + C.border }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: C.text, margin: "0 0 12px" }}>Escolas recentes</h3>
            {escolas.slice(0, 5).map(function(e: any) { return (<div key={e.id} onClick={function() { openEscola(e); }} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderTop: "1px solid " + C.border, cursor: "pointer" }}><div><div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{e.nome}</div><div style={{ fontSize: 12, color: C.muted }}>{new Date(e.created_at).toLocaleDateString("pt-BR")}</div></div><span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, fontWeight: 600, background: e.ativa !== false ? C.greenLight : C.pinkLight, color: e.ativa !== false ? C.green : C.pink }}>{e.ativa !== false ? "Ativa" : "Inativa"}</span></div>); })}
          </div>
        </div>)}

        {!ld && tab === "sa_escolas" && (<div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: 0 }}>Escolas ({escolas.length})</h3>
            <button onClick={function() { setShowNewEscola(!showNewEscola); }} style={{ background: C.pink, color: C.white, border: "none", borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{showNewEscola ? "X Fechar" : "+ Nova escola"}</button>
          </div>
          {showNewEscola && (<div style={{ background: C.white, borderRadius: 16, padding: 16, marginBottom: 16, border: "1px solid " + C.border }}>
            <label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Nome da escola</label>
            <input value={novaEscola} onChange={function(e) { setNovaEscola(e.target.value); }} placeholder="Ex: Escola Pequenos Genios" style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "2px solid " + C.border, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 12 }} />
            <label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Coordenadora (admin da escola)</label>
            <input value={adminNome} onChange={function(e) { setAdminNome(e.target.value); }} placeholder="Nome completo" style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "2px solid " + C.border, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 8 }} />
            <input type="email" value={adminEmail} onChange={function(e) { setAdminEmail(e.target.value); }} placeholder="E-mail da coordenadora" style={{ width: "100%", padding: "10px 14px", borderRadius: 10, border: "2px solid " + C.border, fontSize: 14, outline: "none", boxSizing: "border-box", marginBottom: 12 }} />
            <button onClick={criarEscola} disabled={creating} style={{ width: "100%", padding: 12, borderRadius: 10, border: "none", background: C.blue, color: C.white, fontSize: 14, fontWeight: 600, cursor: "pointer", opacity: creating ? 0.7 : 1 }}>{creating ? "Criando..." : "Criar escola + enviar convite"}</button>
          </div>)}
          {escolas.map(function(e: any) {
            var usersCount = allUsers.filter(function(u: any) { return u.escola_id === e.id; }).length;
            return (<div key={e.id} style={{ background: C.white, borderRadius: 16, padding: 16, marginBottom: 12, border: "1px solid " + C.border }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                <div onClick={function() { openEscola(e); }} style={{ cursor: "pointer", flex: 1 }}><h3 style={{ fontSize: 15, fontWeight: 600, color: C.text, margin: "0 0 2px" }}>{e.nome}</h3><div style={{ fontSize: 12, color: C.muted }}>{usersCount} usuarios - Criada em {new Date(e.created_at).toLocaleDateString("pt-BR")}</div></div>
                <span style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, fontWeight: 600, background: e.ativa !== false ? C.greenLight : C.pinkLight, color: e.ativa !== false ? C.green : C.pink, flexShrink: 0 }}>{e.ativa !== false ? "Ativa" : "Inativa"}</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button onClick={function() { openEscola(e); }} style={{ flex: 1, padding: "6px", borderRadius: 8, border: "1px solid " + C.border, background: C.white, fontSize: 12, fontWeight: 600, color: C.blue, cursor: "pointer" }}>&#128065; Detalhes</button>
                <button onClick={function() { toggleEscola(e.id, e.ativa !== false); }} style={{ padding: "6px 12px", borderRadius: 8, border: "none", background: e.ativa !== false ? C.pinkLight : C.greenLight, fontSize: 12, fontWeight: 600, color: e.ativa !== false ? C.pink : C.green, cursor: "pointer" }}>{e.ativa !== false ? "Desativar" : "Ativar"}</button>
              </div>
            </div>);
          })}
        </div>)}

        {!ld && tab === "sa_users" && (<div>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, margin: "0 0 16px" }}>Todos os usuarios ({totalUsers})</h3>
          {allUsers.filter(function(u: any) { return u.papel !== "superadmin"; }).map(function(u: any) { return (<div key={u.id} style={{ background: C.white, borderRadius: 14, padding: 14, marginBottom: 10, border: "1px solid " + C.border }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div><div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{u.nome}</div><div style={{ fontSize: 12, color: C.muted }}>{u.email}</div><div style={{ display: "flex", gap: 6, marginTop: 4 }}><span style={{ fontSize: 11, background: C.blueLight, color: C.blue, padding: "2px 8px", borderRadius: 6, fontWeight: 600 }}>{u.papel}</span><span style={{ fontSize: 11, background: C.yellowLight, color: "#B8860B", padding: "2px 8px", borderRadius: 6, fontWeight: 600 }}>{u.escolas?.nome || "Sem escola"}</span></div></div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <button onClick={function() { resetSenha(u.email); }} style={{ padding: "4px 8px", borderRadius: 6, border: "1px solid " + C.border, background: C.white, fontSize: 10, fontWeight: 600, color: C.blue, cursor: "pointer" }}>Reset senha</button>
                <button onClick={function() { delUserSA(u.id); }} style={{ padding: "4px 8px", borderRadius: 6, border: "none", background: C.pinkLight, fontSize: 10, fontWeight: 600, color: C.pink, cursor: "pointer" }}>Remover</button>
              </div>
            </div>
          </div>); })}
        </div>)}
      </div>
    </div>
  );
}

var TABS = [{ id: "dashboard", icon: "&#127968;", label: "Inicio" },{ id: "mural", icon: "&#128226;", label: "Mural" },{ id: "chat", icon: "&#128172;", label: "Chat" },{ id: "planos", icon: "&#128221;", label: "Planos" },{ id: "calendario", icon: "&#128197;", label: "Agenda" },{ id: "checklist", icon: "&#9989;", label: "Visitas" },{ id: "galeria", icon: "&#128247;", label: "Fotos" }];

export default function Home() {
  var _a = useState<any>(null); var user = _a[0]; var setUser = _a[1]; var _b = useState("dashboard"); var tab = _b[0]; var setTab = _b[1]; var _c = useState<any[]>([]); var avisos = _c[0]; var setAvisos = _c[1]; var _d = useState<any[]>([]); var planos = _d[0]; var setPlanos = _d[1]; var _e = useState<any[]>([]); var eventos = _e[0]; var setEventos = _e[1]; var _f = useState<any[]>([]); var turmas = _f[0]; var setTurmas = _f[1]; var _g = useState<any[]>([]); var usuarios = _g[0]; var setUsuarios = _g[1]; var _h = useState<any[]>([]); var dest = _h[0]; var setDest = _h[1]; var _i = useState(false); var ld = _i[0]; var setLd = _i[1]; var _j = useState(false); var showMenu = _j[0]; var setShowMenu = _j[1]; var _k = useState<any[]>([]); var perms = _k[0]; var setPerms = _k[1]; var _l = useState(false); var showPwForm = _l[0]; var setShowPwForm = _l[1];

  useEffect(function() {
    // Check URL hash for invite or recovery tokens
    if (typeof window !== "undefined") {
      var hash = window.location.hash;
      if (hash && (hash.includes("type=invite") || hash.includes("type=recovery") || hash.includes("type=magiclink"))) {
        setShowPwForm(true);
      }
    }
    supabase.auth.onAuthStateChange(function(event: string) {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        var h = typeof window !== "undefined" ? window.location.hash : "";
        if (h.includes("type=invite") || h.includes("type=recovery")) {
          setShowPwForm(true);
        }
      }
    });
  }, []);

  async function loadData(ud: any) { setLd(true); var r = await Promise.all([supabase.from("avisos").select("*").eq("escola_id", ud.escola_id).order("created_at", { ascending: false }), supabase.from("planos").select("*, turmas(nome)").order("created_at", { ascending: false }), supabase.from("eventos").select("*").eq("escola_id", ud.escola_id).order("data", { ascending: true }), supabase.from("turmas").select("*, usuarios(nome)").eq("escola_id", ud.escola_id), supabase.from("usuarios").select("*").eq("escola_id", ud.escola_id), supabase.from("aviso_destinatarios").select("*"), supabase.from("permissoes_usuario").select("*").eq("usuario_id", ud.id)]); setAvisos(r[0].data || []); setPlanos(r[1].data || []); setEventos(r[2].data || []); setTurmas(r[3].data || []); setUsuarios(r[4].data || []); setDest(r[5].data || []); setPerms(r[6].data || []); setLd(false); }
  function handleLogin(ud: any) { setUser(ud); loadData(ud); }
  function onAC(a: any) { setAvisos(function(p) { if (p.find(function(x) { return x.id === a.id; })) return p; return [a, ...p]; }); }
  function rDest() { supabase.from("aviso_destinatarios").select("*").then(function(r) { setDest(r.data || []); }); }
  var isEditor = user && (user.papel === "coordenadora" || user.papel === "diretora" || user.papel === "administrativo");

  var visibleTabs = TABS.filter(function(t) { if (t.id === "dashboard") return true; return canView(perms, t.id); });

  if (showPwForm) return <PasswordForm onDone={function() { setShowPwForm(false); }} />;
  if (!user) return <LoginScreen onLogin={handleLogin} />;
  if (user.papel === "superadmin") return <SuperAdminPanel user={user} onLogout={function() { supabase.auth.signOut(); setUser(null); }} />;
  if (ld) return (<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.bg }}><div style={{ textAlign: "center" }}><div style={{ fontSize: 40, marginBottom: 12 }}>&#128203;</div><p style={{ color: C.muted, fontSize: 14 }}>Carregando...</p></div></div>);

  return (
    <div style={{ background: C.bg, minHeight: "100vh", maxWidth: 480, margin: "0 auto", position: "relative" }}>
      {showMenu && (<div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 100, background: "rgba(0,0,0,0.3)" }} onClick={function() { setShowMenu(false); }} />)}
      <div style={{ position: "sticky", top: 0, zIndex: 150, background: C.white, borderBottom: "1px solid " + C.border, padding: "12px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}><div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, " + C.blue + ", " + C.blueDark + ")", display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: C.white, fontSize: 16 }}>&#128203;</span></div><div><div style={{ fontSize: 15, fontWeight: 700, color: C.text }}>Coordinator</div><div style={{ fontSize: 10, color: C.muted, letterSpacing: 1, textTransform: "uppercase" }}>by KidFly</div></div></div>
        <div style={{ position: "relative" }}>
          <div onClick={function() { setShowMenu(!showMenu); }} style={{ width: 36, height: 36, borderRadius: 10, background: C.pinkLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, cursor: "pointer" }}>&#128100;</div>
          {showMenu && (<div style={{ position: "absolute", top: 44, right: 0, background: C.white, borderRadius: 12, boxShadow: "0 8px 30px rgba(0,0,0,0.15)", border: "1px solid " + C.border, overflow: "hidden", minWidth: 180, zIndex: 200 }}>
            <div style={{ padding: "12px 16px", borderBottom: "1px solid " + C.border }}><div style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{user.nome}</div><div style={{ fontSize: 12, color: C.muted }}>{user.papel}</div></div>
            {isEditor && <div onClick={function() { setTab("gestao"); setShowMenu(false); }} style={{ padding: "12px 16px", cursor: "pointer", fontSize: 14, color: C.blue, fontWeight: 600, borderBottom: "1px solid " + C.border }}>&#9881; Gerenciar escola</div>}
            <div onClick={function() { supabase.auth.signOut(); setUser(null); setTab("dashboard"); setShowMenu(false); }} style={{ padding: "12px 16px", cursor: "pointer", fontSize: 14, color: C.pink, fontWeight: 600 }}>&#10140; Sair</div>
          </div>)}
        </div>
      </div>
      <div style={{ padding: "20px 20px 100px" }}>
        {tab === "dashboard" && <DashboardScreen user={user} avisos={avisos} planos={planos} eventos={eventos} turmas={turmas} />}
        {tab === "mural" && <MuralScreen avisos={avisos} user={user} usuarios={usuarios} dest={dest} perms={perms} onAC={onAC} onAU={rDest} onAD={function() { loadData(user); }} />}
        {tab === "chat" && <ChatScreen turmas={turmas} user={user} usuarios={usuarios} />}
        {tab === "planos" && <PlanosScreen planos={planos} perms={perms} />}
        {tab === "calendario" && <CalendarioScreen eventos={eventos} avisos={avisos} />}
        {tab === "checklist" && <ChecklistScreen user={user} turmas={turmas} perms={perms} />}
        {tab === "galeria" && <GaleriaScreen user={user} turmas={turmas} perms={perms} />}
        {tab === "gestao" && <GestaoScreen user={user} turmas={turmas} usuarios={usuarios} perms={perms} onUpdate={function() { loadData(user); }} />}
      </div>
      <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 480, background: C.white, borderTop: "1px solid " + C.border, display: "flex", justifyContent: "space-around", padding: "6px 4px 20px", zIndex: 50, boxShadow: "0 -4px 20px rgba(0,0,0,0.05)" }}>
        {visibleTabs.map(function(t) { return (<button key={t.id} onClick={function() { setTab(t.id); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, background: "none", border: "none", padding: "4px 6px", cursor: "pointer", opacity: tab === t.id ? 1 : 0.5 }}><span style={{ fontSize: 20, display: "block", transform: tab === t.id ? "scale(1.15)" : "scale(1)", transition: "transform 0.2s" }} dangerouslySetInnerHTML={{ __html: t.icon }} /><span style={{ fontSize: 10, fontWeight: tab === t.id ? 700 : 500, color: tab === t.id ? C.blue : C.muted }}>{t.label}</span>{tab === t.id && <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.pink, marginTop: 1 }} />}</button>); })}
      </div>
    </div>
  );
}
