import express from 'express';
import { AuthController, QrCodeController, WaController } from "./controllers/index.js";
import { ErrorHandlerMiddleware, JwtMiddleware, WaInitializedAndReady, PaginationMiddleware } from "./middlewares/index.js";
import { wrapRoute } from './helpers/functions.js';
import DropboxController from "./controllers/DropboxController.js";
import ImagesController from "./controllers/ImagesController.js";

export default function HttpRoutes(router) {
    router.use(express.json());
    router.use(PaginationMiddleware);

    router.get('/', (req, res) => res.send('Hi'));

    router.get('/qr-code/render', wrapRoute(QrCodeController.Render));

    router.post('/auth', AuthController.Login);

    router.get('/dropbox/oauth', DropboxController.Redirect);
    router.get('/dropbox/auth', DropboxController.Auth);

    router.get('/stickers', wrapRoute(ImagesController.GetStickers));
    router.get('/image/:image', wrapRoute(ImagesController.GetImagesController));

    // Authenticated
    router.get('/initialize', JwtMiddleware, WaController.Initialize)
    router.get('/connected', JwtMiddleware, WaController.Connected);
    router.get('/qr-code', JwtMiddleware, WaController.GetQrCode);

    // Authenticated and initialized
    router.post('/send-message', JwtMiddleware, WaInitializedAndReady, WaController.SendMessage);
    router.post('/send-sticker', JwtMiddleware, WaInitializedAndReady, wrapRoute(WaController.SendSticker))

    router.all('*', (req, res) => res.send({ message: 'NOT_FOUND'}, 404))

    router.use(ErrorHandlerMiddleware);
}