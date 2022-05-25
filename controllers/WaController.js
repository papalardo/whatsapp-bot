import waw from 'whatsapp-web.js';
import WaInstance from '../services/WaInstance.js';
import HttpException from '../exceptions/HttpException.js';

const { MessageMedia } = waw;

const GetQrCode = (req, res) => {
    const { phone } = req.auth;

    const instance = WaInstance.instance(phone);

    if (instance.isReady()) {
        throw new HttpException('Ready connected');
    }

    if (! instance.isInitialized()) {
        throw new HttpException('Not initialized');
    }

    const qrCode = instance.getQrCode();

    if (qrCode === undefined) {
        throw new HttpException('Unavailable yet');
    }

    return res.send({
        qrCode
    });
}

const Connected = (req, res) => {
    const { phone } = req.auth;

    const instance = WaInstance.instance(phone);

    return res.send({
        connected: instance.isReady()
    });
}

const Initialize = (req, res) => {
    const { phone } = req.auth;

    if (WaInstance.instance(phone).isInitialized()) {
        throw new HttpException('Ready initialized');
    }

    WaInstance.createSession(phone)
        .getClient()
        .initialize();

    return res.send({
        status: 'INITIALIZING'
    });
}

const SendMessage = (req, res) => {
    const { phone } = req.auth;

    void WaInstance.instance(phone)
        .getClient()
        .sendMessage(`${req.body.recipient}@c.us`, req.body.message);

    return res.send({
        message: "SENT",
    })
}

const SendSticker = (req, res) => {
    const { phone } = req.auth;

    void WaInstance.instance(phone)
        .getClient()
        .sendMessage(`${req.body.recipient}@c.us`, MessageMedia.fromFilePath(req.body.path), {
            sendMediaAsSticker: true,
            stickerName: 'Copiado com sucesso',
            stickerAuthor: 'Pablo Papalardo'
        });

    return res.send({
        message: "SENT",
    })
}

export default {
    GetQrCode,
    Connected,
    Initialize,
    SendMessage,
    SendSticker,
}