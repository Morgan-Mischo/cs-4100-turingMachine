const { exit } = require("process");
const { stringify } = require("querystring");
const { isGeneratorFunction } = require("util/types");
const { workerData } = require("worker_threads");

//grab word from input
const args = process.argv;
//console.log(args);

let test = [];
let nodeArray = []; 
let accepted = false; 
let rejected = false; 

//console.log('test ' + args[3])
let inputWord = args[3];
//console.log (inputWord);

//make array from word
let inputWordArray = inputWord.split("");
//console.log (inputWordArray);

// Make sure we got a filename on the command line.
if (process.argv.length < 3) {
  //process.stdout.write('Usage: node ' + process.argv[1] + ' FILENAME');
  process.exit(1);
}

// Read the file and create an array from the contents
var fs = require("fs"),
  filename = process.argv[2];
var InputData = fs.readFileSync(filename).toString();

//console.log('input data', InputData)

//the array is called fileArray
fileArray = InputData.toString().split("\n");

//console.log('filearray', fileArray);

for (var i = 1; i < fileArray.length; i++) {
  test.push(fileArray[i].split(", ")); 
}

//console.log('test', test)
setTest(); 


function setTest() {
  //for each line of the array, create an array
  for (var i = 0; i < test.length; i++) {

    if (!test[i][0].includes("Halt")){
      nodeArray.push({
          name: test[i][0], 
              letterToCompare: test[i][1], 
              replaceLetterInInputWordWith: test[i][2], 
              direction: test[i][3], 
              nextNode: test[i][4]
      });         
  }

  else {
    nodeArray.push({
      name: test[i][0], 
        letterToCompare: null, 
        replaceLetterInInputWordWith: null, 
        direction: null, 
        nextNode: null
  }); 
  }
    
  // console.log(nodeArray); 


  }
}
//console.log(nodeArray)

let currentNodeName = nodeArray[0].name;

while (!accepted && !rejected) {
  for (var i = 0; i < inputWordArray.length; i++) {

    //console.log('currentword', inputWordArray[i])
     

    // console.log(i); 
  
    for(var j = 0; j < nodeArray.length; j++) {

     // console.log('nodearrayobject', nodeArray[j])

  
      if(currentNodeName === nodeArray[j].name) {
  
        if(inputWordArray[i] === nodeArray[j].letterToCompare) {
          inputWordArray[i] = nodeArray[j].replaceLetterInInputWordWith; 
          currentNodeName = nodeArray[j].nextNode; 
        }
        }
        else if (currentNodeName.includes("Halt"))
        {
          accepted = true; 
        }
  
      }  
  }
  rejected = true; 
}

acceptedOrRejected(); 

function acceptedOrRejected (){
  if (accepted == true) {
    console.log("Accepted: " + inputWord); 
   //process.stdout.write("Accepted: " + inputWord)
  } else {
    console.log("Rejected: " + inputWord); 
   //process.stdout.write("Rejected: " + inputWord)
  }
}

