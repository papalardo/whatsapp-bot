import { expressjwt } from 'express-jwt';
import { JWT_CONFIG } from '../config/index.js';

export default function JwtMiddleware() {
    return expressjwt({
        secret: JWT_CONFIG.SECRET,
        algorithms: ["HS256"],
    });
}