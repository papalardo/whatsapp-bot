import HttpException from "../exceptions/HttpException.js";

export default function ErrorHandlerMiddleware(err, req, res, next) {
    if (res.headersSent) {
        return next(err);
    }

    let code = 500;
    let message = err.toString();

    if (err instanceof HttpException) {
        code = err.getCode();
        message = err.getMessage();
    }

    if (code === 500) {
        console.error(err);
    }

    return res.status(code)
        .send({
            message: message,
        });
}