"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../supabase";

var C = { blue: "#2C5AA0", blueDark: "#1E3F73", pink: "#FE4F6B", white: "#FFFFFF", text: "#1A2332", muted: "#6B7A90", border: "#E2E8F0", pinkLight: "#FFF0F2" };

export default function AuthCallback() {
  var _a = useState(""); var pw = _a[0]; var setPw = _a[1];
  var _b = useState(""); var pw2 = _b[0]; var setPw2 = _b[1];
  var _c = useState(""); var err = _c[0]; var setErr = _c[1];
  var _d = useState(false); var ld = _d[0]; var setLd = _d[1];
  var _e = useState(false); var ready = _e[0]; var setReady = _e[1];
  var _f = useState(false); var done = _f[0]; var setDone = _f[1];

  useEffect(function() {
    var hash = window.location.hash;
    if (hash) {
      supabase.auth.getSession().then(function() { setReady(true); });
    } else {
      var params = new URLSearchParams(window.location.search);
      var code = params.get("code");
      if (code) {
        supabase.auth.exchangeCodeForSession(code).then(function(res) {
          if (!res.error) { setReady(true); }
          else { setErr("Link expirado. Peca um novo convite."); }
        });
      } else {
        supabase.auth.getSession().then(function(res) {
          if (res.data.session) { setReady(true); }
          else { setErr("Link invalido. Peca um novo convite."); }
        });
      }
    }
  }, []);

  async function save() {
    if (pw.length < 6) { setErr("Minimo 6 caracteres"); return; }
    if (pw !== pw2) { setErr("Senhas nao conferem"); return; }
    setLd(true); setErr("");
    var r = await supabase.auth.updateUser({ password: pw });
    setLd(false);
    if (r.error) { setErr(r.error.message); return; }
    setDone(true);
  }

  if (done) return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(145deg, " + C.blue + " 0%, " + C.blueDark + " 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: C.white, borderRadius: 24, padding: "32px 24px", width: "100%", maxWidth: 380, textAlign: "center" }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>&#9989;</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: "0 0 8px" }}>Senha criada!</h2>
        <p style={{ fontSize: 14, color: C.muted, margin: "0 0 24px" }}>Agora voce pode acessar o Coordinator.</p>
        <a href="/" style={{ display: "block", width: "100%", padding: "14px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, " + C.pink + " 0%, #E8405A 100%)", color: C.white, fontSize: 16, fontWeight: 700, textDecoration: "none", textAlign: "center", boxSizing: "border-box" }}>Ir para o login</a>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(145deg, " + C.blue + " 0%, " + C.blueDark + " 100%)", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ background: C.white, borderRadius: 24, padding: "32px 24px", width: "100%", maxWidth: 380 }}>
        <div style={{ textAlign: "center", marginBottom: 20 }}><span style={{ fontSize: 36 }}>&#128203;</span></div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: C.text, margin: "0 0 4px" }}>Defina sua senha</h2>
        <p style={{ fontSize: 14, color: C.muted, margin: "0 0 24px" }}>Crie uma senha para acessar o Coordinator</p>
        {err && <div style={{ background: C.pinkLight, color: C.pink, padding: "10px 14px", borderRadius: 12, fontSize: 13, fontWeight: 600, marginBottom: 16 }}>{err}</div>}
        {!ready && !err && <p style={{ fontSize: 14, color: C.muted, textAlign: "center" }}>Verificando convite...</p>}
        {ready && <div>
          <div style={{ marginBottom: 16 }}><label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Nova senha</label><input type="password" value={pw} onChange={function(e) { setPw(e.target.value); }} placeholder="Minimo 6 caracteres" style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "2px solid " + C.border, fontSize: 15, outline: "none", boxSizing: "border-box" }} /></div>
          <div style={{ marginBottom: 24 }}><label style={{ fontSize: 13, fontWeight: 600, color: C.text, display: "block", marginBottom: 6 }}>Confirmar senha</label><input type="password" value={pw2} onChange={function(e) { setPw2(e.target.value); }} placeholder="Repita a senha" style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: "2px solid " + C.border, fontSize: 15, outline: "none", boxSizing: "border-box" }} /></div>
          <button onClick={save} disabled={ld} style={{ width: "100%", padding: "14px", borderRadius: 14, border: "none", background: "linear-gradient(135deg, " + C.pink + " 0%, #E8405A 100%)", color: C.white, fontSize: 16, fontWeight: 700, cursor: "pointer", opacity: ld ? 0.7 : 1 }}>{ld ? "Salvando..." : "Salvar senha"}</button>
        </div>}
      </div>
    </div>
  );
}
