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

var exists = require('fs-exists-sync');
var Client = require("node-rest-client").Client
var c = new Client();
var restUrl = "https://api.artik.cloud/v1.1/messages"
var token = "--ARTIK_Cloud_ Temperature_monitor _DeviceToken--"
var srcDeviceId = "--ARTIK_Cloud_Temperature_monitor_ID--"


function build_mesg (newState, ts) {
 
 	var args = {
 		headers: {
 			"Content-Type": "application/json",
 			"Authorization": "Bearer "+token 
 		},  
 		data: { 
     		"sdid": srcDeviceId, 
 			"ts": ts,
 			"type": "message",
 			"data": { 
 				"temp" : newState }
 		}
 	};
 	return args;
 }
 

function postData (state, ts) {

    var args = build_mesg(state, ts);
    console.log(args.data.data.temp);

    c.post(restUrl, args, function(data, response) {            
    	console.log(data);
        }); 
}

var file_cnt=0;
function postSensorData () {
    var opFile = './'+ 'out_'+file_cnt+'.json';
    console.log('reading file:',opFile);
    var sensor_data; 

    if(exists(opFile))
    {
	   	sensor_data = JSON.parse(fs.readFileSync(opFile, 'utf8'));
		postData(sensor_data.temp, sensor_data.ts*1000); //convert the time stamp to ms epoch resolution
	   	
	   	file_cnt++;	
    }

}

/**
 * All start here
 */
console.log(' Starting temp monitor  \n' );

var periodicPost = setInterval( postSensorData, (15*1000) ); //15 second timer


