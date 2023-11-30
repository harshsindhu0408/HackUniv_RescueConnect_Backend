import express  from "express";
import { registerAgency, updateAgency, getAllAgencyLocations,
     updatePassword, getAgencyResourcesAndDisasters,
      loginAgency, agencyProfile, findAgency, findAllAgencies } from "../controllers/agencyController.js";
import { requireSignIn } from "../middlewares/authenticationMiddleware.js";

const router = express.Router();

// Route for adding new agency
router.route('/register').post(registerAgency);
// Route for login
router.route('/login').post(loginAgency);
// Route to update agency password
router.route('/updatepassword').put(requireSignIn, updatePassword);
// Route to update agency details
router.route('/update').put(requireSignIn,updateAgency);
// Fetching agencies with typeOfDisaster resourcesAvailable and their locations filter
router.route('/getAgencyResourcesAndDisasters').get(requireSignIn, getAgencyResourcesAndDisasters);
// Fetch all the agencies locations
router.route('/agencyLocations').get(getAllAgencyLocations);

//profile of agency
router.route('/agencyProfile').get(requireSignIn, agencyProfile);

// list the agency with the id number
router.route('/findAgency/:id').get(requireSignIn, findAgency);

// fetch all the agencies
router.route('/findAllAgencies').get(requireSignIn, findAllAgencies);

export default router