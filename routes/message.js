import express from 'express';
const router = express.Router();

import { createMessage } from '../controller/message.js';

router.post('/', createMessage);

export default router;
