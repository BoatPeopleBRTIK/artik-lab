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

var myLEDState = 0;

var Gpio = require('onoff').Gpio;
var led, led2; // will be initialized upon reading from the config file

var sleep = require('sleep');

var fs = require('fs');

function exit() {
  led.unexport();
  process.exit();
}

/**
 * Gets the current time in millis
 */
function getTimeMillis(){
    return parseInt(Date.now().toString());
}

function start(configFile, moduleIndex) {

  console.log("Initializing the GPIOs for Light");
  
  led  = new Gpio(config.module[moduleIndex].led.gpio1, 'out'),
  led2 = new Gpio(config.module[moduleIndex].led.gpio2, 'out');  
}


function toggleLED(value) {

  console.log('Toggle LED Called '+value);
	led.writeSync( (value?1:0) , function(error) {
          if(error) throw error;
             console.log('toggleLED: wrote ' + value + ' to pin #' + led);
             myLEDState = value;
    });
// console.log(' out of toggleLED');
}



/**
 * All start here
 */




//Validate the input parameters
if (process.argv.length != 4) {
  console.log('Usage: node artik_light.js <config filename> <A530/A710>');
  process.exit(0); 
} 
else {

  console.log(' Starting LAB ---> Blink ARTIK Light Device \n');
  
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

while(1){
 toggleLED(1);
 sleep.sleep(2);
 toggleLED(false);
 sleep.sleep(2);
}
process.on('SIGINT', exit);
