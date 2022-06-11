import Env from '../core/env.js';

export const DEFAULT_CONNECTION = Env.get('REDIS_URL', 'redis://:secret_redis@127.0.0.1:6379');