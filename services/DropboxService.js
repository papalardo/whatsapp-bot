import Dropbox from "dropbox";
import config from "../config/index.js";

const DropboxService = () => {
    // const stickersList = [];

    const instance = new Dropbox.Dropbox({
        clientId: config.SERVICES.DROPBOX_CLIENT_ID,
        clientSecret: config.SERVICES.DROPBOX_CLIENT_SECRET
    });

    if (config.SERVICES.DROPBOX_REFRESH_TOKEN) {
        instance.auth.setRefreshToken(config.SERVICES.DROPBOX_REFRESH_TOKEN);
    }

    const upload = (path, contents) => instance.filesUpload({ path, contents })

    // instance.filesListFolder({ path: '/New Stickers' })
    //     .then((response) => {
    //         response.result.entries.forEach((sticker) => {
    //             stickersList.push(sticker.name);
    //         })
    //     });

    // const stickerExists = (stickerName) => stickersList.includes(stickerName);

    return {
        instance,
        upload,
        // stickerExists
    }
}


export default DropboxService()