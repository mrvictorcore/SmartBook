import nodemailer from 'nodemailer';

export const sendEmail = async (to, subject, text) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });

    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: to,
        subject: subject,
        text: text
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email enviado exitosamente');
    } catch (error) {
        console.error('Error al enviar el email:', error);
    }
};