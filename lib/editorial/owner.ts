import "server-only";
import { createHash, createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const cookie = "jejakarsa_editor";
const lifetime = 8 * 3600;
function key() {
  const secret = process.env.JEJAKARSA_OWNER_KEY;
  return secret && secret.length >= 40 ? secret : null;
}
export function ownerConfigured() { return !!key(); }
function equal(a: string,b: string) {
  const hash = (s: string) => createHash("sha256").update(s).digest();
  return timingSafeEqual(hash(a),hash(b));
}
function signature(value: string,secret: string) {
  return createHmac("sha256",secret).update("editor-session:"+value).digest("hex");
}
export async function signIn(input: string) {
  const secret = key();
  if (!secret || !equal(input,secret)) return false;
  const value = String(Math.floor(Date.now()/1000)+lifetime)+"."+randomBytes(16).toString("hex");
  (await cookies()).set(cookie,value+"."+signature(value,secret),{
    httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"strict",path:"/",maxAge:lifetime,
  });
  return true;
}
export async function isOwner() {
  const secret=key();
  const token=(await cookies()).get(cookie)?.value || "";
  const [expiry,nonce,sig]=token.split(".");
  if (!secret || !/^\d+$/.test(expiry) || Number(expiry)<=Date.now()/1000 || !nonce || !sig) return false;
  return equal(signature(expiry+"."+nonce,secret),sig);
}
export async function requireOwner() { if (!(await isOwner())) redirect("/admin/masuk"); }
export async function endSession() { (await cookies()).delete(cookie); }
