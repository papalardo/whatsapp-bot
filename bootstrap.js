import express from 'express';
import http from 'http';
import config from './config/index.js';
import 'express-group-routes';
import { Server } from 'socket.io';

import Socket from './services/Socket.js';
import CorsMiddleware from './middlewares/cors.js';
import WaInstance from "./services/WaInstance.js";
import Env from "./core/env.js";

const app = express();
app.use(CorsMiddleware);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' }});
const port = config.APP.PORT

export default function boot({ routes, websocket }) {
    Env.init();
    routes(app);
    websocket(io);

    Socket.setServer(io);

    if (process.env.NODE_ENV === 'development') {
        WaInstance.createSession('61982856800')
            .getClient()
            .initialize();
    }

    server.listen(port, () => {
        console.log(`App listening on port ${port}`)
    });
}
