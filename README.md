# artik-lab
This repository contains the source code for ARTIK lab exercises,

=============
The below steps walks through Artik cloud account creation and access the cloud using a REST api and cloud example

1.0)	Create a ARTIK Cloud user account from the user portal, if you already have an ARTIK.IO account then use those credentials to login to https://artik.cloud
1.1)	Create a user account through get started now
 
1.2)	Click on  sign up here
 
1.3)	Fill in the personal info
1.4)	Complete email verification 

2.0)	Add the ARTIK Cloud switch and ARTIK Cloud light to the list. 
2.1)	Find ARTIK Cloud Light under name your new device
 
2.2)	Click “Connect Device”
2.3)	Click “+ Connect another device”
 
2.4)	Find ARTIK Cloud Switch
2.5)	Click “Connect Device”
3.0)	Get User token
The sample cloudswitch and cloudLight programs need their respective token information to be updated in order for them to be uniquely identified by the ARTIK cloud.

3.1)	Navigate to the API Console 
https://developer.artik.cloud/api-console/
3.2)	Click on Sign In
Credentials may be request if so use the same one as step 1.2.
3.3)	Allow access to data for modification
3.4)	Toggle the method GET /users/self in the Users API.  
3.5)	Click the "TRY IT!" button.
3.6)	Copy the access token from the "Request Headers" block. The token is the string next to the word "Bearer".
 
Stay logged into the API Console. Otherwise the token becomes invalid and you cannot perform the following operations.

4.0)	Update code with Bearer token and device ID
4.1)	In SAMIIO click on the gear for the ARTIK Cloud Light
 
4.2)	Find the device ID
 
4.3)	From the shell open the ARTIK_Cloud_Light_ws.js navigate to the file and open in vi
4.4)	Update var cloud_light_id with the info from step 4.2
Update var bearer with the info from step 3.6
 
4.5)	Exit vi and save 
4.5.1)	Esc
4.5.2)	:wq
4.6)	In SAMIIO click on the gear for the ARTIK Cloud Switch (see step 4.1)

4.7)	Find the device ID 
4.8)	From the shell open the ARTIK_Cloud_Switch_REST.js navigate to the file and open in vi
4.9)	Update var cloud_switch_id with the info from step 4.7
Update var bearer with the info from step 3.6w
4.10)	Exit vi and save
5.0)	Set a Rule in the rules engine
5.1)	Click on Rules at the top of the ARTIK portal
 https://my.artik.cloud/rules
5.2)	Click create new rule
 
5.3)	Create two rules in rules engine
5.3.1)	IF ARTIK Cloud Switch state is equal to true then ARTIK Cloud Light setOn.
 
5.3.2)	IF ARTIK Cloud Switch state is equal to false then ARTIK Cloud Light setoff.
6.0)	Execute the cloud Light and Cloud Switch
6.1)	Connect the cloud switch and light to the ARTIK 5 boards.
6.2)	Run the cloudSwitch and cloudLight programs from the shell
6.2.1)	Node cloudSwitch_REST.js cloudLight_ws.js

7.0)	Visualize the data

Go back to the User Portal (https://my.artik.cloud/data) to visualize the data sent to ARTIK cloud by the ARTIK connected cloud light and the cloud switch. Click the device name on the dashboard
 
Click the "+/- CHARTS" button and check the data fields.
 
Now you can view your data in real-time!
 
You can also click "DATA LOGS" to view and sort the individual messages sent.
 

