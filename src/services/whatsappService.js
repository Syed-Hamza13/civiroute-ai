
import pkg from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

const {
  Client,
  LocalAuth
} = pkg;

const client = new Client({
  authStrategy: new LocalAuth({
    clientId: "civiroute"
  })
});

client.on("qr", (qr) => {
  console.log(
    "\nScan WhatsApp QR:\n"
  );

  qrcode.generate(
    qr,
    { small: true }
  );
});

client.on("ready", () => {
  console.log(
    "✅ WhatsApp Connected"
  );
});

client.initialize();

export async function sendWhatsAppOTP(
  phone,
  otp
) {
  const formatted =
    phone.replace("+", "") +
    "@c.us";

  const message =
`CiviRoute AI Verification OTP: ${otp}

Valid for 10 minutes.`;

  await client.sendMessage(
    formatted,
    message
  );
}
