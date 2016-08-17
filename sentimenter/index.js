'use strict';

let express = require('express');
let sentiment = require('sentiment');
let bodyParser = require('body-parser');
let app = express();
const PORT = process.env.PORT || 80;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/_ping', (req, res) => {
  res.send('pong');
});

app.post('/analyze', (req, res) => {
  if (!req.body || !req.body.text || !req.body.text.length) {
    res
      .status(400)
      .send({error: 'A request body is expected having the `text` key-value set.'});
  }

  console.log("Received: ", req.body);

  res.send(sentiment(req.body.text));
});


app.post('/analyzeAll', (req, res) => {
  if (!req.body || !req.body.texts || !req.body.texts.length) {
    res
      .status(400)
      .send({error: 'A request body is expected having the `texts` key-value set.'});
  }

  console.log("Received: ", req.body);

  let totalScore = 0;

  req.body.texts.forEach((text) => {
    totalScore += sentiment(text).score;
  });

  res.send({
    score: (totalScore / req.body.texts.length)
  });
});


app.use(express.static('public'));

app.listen(PORT, () => {
  console.log('Sentimenter listening on port ' + PORT);
});


