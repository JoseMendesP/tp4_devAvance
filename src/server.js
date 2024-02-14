import fastify from 'fastify';
import fastifyBasicAuth from '@fastify/basic-auth';
import fs from 'fs';

const port = 3000;
const authenticate = { realm: 'Westeros' };

const app = fastify({
    logger: true,
    https: {
        key: fs.readFileSync('server.key'),
        cert: fs.readFileSync('server.crt')
    }
});

app.register(fastifyBasicAuth, {
    validate,
    authenticate
});

async function validate(username, password, req, reply) {
    if (username !== 'Tyrion' || password !== 'wine') {
        return new Error('Winter is coming');
    }
}

app.get('/dmz', {}, (req, reply) => {
    reply.send({ replique: "Ca pourrait être mieux protégé..." });
});

app.after(() => {
    app.route({
        method: 'GET',
        url: '/secu',
        onRequest: app.basicAuth,
        handler: async (req, reply) => {
            return {
                replique: 'Un Lannister paye toujours ses dettes !'
            };
        }
    });
    app.route({
        method: 'GET',
        url: '/autre',
        handler: async (req, reply) => {
            return {
                message: 'Cette route est accessible sans authentification !'
            };
        }
    });
});

app.setErrorHandler(function (err, req, reply) {
    if (err.statusCode === 401) {
        console.log(err);
        reply.code(401).send({ replique: 'Tu ne sais rien, John Snow..' });
    }
    reply.send(err);
});

app.listen(port, function (err, address) {
    if (err) {
        app.log.error(err);
        process.exit(1);
    }

    app.log.info(`Fastify is listening on port: ${address}`);
});
