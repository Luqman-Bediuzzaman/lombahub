import { appendFileSync, existsSync, readFileSync } from "node:fs";
import { randomBytes } from "node:crypto";

const [major, minor] = process.versions.node.split(".").map(Number);
if (major < 22 || (major === 22 && minor < 13) || major === 23 && minor < 4) {
  console.error("Gunakan Node.js 24 untuk menjalankan editor lokal dengan SQLite.");
  process.exit(1);
}
if (!existsSync("package.json") || !existsSync("app/admin/review")) {
  console.error("Jalankan perintah dari folder proyek Jejakarsa yang memuat package.json.");
  process.exit(1);
}
const file=".env.local";
const existing=existsSync(file)?readFileSync(file,"utf8"):"";
if (/^JEJAKARSA_OWNER_KEY=/m.test(existing)) {
  console.log("Kunci sudah ada di .env.local. Buka file itu untuk masuk sebagai pemilik.");
} else {
  appendFileSync(file,"\nJEJAKARSA_OWNER_KEY="+randomBytes(32).toString("base64url")+"\n",{mode:0o600});
  console.log("Kunci pemilik tersimpan di .env.local. Salin nilainya untuk masuk di /admin/review.");
}
