const express = require('express');
const app = express();
const port = 8080;

app.get('/', (req, res) => {
  res.status(200).send('Hello Express World!');
});

const server = app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
})

module.exports = server;
