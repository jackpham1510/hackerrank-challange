const Sequelize = require('sequelize');

const URL = process.env.DATABASE_URL;

const sequelize = new Sequelize(URL, {
  dialect: 'postgres',
  logging: false,
  define: {
    timestamps: false
  }
});

sequelize
  .authenticate()
  .then(() => {
    console.log('> Connection has been established successfully.');
  })
  .catch(err => {
    console.error(err.message);
  });

sequelize.useTransaction = async (handler) => {
  let trans;
  try {
    trans = await sequelize.transaction();
    const result = await handler(trans);
    await trans.commit();
    return result;
  } catch (err) {
    if (trans) {
      await trans.rollback();
    }

    throw err;
  }
}

module.exports = sequelize;