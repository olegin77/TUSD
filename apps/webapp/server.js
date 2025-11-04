const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "0.0.0.0";
const port = parseInt(process.env.PORT || "3000", 10);

// Load server polyfills first
require("./server-polyfills");

const app = next({ dev, hostname, port, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  console.log("Next.js app prepared successfully");
  createServer(async (req, res) => {
    try {
      console.log(`Incoming request: ${req.method} ${req.url} from ${req.headers.host}`);

      // Intercept response to log errors
      const originalWrite = res.write;
      const originalEnd = res.end;
      const chunks = [];

      res.write = function (chunk) {
        chunks.push(chunk);
        return originalWrite.apply(res, arguments);
      };

      res.end = function (chunk) {
        if (chunk) chunks.push(chunk);

        // Log error responses
        if (res.statusCode >= 400) {
          const body = Buffer.concat(chunks.filter(c => c)).toString('utf8');
          console.error(`\n=== ERROR RESPONSE ${res.statusCode} ===`);
          console.error(`URL: ${req.url}`);
          console.error(`Host: ${req.headers.host}`);
          console.error(`Body: ${body.substring(0, 1000)}`);
          console.error(`========================\n`);
        }

        return originalEnd.apply(res, arguments);
      };

      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
      console.log(`Response sent: ${res.statusCode}`);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  })
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, hostname, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});
