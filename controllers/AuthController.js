import jwt from "jsonwebtoken";
import { JWT_CONFIG } from '../config/index.js';

const Login = (req, res) => {
    const phone = req.body.phone;

    const payload = {
        phone,
    };

    const token = jwt.sign(payload, JWT_CONFIG.SECRET);

    res.send({
        token
    })
}

export default {
    Login,
}