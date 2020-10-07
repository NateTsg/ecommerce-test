import { fetchClient } from './../../middlewares/FectchClient';
import passport from 'passport';
import express, { Router } from 'express';

import CartItemController from '../../controllers/shop/CartItem.controller';


let router: Router = express.Router();

router
    /**
     * Create CartItem
     */
    .post("/", 
        passport.authenticate('jwt', {session: false}), 
        fetchClient(),
        CartItemController.create)
    /**
     * Create CartItem
     */
    .post("/remove", 
    passport.authenticate('jwt', {session: false}), 
    fetchClient(),
    CartItemController.remove)
    /**
     * Get CartItem for user
     */
    .get("/", 
    passport.authenticate('jwt', {session: false}), 
    fetchClient(),
    CartItemController.getUserCart)
    /**
     * Search Cart Items (No Pagination)
     */
    .post("/search", 
        passport.authenticate('jwt', {session: false}), 
        fetchClient(),
        CartItemController.search)
    /**
     * Search Cart Items
     */
    .post("/search/paginate", 
        passport.authenticate('jwt', {session: false}), 
        fetchClient(),
        CartItemController.searchPaginate)
    /**
     * Find Cart Item By ID
     */
    .get("/:id", 
        passport.authenticate('jwt', {session: false}), 
        fetchClient(),
        CartItemController.findById)
    /**
     * Update Cart Item
     */
    .put("/:id", 
        passport.authenticate('jwt', {session: false}), 
        CartItemController.update);

export default router;