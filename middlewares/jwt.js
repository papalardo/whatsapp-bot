import { expressjwt } from 'express-jwt';
import config from '../config/index.js';

export default function JwtMiddleware() {
    return expressjwt({
        secret: config.JWT.SECRET,
        algorithms: ["HS256"],
    });
}