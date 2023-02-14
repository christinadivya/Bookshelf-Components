let nodemailer = require('nodemailer');
let sendInBlue = require('nodemailer-sendinblue-transport');
const transporter = nodemailer.createTransport(sendInBlue({ apiKey: 'gxJqFbXPSz352Gvs' }));

let config = require('../../config/config').mailgun;
let deeplink=require('./deepLinking')
let mailgun = require('mailgun-js')({
  apiKey: config.api_key,
  domain: config.domain
});
let Promise = require('bluebird');

module.exports.sendMessage = function(receiverUser, senderUser) {
  let mailOptions = {
    from: 'General Components <component@genaral.com>', 
    to: receiverUser.email,
    subject: 'genaralComponents - Message', 
    html: 
    `<p> Hi ${receiverUser.userName}, 
     <p> ${senderUser.message} </p>
     <div> Thanks,</div>
     <div> ${senderUser.name}</div>
     <div> ${senderUser.email} </div>
     <div> ${senderUser.phone_number} </div>
    </p>`
  };

  sendMail(mailOptions);
};

module.exports.sendInvite= function(options) {
  deeplink.callfcm(options.userName, (invitedata) => {
    const data = JSON.parse(invitedata);
    
    if (data.shortLink) {
      const mailOptions = {
       
      from: 'General Components <component@genaral.com>',
      to: options.email,
      subject: 'genaralComponents Invite',
      text: `Hi ,${options.userName} Your Invited  <a href=${data.shortLink}>click me</a>` 
      };
      sendMail(mailOptions);
    }
  });
}

module.exports.activateEMAIL= function(options) {
  deeplink.callfcm(options.userName, (invitedata) => {
    const data = JSON.parse(invitedata);
    
    if (data.shortLink) {
      const mailOptions = {
      from: 'General Components <component@genaral.com>',
      to: options.email,
      subject: 'genaralComponents - Account Activated',
      text: `Hi ,${options.userName} Your <h1> APP</h1> link   <a href=${data.shortLink}> click me</a>` 
      };
      sendMail(mailOptions);
    }
  });
}



module.exports.mailOTP = function(user, OTP) {
  console.log("toEmail",user.email)
  let mailOptions = {
    from: 'General Components <component@genaral.com>', // sender address
    to: user.email, // list of receivers
    subject: 'genaralComponents - Reset Password', // Subject line
    html: `Hi ${user.userName} your OTP (One Time Password) is ${OTP}`
    // `<p> Hi, Your reset password code: ${newPassword} </p>`
    // `<p> Go to <a href='http://34.232.103.127:7000/reset-password?code=${newPassword}'>here<a> to reset your password </p>`
  };

  sendMail(mailOptions);
};


function sendMail(mailOptions,error) {
 
  if(error){
    console.log("error", error);
  }else{
    console.log("Successfully send Mail");
  }
    

  };
