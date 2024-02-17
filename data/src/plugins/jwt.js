import fp from 'fastify-plugin';
import { readFileSync } from 'fs';
import fastifyJwt from "@fastify/jwt";

export default fp(async function (app, opts) {

    app.register(fastifyJwt, {
        secret: {
            private: readFileSync('.ssl/private_key.pem'),
            public: readFileSync('.ssl/public_key.pem'),
            passphrase: opts.passphrase,
            sign: {
                algorithm: opts.algorithm,
                expiresIn: opts.expiresIn
            },
            verify: {
                algorithms: opts.algorithms
            }
        }
    });
});
