let Bookshelf, Message, Promise;

Bookshelf = require('./index');

require('./user');

Promise = require('bluebird');

Message = Bookshelf.Model.extend({
  tableName: 'message',
  hasTimestamps: true,
  car: function() {
    return this.belongsTo('Car');
  }
});

module.exports = Bookshelf.model('Message', Message);
