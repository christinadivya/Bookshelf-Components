const https = require('https');

/*const frontEndURL = `${process.env.APP_URL}:${process.env.WEB_PORT}`;
*/
const frontEndURL = 'http://34.232.103.127:7000'


module.exports.callfcm=function(name, cb) {
  const requestData = '{ "dynamicLinkInfo": { "dynamicLinkDomain": "hu3ua.app.goo.gl", "link":"' + frontEndURL + '/login","androidInfo": { "androidPackageName": "com.GenaralComponent" } }, "suffix": {  "option": "SHORT" }}';
  const options = {
    host: 'firebasedynamiclinks.googleapis.com',
    path: '/v1/shortLinks?key=AIzaSyD5I45YSEHO_jqkmCIPUIYom6H81ZdbDf4',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }
  };
  const callback = function (response) {
    let str = '';
    response.on('data', (chunk) => {
      str += chunk;
    });
    response.on('end', () => {
      cb(str);
    });
  };
  const req = https.request(options, callback);
    // This is the data we are posting, it needs to be a string or a buffer
  req.write(requestData);
  req.end();
}
 
