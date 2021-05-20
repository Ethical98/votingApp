import express from 'express';
import dotenv from 'dotenv';
import poll from './Routes/Poll.js';
import ConnectDb from './db.js';

const app = express();

dotenv.config();

ConnectDb();

app.use(express.json());

app.use('/poll', poll);

app.get('/', (req, res) => {
  res.send('API is Running...');
});

const PORT = process.env.PORT || 5000;
app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
