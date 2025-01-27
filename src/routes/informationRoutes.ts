import express from 'express';
import { addInformation, getInformation } from '../controllers/informationController';

const router = express.Router();

router.post('/add', addInformation);
router.get('/get', getInformation);

export default router;