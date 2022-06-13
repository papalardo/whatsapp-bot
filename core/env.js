import dotenv from 'dotenv';

const Env = () => {
    let initialized = false;

    const init = () => {
        if (initialized === false) {
            dotenv.config();
        }
        initialized = true;
    }

    init();

    return {
        get: (key, defaultValue) => process.env[key] || defaultValue,
        init,
    }
}

export default Env();