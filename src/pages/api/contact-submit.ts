import type { APIRoute } from "astro";
import { Resend } from "resend";

const recaptchaSecret = import.meta.env.RECAPTCHA_SECRET_KEY;
const resendApiKey = import.meta.env.RESEND_API_KEY;

const REQUIRED_FIELDS = ["name", "email", "message"] as const;
const RECIPIENTS = ["roco.solange@automotiveconsulting.cl", "maravena@eserp.cl"];
const FROM_ADDRESS = "Automotive Consulting <noreply@automotiveconsulting.cl>";

const isValidEmail = (value: unknown): value is string =>
  typeof value === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const normalizePayload = (payload: Record<string, unknown>) =>
  Object.entries(payload).reduce<Record<string, string>>((acc, [key, value]) => {
    if (typeof value === "string") acc[key] = value.trim();
    return acc;
  }, {});

const buildHtml = (data: Record<string, string>) => {
  const formLabel = data.formType === "consignacion" ? "Formulario de Consignación" : "Formulario de Contacto";
  const rows = Object.entries(data)
    .filter(([key]) => key !== "g-recaptcha-response" && key !== "formType")
    .map(([key, value]) => {
      const label = key
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (c) => c.toUpperCase());
      return `<tr><td style="padding:4px 8px;font-weight:600;">${label}</td><td style="padding:4px 8px;">${value
        .split("\n")
        .map((line) => line || "<br>")
        .join("<br>")}</td></tr>`;
    })
    .join("");

  return `
    <h1 style="margin:0 0 12px;">${formLabel}</h1>
    <table style="border-collapse:collapse;font-family:sans-serif;font-size:14px;width:100%;">
      ${rows}
    </table>
  `;
};

export const POST: APIRoute = async ({ request }) => {
  if (!recaptchaSecret || !resendApiKey) {
    console.error("Faltan variables de entorno RECAPTCHA_SECRET_KEY o RESEND_API_KEY.");
    return new Response(
      JSON.stringify({ success: false, message: "Configuración del servidor incompleta." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  let payload: Record<string, unknown>;
  try {
    payload = await request.json();
  } catch {
    return new Response(JSON.stringify({ success: false, message: "Datos inválidos." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const token = typeof payload["g-recaptcha-response"] === "string" ? payload["g-recaptcha-response"] : "";
  if (!token) {
    return new Response(JSON.stringify({ success: false, message: "Token reCAPTCHA faltante." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const recaptchaResponse = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret: recaptchaSecret, response: token }).toString(),
    });

    const verification = (await recaptchaResponse.json()) as { success?: boolean; "error-codes"?: string[] };
    if (!verification.success) {
      console.warn("reCAPTCHA no válido:", verification);
      return new Response(JSON.stringify({ success: false, message: "No pudimos validar el reCAPTCHA." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Fallo al verificar reCAPTCHA:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Error al validar reCAPTCHA. Intenta nuevamente." }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }

  const data = normalizePayload(payload);

  for (const field of REQUIRED_FIELDS) {
    const value = data[field];
    if (!value) {
      return new Response(
        JSON.stringify({ success: false, message: `El campo ${field} es obligatorio.` }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }
  }

  if (!isValidEmail(data.email)) {
    return new Response(JSON.stringify({ success: false, message: "El correo ingresado no es válido." }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const resend = new Resend(resendApiKey);
  const subject =
    data.formType === "consignacion"
      ? "Nueva solicitud de consignación - Automotive Consulting"
      : "Nuevo mensaje de contacto - Automotive Consulting";

  try {
    const result = await resend.emails.send({
      from: FROM_ADDRESS,
      to: RECIPIENTS,
      subject,
      html: buildHtml(data),
      replyTo: data.email,
    });

    if ("error" in result && result.error) {
      throw new Error(result.error.message ?? "Error desconocido al enviar correo.");
    }
  } catch (error) {
    console.error("Error enviando correo:", error);
    const message =
      typeof error === "object" && error !== null && "message" in error
        ? (error as { message?: string }).message ?? "No se pudo enviar el correo."
        : "No se pudo enviar el correo.";

    return new Response(JSON.stringify({ success: false, message }), {
      status: 502,
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
};
