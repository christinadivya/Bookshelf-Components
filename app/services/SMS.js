var accountSid = 'ACb7f0b05c62de4a7dee9566a441773223';  
var authToken = '3984a54c013c8d08e132b9d3eac263f8';    

var client = require('twilio')(accountSid,authToken)
// var firebase = require("firebase/app");
let admin=require('firebase-admin')
let serviceAccount= require('/home/desktop-obs-56/Documents/node-express-seed/Bookshelf-components/.vscode/firebase.sdk.json')

module.exports.activateSMS= function(user) {
     let name=user.userName
     let mobile=user.mobile
     
console.log('mobile number is',mobile)

client.sendMessage({

    to: '+91'+mobile,  
    from: '+14233801464',
    body: `hi ${name} You have successfully registerd with General Components.
    <div>
    Your register Mail is ${user.email}
    </div>`
},(err,res) =>{
    if(err) console.log(err)
})
}

module.exports.smsOTP= function(user,otp) {
      
console.log('mobile number is',user.mobile)

client.sendMessage({

   to: '+91'+user.mobile,  
   from: '+14233801464',
   body: `hi ${user.userName} Your 6 digit <h1> OTP </h1> of General Components is ${otp}`
},(err,res) =>{
   if(err) {
       console.log(err)
    }else{
sendMsg(user,err,res)

    }
}
)

}

module.exports.firebase=function(user,token){
   
console.log("firebase ",token)
   admin.initializeApp({
       credential : admin.credential.cert(serviceAccount),
       databaseURL: "https://general-componentes.firebaseio.com/ "
   })   

   let payload={
       data:{
           MyKey1:"this is from firebase"
       }
   };
   let options ={
       riority:'high',
       timeToLive:60*60*24
   };
   admin.messaging().sendToDevice(token,payload,options).then(responce=>{
       console.log("successfully send massgae: ",responce)
   }).catch(err=>{
       console.log("found a error ",err)
   })
}

function sendMsg(mailOptions,err,res) {

    if(err){
      console.log("error", err);
    }else{
      console.log("SMS send successfully");
    };
  }
