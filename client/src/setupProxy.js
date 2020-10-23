const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
    app.use(
        "/api",
        createProxyMiddleware({
            target: "http://localhost:3000",
            router: {
                // when request.headers.host == 'dev.localhost:3000',
                // override target 'http://www.example.org' to 'http://localhost:8000'
                'localhost:3030': 'http://localhost:3000',
            },
            onProxyRes: (proxyRes, req, res) => {
               let asd=0;
              }
            // logProvider: (aaaaa) =>
            // {
            //     let asd=0;
            // }
        })
    );
}; 