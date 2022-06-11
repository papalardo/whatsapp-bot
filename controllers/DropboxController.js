import Dropbox from 'dropbox';
import config from '../config/index.js';

const dbx = new Dropbox.Dropbox({
    clientId: config.SERVICES.DROPBOX_CLIENT_ID,
    clientSecret: config.SERVICES.DROPBOX_CLIENT_SECRET
});

export const dropboxInstance = dbx;

const redirectUri = `http://localhost:${config.APP.PORT}/dropbox/auth`;

const Redirect = async (req, res) => {
    const authUrl = await dbx.auth.getAuthenticationUrl(redirectUri, null, 'code', 'offline', null, 'none', false)

    res.writeHead(302, { Location: authUrl });
    res.end();
}

const Auth = async (req, res) => {
    const { code } = req.query;
    console.log(`code:${code}`);

    const token = await dbx.auth.getAccessTokenFromCode(redirectUri, code);
    console.log(`Token Result:${JSON.stringify(token)}`);

    dbx.auth.setRefreshToken(token.result.refresh_token);

    const response = await dbx.usersGetCurrentAccount()
    console.log('response', response);

    res.send(token);
}

export default {
    Redirect,
    Auth
}