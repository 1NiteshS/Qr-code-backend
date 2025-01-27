import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
// import * as dotenv from 'dotenv';

// dotenv.config({ path: '../.env' });
import informationRoutes from './routes/informationRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/information', informationRoutes);

mongoose.connect(process.env.MONGO_URI!)
    .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
    .catch(error => console.error(error));