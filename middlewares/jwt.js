import { expressjwt } from 'express-jwt';
import config from '../config/index.js';

const JwtMiddleware = expressjwt({
    secret: config.JWT.SECRET,
    algorithms: ["HS256"],
});

export default JwtMiddleware;