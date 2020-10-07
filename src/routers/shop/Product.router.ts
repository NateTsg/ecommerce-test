import passport from 'passport';
import express, { Router } from 'express';

import ProductController from '../../controllers/shop/Product.controller';


let router: Router = express.Router();

router
    /**
     * Create Product
     */
    .post("/", 
        passport.authenticate('jwt', {session: false}), 
        ProductController.create)
    /**
     * Search Cart Items (No Pagination)
     */
    .post("/search", 
        passport.authenticate('jwt', {session: false}), 
        ProductController.search)
    /**
     * Search Cart Items
     */
    .post("/search/paginate", 
        passport.authenticate('jwt', {session: false}), 
        ProductController.searchPaginate)
    /**
     * Find Cart Item By ID
     */
    .get("/:id", 
        passport.authenticate('jwt', {session: false}), 
        ProductController.findById)
    /**
     * Update Cart Item
     */
    .put("/:id", 
        passport.authenticate('jwt', {session: false}), 
        ProductController.update);

export default router;