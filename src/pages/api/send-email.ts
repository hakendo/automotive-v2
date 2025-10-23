import type { APIRoute } from "astro";
import { Resend } from "resend";

export const prerender = false;

const resend = new Resend(import.meta.env.RESEND_API_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = await request.json();
    const { name, email, phone, message, plate, saleType } = data;

    // Construir el HTML del correo, incluyendo los campos opcionales si existen
    let htmlContent = `
      <h2>Nuevo mensaje de contacto sitio web</h2>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Teléfono:</strong> ${phone}</p>
    `;

    // Añadir campos opcionales solo si existen
    if (plate) {
      htmlContent += `<p><strong>Patente:</strong> ${plate}</p>`;
    }

    if (saleType) {
      const saleTypeText =
        saleType === "consignacion" ? "Consignación" : "Venta directa";
      htmlContent += `<p><strong>Tipo de venta:</strong> ${saleTypeText}</p>`;
    }

    // Añadir el mensaje
    htmlContent += `
      <p><strong>Mensaje:</strong></p>
      <p>${message}</p>
    `;

    const { data: emailData, error } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: ["roco.solange@automotiveconsulting"],
      cc: ["maravena@eserp.cl"], // cambiar por el email de la empresa
      subject: `(Sitio web) Nuevo mensaje de contacto de ${name}`,
      html: htmlContent,
    });

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, data: emailData }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Error interno del servidor" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
};