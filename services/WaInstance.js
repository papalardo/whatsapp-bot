import WhatsAppSdk from 'whatsapp-web.js';
const { Client, LocalAuth } = WhatsAppSdk;
import Socket from './Socket.js';
import WaService from "./WaService.js";
import Queue from '../core/queue.js';
import { JOBS_LIST } from "../jobs/index.js";

function WaInstance() {
    const sessions = {};

    const createSession = (sessionId) => {
        const client = new Client({
            puppeteer: {
                args: ['--no-sandbox','--disable-setuid-sandbox']
            },
            authStrategy: new LocalAuth({
                clientId: sessionId,
            })
        });

        client.on('qr', (qrCode) => {
            Socket.emit('wa:qr', qrCode);

            setQrCode(sessionId, qrCode);
        });

        client.on('ready', () => {
            Socket.emit('wa:connected');

            setReady(sessionId, true);
        });

        client.on('message', async (message) => {
            if (message.isStatus) return;

            if (message.body.startsWith('!z')) {
                const stickerName = message.body.replace('!z ', '');
                await WaService.SendSticker(client, message.from, stickerName)
                    .catch((e) => console.error('Erro ao enviar sticker', e))
            }

            Socket.emit('wa:message', message);

            if (message.hasMedia && message.type === 'sticker') {
                const messageMedia = await message.downloadMedia();
                void saveSticker(messageMedia.data);
            }
        });

        const saveSticker = async (base64Data) => {
            const image = new Buffer.from(base64Data, 'base64').toString('hex');

            console.log('NEW STICKER');

            Queue.instances.DEFAULT.add(JOBS_LIST.SAVE_STICKER, { image });
        }

        sessions[sessionId] = {
            client,
            qrCode: undefined,
            ready: false,
        };

        return instance(sessionId);
    }

    const setReady = (sessionId, status) => sessions[sessionId].ready = status;

    const setQrCode = (sessionId, qrCode) => sessions[sessionId].qrCode = qrCode;

    const isInitialized = (sessionId) => sessions[sessionId] !== undefined;

    const isReady = (sessionId) => sessions[sessionId]?.ready || false;

    const getQrCode = (sessionId) => sessions[sessionId]?.qrCode;

    const getSession = (sessionId) => sessions[sessionId];

    const getClient = (sessionId) => sessions[sessionId].client;

    const instance = (sessionId) => ({
        getClient: () => getClient(sessionId),
        isInitialized: () => isInitialized(sessionId),
        getSession: () => getSession(sessionId),
        isReady: () => isReady(sessionId),
        getQrCode: () => getQrCode(sessionId)
    });

    return {
        sessions,
        createSession,
        instance,
    };
}

export default WaInstance();