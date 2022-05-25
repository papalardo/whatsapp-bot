import express from 'express';
import { AuthController, QrCodeController, WaController } from "./controllers/index.js";
import { ErrorHandlerMiddleware, JwtMiddleware, WaInitializedAndReady } from "./middlewares/index.js";
import { wrapRoute } from './helpers/functions.js';

export default function HttpRoutes(router) {
    router.use(express.json());

    router.get('/', (req, res) => res.send('Hi'));

    router.get('/qr-code/render', wrapRoute(QrCodeController.Render));

    router.post('/auth', AuthController.Login);

    router.group((router) => {
        router.use(JwtMiddleware());

        router.get('/initialize', WaController.Initialize)
        router.get('/connected', WaController.Connected);
        router.get('/qr-code', WaController.GetQrCode);

        router.group((router) => {
            router.use(WaInitializedAndReady);

            router.post('/send-message', WaController.SendMessage);
            router.post('/send-sticker', WaController.SendSticker)
        });
    });

    router.use(ErrorHandlerMiddleware);
}