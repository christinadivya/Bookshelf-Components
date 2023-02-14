import Promise from 'bluebird';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import APIError from './app/config/APIError';
import EmailService from '../services/Email';


require('./user');

Role = Bookshelf.Model.extend({
  tableName: 'roles',
  users: function() {
    return this.hasMany('User');
  }
});



InvitationSchema.pre('save', function setTimestamp(next) {
  const now = new Date();
  const user = this;

  user.updatedAt = now;
  if (!user.createdAt) {
    user.createdAt = now;
  }
  next();
});

InvitationSchema.post('save', (invite) => {
  if (invite.status === 'pending') {
    EmailService.sendInvite({ to: invite.email, invite: invite.id });
  }
});



InvitationSchema.statics = {

  get(id) {
    return this.findById(id)
      .exec()
      .then((invitation) => {
        if (invitation) {
          return invitation;
        }
        const err = new APIError('No such invitation exists!', httpStatus.NOT_FOUND);
        return Promise.reject(err);
      });
  },

  list({ skip = 0, limit = 50 } = {}) {
    return this.find()
      .sort({ createdAt: -1 })
      .skip(+skip)
      .limit(+limit)
      .exec();
  }
};


module.exports = Bookshelf.model('Message', Message);
