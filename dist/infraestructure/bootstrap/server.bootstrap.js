import http from "http";
export class ServerBootstrap {
    app;
    constructor(app) {
        this.app = app;
    }
    initialize() {
        return new Promise((resolve, reject) => {
            const server = http.createServer(this.app);
            const PORT = Number(process.env.PORT ?? 4000);
            server.listen(PORT)
                .on("listening", () => {
                console.log(`Server running at http://localhost:${PORT}`);
                resolve(true);
            })
                .on("error", (err) => {
                console.log(`Se ha generado un error: ${err}`);
                reject(false);
            });
        });
    }
}
