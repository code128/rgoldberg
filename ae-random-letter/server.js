
// Copyright 2018 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// [START app]
const express = require('express');
const app = express();

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz0123456789!\"#$%&'()*+,-./:;<=>?@[] ^_`{|}~";

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

// Listen to the App Engine-specified port, or 8080 otherwise
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
// [END app]

module.exports = app;