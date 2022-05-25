import WaInstance from "../services/WaInstance.js";
import HttpException from "../exceptions/HttpException.js";

export default function WaInitializedAndReady(req, res, next) {
    const { phone } = req.auth;

    const waInstance = WaInstance.instance(phone);

    if (waInstance.isInitialized() && waInstance.isReady()) {
        return next();
    }

    throw new HttpException('Instance not initialized or ready');
}