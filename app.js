const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const bayes = require('./src/handleEmotion');

app.use(express.static(path.join(__dirname, '/src')));
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });

app.use(express.urlencoded({
    extended: true
}));

app.use(express.json());

app.get('/', (req, res) => {
    const data = JSON.parse(fs.readFileSync('src/data.json', { encoding: 'utf8', flag: 'r' }));
    const aus  = JSON.parse(fs.readFileSync('src/auDescription.json', { encoding: 'utf8', flag: 'r' }));
    res.json({
        data,
        aus,
    })
})
app.post('/', (req, res) => {
    const rs = bayes(req.body)
    res.json(rs);
})

app.listen(4000, () => console.log('server ready'));