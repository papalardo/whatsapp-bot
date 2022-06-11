import jwt from "jsonwebtoken";
import config from '../config/index.js';

const Login = (req, res) => {
    const phone = req.body.phone;

    const payload = {
        phone,
    };

    const token = jwt.sign(payload, config.JWT.SECRET);

    res.send({
        token
    })
}

export default {
    Login,
}