import { Router } from "express";
import { decrypt, encrypt } from "../../util/encrypt.js";
import OTP from "../../database/otp.js";
import { sendEmail } from "../../util/mailer.js";

const router = new Router();

router.post("/", async(req, res) => {
    const { email, code, remove } = req.body;
    if(!email || !code) return res.json({ status: 422, message: "Fields must be filled." });

    const encryptedEmail = encrypt(email);
    const encryptedCode = encrypt(code);
    const existing = await OTP.findOne({ email: encryptedEmail, code: encryptedCode });
    if(!existing) return res.json({ status: 404, message: "Invalid verification code" });

    if(remove == true) {
        await OTP.deleteOne({ email: encryptedEmail, code: encryptedCode });
    }
    
    return res.json({ status: 200, message: "Verified!" });
})

router.post("/send-code", async(req, res) => {
    const { email } = req.body;
    if(!email) return res.json({ status: 422, message: "Fields must be filled." });

    const encryptedEmail = encrypt(email);
    const existing = await OTP.findOne({ email: encryptedEmail });
    if(existing) await OTP.deleteOne({ email: encryptedEmail });

    const otp = new OTP({ email: encryptedEmail });

    const sentEmail = await sendEmail(
        email, 
        "Verification Code",
        `
        <!DOCTYPE html>
        <html>
            <head>
                <meta name="color-scheme" content="light">
                <meta name="supported-color-schemes" content="light">
            </head>
            <body>
                <div style="width:100%; text-align:center;">
                    <img src="https://www.servicetogo.store/assets/img/logo2.png" width="200" alt="ServiceToGo">
                    <table style="justify-self: center;">
                        <tr>
                            <td style="text-align:left; position:relative;">
                                <h1 style="font-family: Arial, sans-serif; color:#F45E8E !important;">Verification Code</h1>
                                <h3>Please confirm your request</h3>
                                <p>For verification of your request, please use the following code below. This code will expire in 5 minutes.</p>
                                <div style="background-color:#E7E6F0 !important; padding:15px 0; width: 100%; border-radius:5px; text-align: center;">
                                    <h2 style="font-family: Arial, sans-serif; color:#F58C22 !important; letter-spacing:5px; margin:0;">${decrypt(otp.code)}</h2>
                                </div>
                            </td>
                        </tr>
                    </table>
                </div>
            </body>
        </html>
        `,
        `Verification Code: ${decrypt(otp.code)}`
        );
    
    if(!sentEmail) return res.json({ status: 408, message: "Unable to send verification." });

    await otp.save();

    return res.json({ status: 200, message: "Verification code sent!" });
})

export default router;