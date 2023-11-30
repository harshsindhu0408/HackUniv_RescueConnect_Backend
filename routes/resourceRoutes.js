import express from "express";
import { requireSignIn } from "../middlewares/authenticationMiddleware.js";
import {
  createResource,
  updateResource,
  getResource,
  listResources,
  getResourceStatus,
  shareResource,
  deleteResource,
} from "../controllers/resourceController.js";
const router = express.Router();

// Create a new resource
router.post("/create", requireSignIn, createResource);

// Update an existing resource by ID
router.put("/updateResource/:id",requireSignIn, updateResource);

// Get details about a specific resource by name
router.get("/getResources/:id", requireSignIn, getResource);

// List all available shared resources
router.get("/listResources",requireSignIn, listResources);

// Get the status and availability of shared resources
router.get("/statusOfResources", requireSignIn, getResourceStatus);

// Share a resource with another agency
router.post("/shareResources", requireSignIn, shareResource);

// Delete a resource by ID
router.delete("/deleteResource/:resourceId",requireSignIn, deleteResource);

export default router;
