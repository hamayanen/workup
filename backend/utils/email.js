const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');
const pug = require('pug');

module.exports = class Email {
    constructor(user, url) {
        this.to = user.email;
        this.url = url;
        this.from = `Ryoya Hamada <${process.env.EMAIL_FROM}>`;
    };
    
    newTransport() {
        return nodemailer.createTransport({
            service: 'SendGrid',
            auth: {
                user: process.env.SENDGRID_USERNAME,
                pass: process.env.SENDGRID_PASSWORD
            }
        });
    };

    async send(template, subject) {
        const html = pug.renderFile(`${__dirname}/../views/${template}.pug`, {
            url: this.url,
            subject
        });
        
        const mailOptions = {
            from: this.from,
            to: this.to,
            subject,
            html,
            text: htmlToText.fromString(html)
        };

        await this.newTransport().sendMail(mailOptions);
    };

    async sendWelcome() {
        await this.send('welcome', 'ようこそWORKUPへ!');
    };

    async sendPasswwordReset() {
        await this.send('passwordReset', 'パスワードリセットトークン(10分間有効)');
    };
};