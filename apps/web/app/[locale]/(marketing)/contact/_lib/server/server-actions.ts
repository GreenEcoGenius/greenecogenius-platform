'use server';

import * as z from 'zod';

import { getMailer } from '@kit/mailers';
import { publicActionClient } from '@kit/next/safe-action';

import { ContactEmailSchema } from '../contact-email.schema';

const contactEmail = z
  .string({
    error:
      'Contact email is required. Please use the environment variable CONTACT_EMAIL.',
  })
  .parse(process.env.CONTACT_EMAIL);

const emailFrom = z
  .string({
    error:
      'Sender email is required. Please use the environment variable EMAIL_SENDER.',
  })
  .parse(process.env.EMAIL_SENDER);

function escapeHtml(str: string) {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export const sendContactEmail = publicActionClient
  .inputSchema(ContactEmailSchema)
  .action(async ({ parsedInput: data }) => {
    const mailer = await getMailer();

    const name = escapeHtml(data.name);
    const email = escapeHtml(data.email);
    const message = escapeHtml(data.message).replace(/\n/g, '<br/>');

    await mailer.sendEmail({
      to: contactEmail,
      from: emailFrom,
      subject: `[GreenEcoGenius] Message de ${data.name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
          <h2 style="color:#065F46">Nouveau message — Formulaire de contact</h2>
          <table style="width:100%;border-collapse:collapse">
            <tr>
              <td style="padding:8px 12px;font-weight:600;vertical-align:top;width:100px">Nom</td>
              <td style="padding:8px 12px">${name}</td>
            </tr>
            <tr>
              <td style="padding:8px 12px;font-weight:600;vertical-align:top">Email</td>
              <td style="padding:8px 12px"><a href="mailto:${email}">${email}</a></td>
            </tr>
            <tr>
              <td style="padding:8px 12px;font-weight:600;vertical-align:top">Message</td>
              <td style="padding:8px 12px">${message}</td>
            </tr>
          </table>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:24px 0"/>
          <p style="color:#6b7280;font-size:12px">
            Envoyé depuis le formulaire de contact — greenecogenius.tech
          </p>
        </div>
      `,
    });

    return {};
  });
