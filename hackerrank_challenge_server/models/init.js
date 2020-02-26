const db = require('../provider/postgres');
const Profile = require('./Profile');
const Submission = require('./Submission');

module.exports = {
  init: async function () {
    console.log('init db start');
    await db.sync();
    console.log('init db success!');
  }
}