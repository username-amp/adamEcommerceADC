const http = require(`http`);
const app = require(`./app`);
const { port } = require(`./config/keys`);

const server = http.createServer(app);

server.listen(port, () => {
  console.log(`nakikinig ako gar sa port ${port}`);
});

module.exports = server;
