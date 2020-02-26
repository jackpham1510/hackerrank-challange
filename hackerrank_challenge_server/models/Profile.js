const Sequelize = require('sequelize');
const db = require('../provider/postgres');

class Profile extends Sequelize.Model {}
Profile.init({
  username: {
    type: Sequelize.STRING,
    unique: true
  },
  avatar: {
    type: Sequelize.STRING
  },
  hackerId: {
    type: Sequelize.INTEGER
  },
  disabled: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  }
}, {
  sequelize: db,
  freezeTableName: true,
  tableName: 'Profiles'
});

module.exports = Profile;