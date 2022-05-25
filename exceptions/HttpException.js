export default class HttpException extends Error {
    message;
    code;

    constructor(message, code = 400) {
        super(message);
        this.message = message;
        this.code = code;
    }

    getMessage() {
        return this.message;
    }

    getCode() {
        return this.code;
    }

}