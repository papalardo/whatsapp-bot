import DropboxService from "../services/DropboxService.js";
import Str from "../helpers/Str.js";
import { extractMetadata, Sticker } from 'wa-sticker-formatter'

const SaveStickerJob = async (job, done) => {
    const image = new Buffer(job.data.image, 'hex');

    const metaTag = await extractMetadata(image);

    if (DropboxService.stickerExists(`${metaTag['sticker-pack-id']}.webp`)) {
        return;
    }

    const stickerId = Str.random(20);

    const buffer = await new Sticker(image)
        .setPack('Ztickers')
        .setAuthor('ztickers.app')
        .setID(stickerId)
        .toBuffer()

    await DropboxService.upload(`/New Stickers/${stickerId}.webp`, buffer)
        .then((r) => console.log(`Novo upload => ${stickerId}`))
        .catch((e) => console.error('Erro ao realizar upload Dropbox', e));

    done();
}

export default SaveStickerJob;