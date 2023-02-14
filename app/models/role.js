let Bookshelf, Role;

Bookshelf = require('./index');

require('./user');

Role = Bookshelf.Model.extend({
  tableName: 'roles',
  users: function() {
    return this.hasMany('User');
  }
});

module.exports = Bookshelf.model('Role', Role);
