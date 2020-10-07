import passport from "passport";
import express, { Router } from "express";
import ClientController from "../../controllers/iam/Client.controller";

let router: Router = express.Router();

router
  /**
   * Create Client
   */
  .post(
    "/",
    // passport.authenticate("jwt", { session: false }),
    ClientController.create
  )
  /**
   * Search Clients (No Pagination)
   */
  .post(
    "/search",
    // passport.authenticate('jwt', {session: false}),
    ClientController.search
  )
  /**
   * Search Clients
   */
  .post(
    "/search/paginate",
    // passport.authenticate('jwt', {session: false}),
    ClientController.searchPaginate
  )
  /**
   * Find Client By User Id
   */
  .get(
    "/user-code/:user_code",
    // passport.authenticate('jwt', {session: false}),
    ClientController.findByUserId
  )
  /**
   * Find Client By ID
   */
  .get(
    "/:id",
    // passport.authenticate('jwt', {session: false}),
    ClientController.findById
  )
  /**
   * Update Client
   */
  .put(
    "/:id",
    // passport.authenticate('jwt', {session: false}),
    ClientController.update
  );

export default router;
