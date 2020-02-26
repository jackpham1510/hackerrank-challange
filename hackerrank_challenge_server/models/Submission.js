const Sequelize = require('sequelize');
const db = require('../provider/postgres');

class Submission extends Sequelize.Model {}
Submission.init({
  hackerId: {
    type: Sequelize.INTEGER
  },
  score: {
    type: Sequelize.FLOAT
  },
  lang: {
    type: Sequelize.STRING
  },
  statusText: {
    type: Sequelize.STRING
  },
  challengeId: {
    type: Sequelize.INTEGER
  },
  challengeName: {
    type: Sequelize.STRING
  },
  challengeSlug: {
    type: Sequelize.STRING
  },
  contestSlug: {
    type: Sequelize.STRING
  },
  disabled: {
    type: Sequelize.BOOLEAN,
    defaultValue: false
  },
  updatedAt: {
    type: Sequelize.DATE
  }
}, {
  sequelize: db,
  freezeTableName: true,
  tableName: 'Submissions'
});

module.exports = Submission;