import {fastify} from "fastify"

export const build = (opts = {}) => {
    const app = fastify(opts)

    app.register(import("./plugins/jwt.js"))
    app.register(import("./routes/routes.js"))

    return app
}