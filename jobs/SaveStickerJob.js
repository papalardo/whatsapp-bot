import { extractMetadata, Sticker } from 'wa-sticker-formatter'
import DropboxService from '../services/DropboxService.js';
import Str from '../helpers/Str.js';
import orm from '../core/orm.js';

const SaveStickerJob = async (job, done) => {
    const image = new Buffer(job.data.image, 'hex');

    const metaTag = await extractMetadata(image)
        .catch(() => null);

    // if (DropboxService.stickerExists(`${metaTag['sticker-pack-id']}.webp`)) {
    //     return;
    // }

    const stickerId = Str.random(20);

    const buffer = await new Sticker(image)
        .setPack('Ztickers')
        .setAuthor('ztickers.app')
        .setID(stickerId)
        .toBuffer()

    if (metaTag !== null) {
        await DropboxService.upload(`/New Stickers - Metadata/${stickerId}.json`, JSON.stringify(metaTag))
            .then((r) => console.log(`Novo upload do metadata => ${stickerId}`))
            .catch((e) => console.error('Erro ao realizar upload Dropbox', e));
    }

    const fileName = `${stickerId}.webp`;

    await DropboxService.upload(`/New Stickers/${fileName}`, buffer)
        .then((r) => console.log(`Novo upload => ${stickerId}`))
        .catch((e) => console.error('Erro ao realizar upload Dropbox', e));

    await orm('stickers').insert({ name: fileName });

    done();
}

export default SaveStickerJob;