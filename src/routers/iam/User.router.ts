import passport from 'passport';
import express, { Router } from 'express';

import UserController from '../../controllers/iam/User.controller';



let router: Router = express.Router();

router
    /**
     * Create User
     */
    .post("/", 
        passport.authenticate('jwt', {session: false}), 
        UserController.create)

    /**
     * Change Other User Profile Picture
     */
    .post("/changeOtherUserProfilePicture", 
        passport.authenticate('jwt', {session: false}), 
        UserController.changeOtherUserProfilePicture)
    /**
     * Change Password
     */
    .post("/changePassword", 
        passport.authenticate('jwt', {session: false}), 
        UserController.changePassword)
 
    /**
     * Search Users
     */
    .post("/search", 
        passport.authenticate('jwt', {session: false}), 
        UserController.search)
    /**
     * Search Users
     */
    .post("/search/paginate", 
        passport.authenticate('jwt', {session: false}), 
        UserController.searchPaginate)
    /**
     * Activate User
     */
    .post("/:id/activate", 
        UserController.activateAccount)
    /**
     * Lock User
     */
    .post("/:id/lock", 
        passport.authenticate('jwt', {session: false}), 
        UserController.lockAccount)
    /**
     * Deactivate User
     */
    .post("/:id/deactivate", 
        passport.authenticate('jwt', {session: false}), 
        UserController.deactivateAccount)
    /**
     * Unlock User
     */
    .post("/:id/unlock", 
        passport.authenticate('jwt', {session: false}), 
        UserController.unlockAccount)
    /**
     * Find User By ID
     */
    .get("/:id", 
        passport.authenticate('jwt', {session: false}), 
        UserController.findById)
    /**
     * Update User
     */
    .put("/:id", UserController.update);

export default router;