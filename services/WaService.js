import waw from 'whatsapp-web.js';
import DropboxService from "./DropboxService.js";
import HttpException from "../exceptions/HttpException.js";
import fetchBase64 from "fetch-base64";
const { MessageMedia } = waw;

const SendSticker = async (client, recipient, stickerName) => {
    if (! DropboxService.stickerExists(`${stickerName}.webp`)) {
        throw new HttpException('Sticker not found', 404);
    }

    const url = await DropboxService
        .instance
        .filesGetTemporaryLink({ path: `/New Stickers/${stickerName}.webp` })
        .then((res) => res.result.link)
        .catch((error) => {
            throw new HttpException(error, 500);
        });

    const image = await fetchBase64.remote(url)
        .then((res) => res[0])

    const media = new MessageMedia('image/webp', image)

    return client.sendMessage(recipient, media, {
        sendMediaAsSticker: true,
    });
}

export default {
    SendSticker,
}