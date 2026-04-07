import { createClient } from “@supabase/supabase-js”;
import { NextResponse } from “next/server”;

export async function POST(req: Request) {
var url = process.env.NEXT_PUBLIC_SUPABASE_URL || “”;
var sKey = process.env.SUPABASE_SERVICE_ROLE_KEY || “”;
var aKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || “”;
var siteUrl = “https://coordinator-kidfly.vercel.app”;
var sb = createClient(url, sKey, { auth: { autoRefreshToken: false, persistSession: false } });
var body = await req.json();

if (body.action === “invite”) {
var ir = await sb.auth.admin.inviteUserByEmail(body.email, { data: { nome: body.nome }, redirectTo: siteUrl });
if (ir.error) return NextResponse.json({ error: ir.error.message }, { status: 400 });
var ur = await sb.from(“usuarios”).insert({ nome: body.nome, email: body.email, papel: body.papel, escola_id: body.escola_id, senha_hash: “auth”, auth_id: ir.data.user.id, convidado: true }).select().single();
if (ur.error) return NextResponse.json({ error: ur.error.message }, { status: 400 });
if (body.permissoes && body.permissoes.length > 0) {
await sb.from(“permissoes_usuario”).insert(body.permissoes.map(function(p: any) { return { usuario_id: ur.data.id, modulo: p.modulo, pode_visualizar: p.pode_visualizar, pode_editar: p.pode_editar }; }));
}
return NextResponse.json({ success: true, user: ur.data });
}

if (body.action === “delete_user”) {
var du = await sb.from(“usuarios”).select(”*”).eq(“id”, body.usuario_id).single();
if (du.data && du.data.auth_id) {
await sb.auth.admin.deleteUser(du.data.auth_id);
}
await sb.from(“permissoes_usuario”).delete().eq(“usuario_id”, body.usuario_id);
await sb.from(“usuarios”).delete().eq(“id”, body.usuario_id);
return NextResponse.json({ success: true });
}

if (body.action === “legacy_login”) {
var lr = await sb.from(“usuarios”).select(”*, escolas(nome)”).eq(“email”, body.email).eq(“senha_hash”, body.password).single();
if (lr.error || !lr.data) return NextResponse.json({ error: “Credenciais invalidas” }, { status: 401 });
var cr = await sb.auth.admin.createUser({ email: body.email, password: body.password, email_confirm: true });
if (cr.data?.user) { await sb.from(“usuarios”).update({ auth_id: cr.data.user.id }).eq(“id”, lr.data.id); }
return NextResponse.json({ success: true, migrated: true });
}

if (body.action === “reset_password”) {
var uc = await sb.from(“usuarios”).select(”*”).eq(“email”, body.email).single();
if (uc.error || !uc.data) return NextResponse.json({ error: “E-mail nao encontrado” }, { status: 404 });
if (!uc.data.auth_id) {
var tp = “temp” + Date.now() + “X”;
var ac = await sb.auth.admin.createUser({ email: body.email, password: tp, email_confirm: true });
if (ac.data?.user) { await sb.from(“usuarios”).update({ auth_id: ac.data.user.id }).eq(“id”, uc.data.id); }
}
var anon = createClient(url, aKey);
var rr = await anon.auth.resetPasswordForEmail(body.email, { redirectTo: siteUrl });
if (rr.error) return NextResponse.json({ error: rr.error.message }, { status: 400 });
return NextResponse.json({ success: true });
}

return NextResponse.json({ error: “Acao desconhecida” }, { status: 400 });
}
