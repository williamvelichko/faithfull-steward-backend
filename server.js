const express = require("express");
const React = require("react");
const ReactDOMServer = require("react-dom/server");
const App = require("./App");
const fs = require("fs");

const app = express();

// Serve static assets
app.use(express.static("public"));

// Handle requests for different routes
app.get("/", (req, res) => {
  const appHtml = ReactDOMServer.renderToString(<App />);
  const indexHtml = fs.readFileSync("index.html", "utf8");
  const finalHtml = indexHtml.replace(
    '<div id="app"></div>',
    `<div id="app">${appHtml}</div>`
  );
  res.send(finalHtml);
});

// Start server
app.listen(process.env.PORT || 4000, () => {
  console.log("Server is listening on port 4000");
});
