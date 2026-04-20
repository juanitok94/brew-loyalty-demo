import { config } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import QRCode from "qrcode";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local from project root
config({ path: resolve(__dirname, "../.env.local") });

const token = process.env.ODDS_ADMIN_TOKEN;
if (!token) {
  console.error("Error: ODDS_ADMIN_TOKEN is missing from .env.local");
  process.exit(1);
}

const url = `https://brew-loyalty-mvp.vercel.app/admin?token=${token}`;
const outPath = resolve(__dirname, "barista-qr.png");

await QRCode.toFile(outPath, url, { width: 400, margin: 2 });

console.log("QR code saved to scripts/barista-qr.png");
console.log("URL:", url);
