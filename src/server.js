const { app } = require('./app')

const port = 8080;

app.listen(port, () => {
  console.log(`Dropping the hammer on port:${port}`);
})