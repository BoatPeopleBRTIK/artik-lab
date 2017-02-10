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
var moduleIndex = 0;

var WebSocket = require('ws');

var ws = null;
var fs = require('fs');

var Gpio = require('onoff').Gpio;
var led, led2; // will be initialized upon reading from the config file

var sleep = require('sleep');


function exit() {
  led.unexport(); 
  led2.unexport(); 
  process.exit();
}

/**
 * Gets the current time in millis
 */
function getTimeMillis(){
    return parseInt(Date.now().toString());
}

/**
 * Create a websocket connection and setup GPIO pin
 */
function start(configFile, moduleIndex) {


  console.log("Connecting through "+config.artikCloud.url.webSocketUrl);
  
  //Create the WebSocket connection
  ws = new WebSocket(config.artikCloud.url.webSocketUrl); 
  ws.on('open', function() {
      console.log("WebSocket connection is open ....");
      register(config);
  });
  ws.on('message', function(data) {
      console.log("Received message: " + data + '\n');
       handleRcvMsg(data);
  });
  ws.on('close', function() {
       console.log("WebSocket connection is closed ....");
  });

  led = new Gpio(config.module[moduleIndex].led.gpio1, 'out'),
  led2 = new Gpio(config.module[moduleIndex].led.gpio2, 'out');  
}


function toggleLED(value) {

  console.log('Toggle LED Called '+value);

	led.writeSync( (value?1:0) , function(error) {
          if(error) throw error;
             console.log('toggleLED: wrote ' + value + ' to pin #' + led);
             myLEDState = value;
             sendStateToArtikCloud();
    });

  console.log(' Sending state to AKC');
}


/**
 * Sends a register message to /websocket endpoint
 */
function register(config){
    console.log("Registering device on the WebSocket connection " );
    try{
        var registerMessage = '{"type": "register", '+
                              ' "sdid": "'+ config.artikCloud.devices.artikCloudLight.deviceId + '" ,' +
                              ' "Authorization": "bearer ' +config.artikCloud.devices.artikCloudLight.deviceToken + '" ,' +
                              ' "cid":" ' + getTimeMillis()+ '" }' ;
        console.log('Sending register message ' + registerMessage + '\n');
        ws.send(registerMessage, {mask: true});
    }
    catch (e) {
        console.error('Failed to register messages. Error in registering message: ' + e.toString());
    }
  
}


/**
 * Send ACK message to ARTIK CLoud
 */
function sendStateToArtikCloud(){
    try{
        ts = ', "ts": '+getTimeMillis();
        var data = {
              "state": myLEDState
            };
        var payload = '{"sdid":"'+config.artikCloud.devices.artikCloudLight.deviceId+'"'+ts+', "data": '+JSON.stringify(data)+', "cid":"'+getTimeMillis()+'"}';
        console.log('Sending payload ' + payload + '\n');
        ws.send(payload, {mask: true});
    } catch (e) {
        console.error('Error in sending a message: ' + e.toString() +'\n');
    }    
}


/**
 * Handle Actions
   Example of the received message with Action type:
 */
function handleRcvMsg(msg){
    var msgObj = JSON.parse(msg);
    if (msgObj.type != "action") return; //Early return;

    var ddid = msgObj.ddid; // To identify the device id for the intended device
    var actions = msgObj.data.actions;
    var actionName = actions[0].name; //assume that there is only one action in actions
    console.log("The received action is " + actionName);

    if(ddid == config.artikCloud.devices.artikCloudLight.deviceId )
    {
      var newState;
      if (actionName.toLowerCase() == "seton") {
        newState = 1;
      }
      else if (actionName.toLowerCase() == "setoff") {
        newState = 0;
      } else {
      
      console.log('Do nothing since receiving unrecoganized action ' + actionName);
      return;
      }
      toggleLED(newState);
    }
}


/**
 * All start here
 */





// Check if a config file was passed as a parameter
if (process.argv.length != 4) {
  console.log('Usage: node artik_cloud_light_ws.js <config filename> <A530/A710>');
  process.exit(0); 
}
else {

  console.log(' Starting LAB ---> ARTIK Cloud Light Device \n');

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

process.on('SIGINT', exit);
