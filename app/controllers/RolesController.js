let Role;

Role = require('../models/role');

module.exports = {
  index: function(req, res) {
    return Role.where('name', '!=', 'Admin').fetchAll().then(function(roles) {
      return res.status(200).json({
        roles: roles
      });
    });
  },
  deeplink:function(req,res){
    

  }
};
