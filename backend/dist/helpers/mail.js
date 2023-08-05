var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import nodemailer from 'nodemailer';
let transporter;
export function InitMailer() {
    const [_, mail, pass] = process.env.MAIL_INFO.split('||');
    transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: mail,
            pass
        }
    });
    return transporter;
}
export function sendMail(mail, otp) {
    return __awaiter(this, void 0, void 0, function* () {
        const transport = transporter !== null && transporter !== void 0 ? transporter : InitMailer();
        return yield transport.sendMail({
            from: `"Logger Mails" <click.app.validate@gmail.com>`,
            to: mail,
            subject: "Email Verification",
            html: `<h2>Your Logger verification code is:</h2><h1>${otp}</h1>`,
        });
    });
}
