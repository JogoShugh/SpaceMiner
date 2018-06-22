const bodyParser = require('body-parser');
const express = require('express');

const port = process.env.API_PORT;
const app = new express();

app.use(bodyParser.json());
app.get('/*', (req, res) => {
  res.status(200).send('hello world. I am updated.');
});
app.listen(port, () => console.log(`App running on port ${port}`));
