import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

let transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>|null;

export function InitMailer() {
    // username||mail||password
    const [_, mail, pass] = (process.env.MAIL_INFO as string).split('||');

    transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: mail,
            pass
        }
    });
    return transporter;
}

export async function sendMail(mail:string, otp:string) {
    const transport = transporter ?? InitMailer();

    return await transport.sendMail({
        from: `"Logger Mails" <click.app.validate@gmail.com>`,
        to: mail,
        subject: "Email Verification",
        html: `<h2>Your Logger verification code is:</h2><h1>${otp}</h1>`,
    });
}