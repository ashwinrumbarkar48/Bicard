require('dotenv').config();

const app = require('./app');
const connectDB = require('./config/db');

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`BICARD backend listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed', error);
    process.exit(1);
  });
