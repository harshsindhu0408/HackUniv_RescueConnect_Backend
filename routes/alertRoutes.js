import express from "express";
import { createAlert, getAlertsForAgency, editAlert, deleteAlert } from "../controllers/alertController.js";
import { requireSignIn } from "../middlewares/authenticationMiddleware.js";

const router=express.Router();

// Route for adding new alert
router.route('/createalerts').post(requireSignIn, createAlert);

// Fetching all the  alerts 
router.route('/getalerts').get(requireSignIn, getAlertsForAgency);

// Edit the alert
router.route('/editAlert/:id').put(requireSignIn, editAlert);

// Delete alert
router.route('/deleteAlert/:id').delete(requireSignIn, deleteAlert);

export default router;