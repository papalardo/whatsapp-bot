import SaveStickerJob from './SaveStickerJob.js';

export const JOBS_LIST = {
    SAVE_STICKER: 'saveSticker'
}

export const JOBS = {
    [JOBS_LIST.SAVE_STICKER]: {
        queue: 'DEFAULT',
        concurrency: 1,
        handler: SaveStickerJob
    }
}

export default JOBS