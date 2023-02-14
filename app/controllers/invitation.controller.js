import Invitation from '../models/invitation';



module.exports = {


load: function (req, res, next, id) {
  Invitation.get(id)
    .then((invitation) => {
      req.invitation = invitation; // eslint-disable-line no-param-reassign
      return next();
    })
    .catch(e => next(e));
  },



  
 get:function(req, res) {
  return res.json(req.invitation);
    }


}


