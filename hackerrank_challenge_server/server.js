console.log('ENV: ', process.env.NODE_ENV);

if (process.env.NODE_ENV === 'dev') {
  require('dotenv').config();
}

async function startServer() {
  const initModels = require('./models/init').init;
  await initModels();
  
  const express = require('express');
  const bodyParser = require('body-parser');
  const cors = require('cors');
  
  const app = express();
  
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  
  app.use('/api', require('./handlers/api'));

  app.use((err, req, res, next) => {
    console.error(err);
    res.sendStatus(err.status || 500);
  });
  
  const PORT = process.env.PORT || 8133;
  
  app.listen(PORT, () => {
    console.log('App is running on port :' + PORT);
  });
}

startServer();