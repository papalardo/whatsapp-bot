import dotenv from 'dotenv';

const Env = () => {
    return {
        get: (key, defaultValue) => process.env[key] || defaultValue,
        init: () => dotenv.config()
    }
}

export default Env();