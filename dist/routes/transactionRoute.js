import Router from 'express';
import { alltransaction, createNewTransaction, getPortfolio } from '../controllers/transactionControler.js';
import { authMiddleware } from './../middlewares/auth.js';
const router = Router();
router.route('/new').post(authMiddleware, createNewTransaction);
router.route('/portfolio').get(authMiddleware, getPortfolio);
router.route('/portfolio/history').get(authMiddleware, alltransaction);
export default router;
alltransaction;
