import WhatsAppSdk from 'whatsapp-web.js';
const { Client, LocalAuth } = WhatsAppSdk;
import fs from 'fs';
import Str from "../helpers/Str.js";
import Socket from './Socket.js';

function WaInstance() {
    const sessions = {};

    const createSession = (sessionId) => {
        const client = new Client({
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

            Socket.emit('wa:message', message);

            if (message.hasMedia && message.type === 'sticker') {
                const messageMedia = await message.downloadMedia();
                void saveSticker(messageMedia.data);
            }
        });

        const saveSticker = async (base64Data) => {
            fs.writeFile(`./.uploads/${Str.random(20)}.webp`, base64Data, 'base64');
        }

        sessions[sessionId] = {
            client,
            qrCode: undefined,
            ready: false,
        };

        return instance(sessionId);
    }

    const setReady = (sessionId, status) => sessions[sessionId].ready = status;

    const setQrCode = (sessionId, qrCode) => sessions[sessionId] = qrCode;

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