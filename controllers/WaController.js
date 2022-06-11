import waw from 'whatsapp-web.js';
import WaInstance from '../services/WaInstance.js';
import HttpException from '../exceptions/HttpException.js';
import QrCodeTerminal from 'qrcode-terminal';
import DropboxService from "../services/DropboxService.js";
import {DropboxResponseError} from "dropbox";
import fetchBase64 from 'fetch-base64';
import WaService from "../services/WaService.js";

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

    QrCodeTerminal.generate(qrCode, { small: true });

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

const SendSticker = async (req, res) => {
    const { phone } = req.auth;
    const stickerName = req.body.stickerName;

    const client = WaInstance.instance(phone).getClient();

    await WaService.SendSticker(client, `${req.body.recipient}@c.us`, stickerName);

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