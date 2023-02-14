let config, env, path, rootPath;

path = require('path');

rootPath = path.normalize(__dirname + '/..');

env = process.env.NODE_ENV || 'development';


config = {
  development: {
    root: rootPath,
    app: {
      name: 'KPI'
    },
    
    port: 8080,
    db: {
      client: 'mysql',
      connection: {
        host: 'localhost',
        port: '3306',
        user: 'root',
        password: 'optisol@2018',
        database: 'KPI'
      }
    },
    tokenSecret: 'jsf78(*&*#&#kjsfksdf@#@$jsejfdsjkJDFJDKJFkkjwej44werew',
    mailgun: {
      api_key: 'key-508a5cae5bd9ec16bc0c9530afa1f643',
      domain: 'sandbox0b44d7fcc64646798ca62fbeeecd5df8.mailgun.org'
    },
    links:{
      activation: "http://localhost/auth/activate?token="
    },
    rootUrl: "http://localhost/",
    aws: {
      bucketName: "stocklocatorimages",
      imageFormats : ['jpg','png','jpeg','gif'],
      thumbnailUrl : "thumbnails/",
      identityPoolId : "us-east-1:cc95937e-5342-4ede-ad78-54d59d969457",
      thumbnailExtension : "-00001.png",
      image: {path: "https://d3ff6gz5yhx1ap.cloudfront.net/", format: '.png'},
      cloudFrontResizedImageUrl: "https://d3ff6gz5yhx1ap.cloudfront.net/"
    }
  },
   
};

module.exports = config[env];
