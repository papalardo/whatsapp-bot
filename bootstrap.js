import express from 'express';
import http from 'http';
import 'express-group-routes';
import { Server } from 'socket.io';

import Socket from './services/Socket.js';
import CorsMiddleware from './middlewares/cors.js';

const app = express();
app.use(CorsMiddleware);

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' }});
const port = 3000

export default function boot({ routes, websocket }) {
    routes(app);
    websocket(io);

    Socket.setServer(io);

    server.listen(port, () => {
        console.log(`App listening on port ${port}`)
    });
}
