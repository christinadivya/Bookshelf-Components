var FCM = require('fcm-push');

var serverKey = 'AIzaSyDdjtktbAyMWMpknU5KKQu7whi_ALD9Jyc';
// var serverKey = 'AAAATJVFZZc:APA91bHyc7HFkuvgiG6KXCjdxSpqWcPZQ2zAGDk6PZQENTUdpRBmIBwsrcKNJNj__eq5Egn22l3MgrVmLb_Q4XwSFN57yOHAdx4scJsUfbsVzPz4s5RYxvsuK23Apl3qL8OgQp3FJ87w';

var fcm = new FCM(serverKey);

module.exports = {
  sendPushNot: sendPushNot
};

function sendPushNot(to, body,id) {
   console.log(to)
   console.log(body)
    var message = {
    registration_ids : to,
    data: {
        keyId: id
    },
    notification: {
        title: "My Clouded Life",
        body: body
    }    
    };


    fcm.send(message, function(err, response){
    console.log("PUSH NOTIFICATION RESPONSE:::::")
    console.log(err)
    console.log(response)

      if (err) {
          console.log("Something has gone wrong!", err);
      } else {
          console.log("Successfully sent push notification with response: ", response);
      }
    });
}