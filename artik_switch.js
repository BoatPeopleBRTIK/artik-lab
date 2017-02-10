/*
 * Copyright (C) 2016 Samsung Electronics Co., Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var fs = require('fs');

var Gpio = require('onoff').Gpio;
var button, button2, led;
 
var myButtonCount=0;
 var myButtonState=false;

function exit() {
  button.unexport();
  led.unexport();
  process.exit();
}

function start(configFile, moduleIndex) {

  console.log("Initializing the GPIOs for Button and Light");
  
  led = new Gpio(config.module[moduleIndex].led.gpio1, 'out'),

  button = new Gpio(config.module[moduleIndex].button.gpio1, 'in','both');
  if((config.module[moduleIndex].type === "A520")||(config.module[moduleIndex].type === "A1020"))
  {
    button2 = new Gpio(config.module[moduleIndex].button.gpio2, 'out'); //For A520 and 1020 the additional pin is used a gnd
  }
  else
  {
    button2 = new Gpio(config.module[moduleIndex].button.gpio1, 'in','both');
  }  
}

function toggleLED(value) {

  console.log('Toggle LED Called '+value);
        led.writeSync( (value?1:0) , function(error) {
          if(error) throw error;
             console.log('toggleLED: wrote ' + value + ' to pin #' + myPin);
             myLEDState = value;
    });
// console.log(' out of toggleLED');
}


function toggleButton(err, state){

  if( (myButtonCount++) %2 ) //the button, we have do not maintain the state memory, hence doing it in SW
  {

    myButtonState = myButtonState ? false : true ; // toggle my button state;
    console.log('my current Button State '+myButtonState);
 
  }  
  //console.log('Button event '+state);
  toggleLED(myButtonState);
}

/*  End of console  ****/


//Validate the input parameters
if (process.argv.length != 4) {
  console.log('Usage: node artik_switch.js <config filename> <A530/A710>');
  process.exit(0); 
} 

else {

  console.log('Starting switch'); 
  // Check if the config file exists
  var configFile = './' + process.argv[2];
  fs.exists(configFile, function (exists) {
    if (!exists) {
          console.log('error', 'Config file (%s) doesn\'t exist', configFile);
          process.exit(0); 
      } 
  }); 

  var config = require(configFile);

  //check if the module number is entered correctly
  for (var i = 0; i < config.module.length; i++ ) {
    if (config.module[i].type === process.argv[3] )
    {
      console.log(' ***** module type %s', config.module[i].type);          
      moduleIndex = i;
      break;
    }    
  }            
  if(i == config.module.length)
  {
    console.log('Error', " Illegal Module Number it should be one of below instaed of ", process.argv[3] );
    for (var i = 0; i < config.module.length; i++ ) 
    {
      console.log(config.module[i].type, ',' );
    }  

    process.exit(0);
  }
}

start(configFile,moduleIndex);


button.watch(toggleButton);
process.on('SIGINT', exit);
