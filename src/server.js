const { server } = require('./app')

const port = 8080;

server.listen(port, () => {
  console.log(`Dropping the hammer on port:${port}`);
})