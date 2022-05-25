import QRCode from 'qrcode';
import HttpException from "../exceptions/HttpException.js";

const Render = async (req, res) => {
    const code = req.query.code;

    if (!code) {
        throw new HttpException('Invalid code');
    }

    const qrImage = await QRCode.toDataURL(code);

    return res.send({
        image: qrImage
    });
}

export default {
    Render
}