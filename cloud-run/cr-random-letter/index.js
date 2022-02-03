const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz0123456789!\"#$%&'()*+,-./:;<=>?@[] ^_`{|}~";

const express = require('express');
const app = express();

app.get('/', (req, res) => {
    if (!req.query.intendedCharacter) { 
        req.query.intendedCharacter = (alphabet[Math.floor(Math.random() * alphabet.length)]);
    }
    if (!req.query.executionID) { 
        req.query.executionID = "00000";
    }
    
    var match = false;
    var random_letter;
    var iterationCounter = 0;
    var iterationMax = 1000;
    while (!match) {
        iterationCounter++;
        random_letter = alphabet[Math.floor(Math.random() * alphabet.length)]
        if (random_letter ==  req.query.intendedCharacter) {
            match = true;
        }
    }
    res.json( {"executionID":req.query.executionID,
                "intendedCharacter":req.query.intendedCharacter, 
                "randomCharacter":random_letter, 
                "iterationCount":iterationCounter}); 
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`helloworld: listening on port ${port}`);
});
