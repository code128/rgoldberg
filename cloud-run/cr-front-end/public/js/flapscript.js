possibleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ abcdefghijklmnopqrstuvwxyz0123456789!\"#$%&'()*+,-./:;<=>?@[] ^_`{|}~"
char = possibleChars.split("");

function randChar() {
  return possibleChars[Math.floor(Math.random() * possibleChars.length)]
}

function createFlapSpots(sentence) {
  console.log(`Creating spots for ${sentence}`);
  
  // Set up flaps //
  speed = .2; // seconds
  beginStr = ""
  // create a random starting string for the flaps 
  counter = 0
  while (counter < sentence.length) {
    beginStr+=randChar();
    counter++
  }
  amountOfFlaps = beginStr.length;

  //Build the HTML Containers
  div = document.querySelector(".center");
  html = "";
  for (var x = 0; x < amountOfFlaps; x++) {
    html += '<div class="splitflap" data-animated=1><div class="top"></div><div class="bottom"></div><div class="nextHalf"></div><div class="nextFull"></div></div>';
  }
  div.innerHTML = html;


  // Set up more stuff ///////////////////////////////////////
  a1 = document.querySelectorAll(".top");
  a2 = document.querySelectorAll(".bottom");
  b1 = document.querySelectorAll(".nextFull");
  b2 = document.querySelectorAll(".nextHalf");

  for (var x = 0; x < a1.length; x++) {
    a2[x].style.animationDuration = speed + "s";
    b2[x].style.animationDuration = speed + "s";
  }

  strCount = [], flag = [];

  for (var x = 0; x<amountOfFlaps; x++){
    strCount[x] = char.indexOf(beginStr[x]);
    flag[x] = false, flag2 = true;
  }
  

  // Flip them flaps /////////////////////////////////////////
  setInterval(function() {
    for (var x = 0; x < amountOfFlaps; x++) {

      flipIt(x);

      // if (flag.every(function(e) {
      //     return e
      //   }) && flag2) flag2 = false, changeDestination();
    }

  }, speed * 1000);


  ////////////////////////////////////////////////////////////
  // Flap flipping functions /////////////////////////////////
  ////////////////////////////////////////////////////////////
  function flipIt(x) {
    if (a1[x].parentElement.dataset["animated"] == 0) {
      return;
    }

    newChar1 = randChar()
    newChar2 = randChar()
    a2[x].innerHTML = newChar1;
    a1[x].innerHTML = newChar1;
    b1[x].innerHTML = newChar2;
    b2[x].innerHTML = newChar2;
  
    a2[x].classList.remove("flip1");
    a2[x].offsetWidth = a2[x].offsetWidth;
    a2[x].classList.add("flip1");
    b2[x].classList.remove("flip2");
    b2[x].offsetWidth = b2[x].offsetWidth;
    b2[x].classList.add("flip2");

    if (strCount[x] > char.length - 2) strCount[x] = 0;
    else strCount[x]++;
  }

  function dontFlipIt(x) {
    flag[x] = true;
    a2[x].classList.remove("flip2");
    // a2[x].style.backgroundColor = "#3BB6eB";
    // b2[x].style.backgroundColor = "#3BB6eB";
    a1[x].innerHTML = char[(strCount[x] == 0) ? char.length - 1 : strCount[x] - 1];
    a2[x].innerHTML = char[(strCount[x] == 0) ? char.length - 1 : strCount[x] - 1];
  }

}