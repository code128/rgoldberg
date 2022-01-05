const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz0123456789.!";
/**
 * HTTP Cloud Function.
 *
 * @param {Object} req Cloud Function request context.
 *                     More info: https://expressjs.com/en/api.html#req
 * @param {Object} res Cloud Function response context.
 *                     More info: https://expressjs.com/en/api.html#res
 */
exports.random_letter = (req, res) => {
    if (!req.query.intendedCharacter) { //Send a random character if there's no passed in character intended
        res.send(alphabet[Math.floor(Math.random() * alphabet.length)])
    }

    if (!req.query.executionID) { 
        req.query.executionID = "00000";
    }

    var match = false;
    var random_letter;
    var iterationCounter = 0;
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
};