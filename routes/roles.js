let RolesController, express, router;

express = require('express');

router = express.Router();
 

// var deeplink = require('node-deeplink');
 
RolesController = require('../app/controllers/RolesController');

router.get('/', RolesController.index);

// router.get('/deeplink',
//     deeplink({

//     fallback: 'https://cupsapp.com',
//       android_package_name: 'com.citylifeapps.cups',
//       ios_store_link:
//         'https://itunes.apple.com/us/app/cups-unlimited-coffee/id556462755?mt=8&uo=4'
//     })
    
//   );


//   var express = require('express');
var deeplink = require('node-deeplink');
 
var app = express();
router.get('/test',(req,res)=>{
    console.log("@@@@")
   
  deeplink({
    fallback: 'https://cupsapp.com',
    android_package_name: 'com.citylifeapps.cups',
    ios_store_link:
      'https://itunes.apple.com/us/app/cups-unlimited-coffee/id556462755?mt=8&uo=4'
  })
})
app.get(
  '/deeplink',
  deeplink({
    fallback: 'https://cupsapp.com',
    android_package_name: 'com.citylifeapps.cups',
    ios_store_link:
      'https://itunes.apple.com/us/app/cups-unlimited-coffee/id556462755?mt=8&uo=4'
  })
);


module.exports = router;
