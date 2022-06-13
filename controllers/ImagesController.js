import fetchBase64 from 'fetch-base64';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import DropboxService from '../services/DropboxService.js';
import orm from '../core/orm.js';

const GetImagesController = async (req, res) => {
    const { image } = req.params;

    const imagePath = `./storage/images/${image}`;

    if (true | !fs.existsSync(imagePath)) {
        const imageUrl = await DropboxService.instance.filesGetTemporaryLink({
            path: `/New Stickers/${image}`,
        });

        const imageBase64 = await fetchBase64.remote(imageUrl.result.link)
            .then((res) => res[0]);

        const label = Buffer.from(`
            <svg width="250" height="70">
                <rect x="0" y="0" width="100%" height="100%" fill="#fff" opacity="0.60" />
                <text x="50%" y="50%" text-anchor="middle" dy="0.35em" fill="#000" style="font-size: 50px" opacity="0.35">
                    Ztickers
                </text>
            </svg>
        `);

        await sharp(new Buffer.from(imageBase64, 'base64'))
            .composite([{ input: label, gravity: 'center', }])
            .toFile(imagePath);
    }

    res.sendFile(path.resolve(imagePath));
}

const GetStickers = async (req, res) => {
    // const images = await DropboxService.instance.filesListFolder({
    //     path: '/New Stickers',
    //     limit: 2000,
    // });
    //
    // const imagesNames = images.result.entries.map((entry) => entry.name);

    const stickers = await orm('stickers')
        .orderBy('id', 'DESC')
        .paginate(req.pagination());

    res.send(stickers);
    // imagesNames
}

export default {
    GetImagesController,
    GetStickers
}