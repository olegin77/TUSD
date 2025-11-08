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

app
  .prepare()
  .then(() => {
    console.log("Next.js app prepared successfully");
    createServer(async (req, res) => {
      try {
        console.log(`[REQUEST] ${req.method} ${req.url}`);

        // Remove problematic X-Forwarded headers that might cause URL parsing issues
        delete req.headers['x-forwarded-proto'];
        delete req.headers['x-forwarded-host'];
        delete req.headers['x-forwarded-for'];

        // Ensure hostname is properly set
        if (!req.headers.host) {
          req.headers.host = `${hostname}:${port}`;
        }

        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
        console.log(`[RESPONSE] ${req.url} - Status: ${res.statusCode}`);
      } catch (err) {
        console.error("=".repeat(80));
        console.error(`[ERROR] Handling ${req.url}`);
        console.error("Error name:", err.name);
        console.error("Error message:", err.message);
        console.error("Full error:", err);
        console.error("Stack trace:");
        console.error(err.stack);
        console.error("=".repeat(80));
        res.statusCode = 500;
        res.end("internal server error");
      }
    })
      .once("error", (err) => {
        console.error("Server error:", err);
        process.exit(1);
      })
      .listen(port, hostname, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
      });
  })
  .catch((err) => {
    console.error("Failed to prepare Next.js app:");
    console.error(err);
    process.exit(1);
  });
