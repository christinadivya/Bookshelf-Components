let bookshelf, config, knex;

config = require('../../config/config').db;

knex = require('knex')(config);

bookshelf = require('bookshelf')(knex);

bookshelf.plugin(['registry', 'visibility', 'virtuals', 'pagination']);

bookshelf.plugin(require('bookshelf-scopes'));

module.exports = bookshelf;

