import { fetchClient } from './../../middlewares/FectchClient';
import passport from 'passport';
import express, { Router } from 'express';

import TransactionController from '../../controllers/shop/Transaction.controller';


let router: Router = express.Router();

router
    /**
     * Create Transaction
     */
    .post("/", 
        passport.authenticate('jwt', {session: false}),
        fetchClient(), 
        TransactionController.create)
    /**
     * Get Transaction For User
     */
    .get("/history", 
    passport.authenticate('jwt', {session: false}),
    fetchClient(), 
    TransactionController.getCompletedTransactions)
    /**
     * Search Cart Items (No Pagination)
     */
    .post("/search", 
        passport.authenticate('jwt', {session: false}), 
        TransactionController.search)
    /**
     * Search Cart Items
     */
    .post("/search/paginate", 
        passport.authenticate('jwt', {session: false}), 
        TransactionController.searchPaginate)
    /**
     * Find Cart Item By ID
     */
    .get("/:id", 
        passport.authenticate('jwt', {session: false}), 
        TransactionController.findById)
    /**
     * Update Cart Item
     */
    .put("/:id", 
        passport.authenticate('jwt', {session: false}), 
        TransactionController.update);

export default router;