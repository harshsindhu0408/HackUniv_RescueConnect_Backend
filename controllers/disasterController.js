import { filterResults } from "../Utils/filterDisaster.js";
import Disaster from "../models/disaster.js";
import axios from "axios";

// Adding new Disaster
export const addDisaster = async (req, res) => {
  const {
    typeOfDisaster,
    description,
    contact,
    status,
    severity,
  } = req.body;
  const agencies = req.user._id;
  console.log(agencies);

  // Check if agencies is defined and not empty
  if (!agencies || agencies.length === 0) {
    return res.status(400).json({ success: false, message: "Agencies must be provided" });
  }

  if (
    !typeOfDisaster ||
    !description ||
    !contact ||
    !status ||
    !severity
  ) {
    return res
      .status(400)
      .json({ success: false, message: "All the fields are mandatory" });
  }

  try {
    const address = `${contact.address.street}, ${contact.address.city}, ${contact.address.state}, ${contact.address.postalCode}, ${contact.address.country}`;
    const geocodingResponse = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        address
      )}.json?access_token=${process.env.MAPBOX_API_KEY}`
    );

    const features = geocodingResponse.data.features;

    if (!features || features.length === 0) {
      return res.status(400).json({success:false, message: "Invalid address" });
    }
    console.log("Coordinates are ->>", features[0].center);
    const coordinates = features[0].center;
    const swappedCoordinates = [coordinates[1], coordinates[0]];

    // Define and provide a valid timestamp for the disaster
    const timestamp = new Date();

    const newDisaster = await Disaster.create({
      typeOfDisaster,
      timestamp,
      contact,
      description,
      location: {
        type: "Point",
        coordinates: swappedCoordinates,
      },
      agencies,
      status,
      severity,
    });

    res
      .status(201)
      .json({ success: true, message: "New Disaster info added", newDisaster });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success:false, message: "Failed to create disaster record",error });
  }
};

// Update Disaster Info
export const updateDisaster = async (req, res) => {
  const { id } = req.params;
  const {
    typeOfDisaster,
    description,
    contact,
    status,
    severity,
  } = req.body;
  const agencyId = req.user._id;

  try {
    // Fetching Old disaster
    const oldDisaster = await Disaster.findById(id);

    if (!oldDisaster) {
      return res
        .status(404)
        .json({ success: false, message: "No record found" });
    }

    // Check if the agency updating the disaster is authorized
    if (!oldDisaster.agencies.includes(agencyId)) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized to update this disaster" });
    }

    // Converting to Co-Ordinates
    const address = `${contact.address.street}, ${contact.address.city}, ${contact.address.state}, ${contact.address.postalCode}, ${contact.address.country}`;
    const geocodingResponse = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        address
      )}.json?access_token=${process.env.MAPBOX_API_KEY}`
    );

    const features = geocodingResponse.data.features;

    if (!features || features.length === 0) {
      return res.status(400).json({ success:false, message: "Invalid address" });
    }
    console.log("Coordinates are ->>", features[0].center);
    const coordinates = features[0].center;
    const swappedCoordinates = [coordinates[1], coordinates[0]];

    // Define and provide a valid timestamp for the disaster
    const timestamp = new Date();

    // Update disaster Info
    const updatedDisaster = await Disaster.findByIdAndUpdate(
      id,
      {
        typeOfDisaster: typeOfDisaster || oldDisaster.typeOfDisaster,
        timestamp: timestamp || oldDisaster.timestamp,
        contact: contact || oldDisaster.contact,
        description: description || oldDisaster.description,
        $addToSet: { agencies: agencyId }, // Add the new agency ID to the list
        status: status || oldDisaster.status,
        severity: severity || oldDisaster.severity,
        location: {
          type: "Point",
          coordinates: swappedCoordinates || oldDisaster.location.coordinates,
        },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: "Disaster Info updated",
      updatedDisaster,
    });
  } catch (error) {
    res.status(500).json({ success:false, message: "Internal server error", error });
  }
};


// Fetch a disaster
export const getDisaster = async (req, res) => {
  const { id } = req.params;
  try {
    const disaster = await Disaster.findById(id);
    if (!disaster) {
      return res.status(404).json({ success:false,message: "NO record found" });
    }
    res.status(200).json({ success: true, disaster });
  } catch (error) {
    res.status(500).json({ success:false, message: "Internal Server Error",error });
  }
};

// Fetch multiple disasters
export const fetchDisasters = async (req, res) => {
  try {
    const filter = filterResults(req.query);
    const disasters = await Disaster.find(filter).sort({ timestamp: -1 });

    res.status(200).json({ success: true,message:"All the disaster fetched successfully", disasters });
  } catch (error) {
    res.status(500).json({ success:false,message: "Internal server Error",error });
  }
};

// Fetch all agencies related to a specific disaster
export const getAgenciesForDisaster = async (req, res) => {
  try {
    const { id } = req.params;

    // Find the disaster by its ID and populate the agencies field
    const disaster = await Disaster.findById(id).populate('agencies');
    console.log(id);

    if (!disaster) {
      return res.status(404).json({ message: 'Disaster not found' });
    }

    // Extract the agencies from the populated disaster object
    const agencies = disaster.agencies;

    res.status(200).json(agencies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


export const deleteDisaster = async (req, res) => {
  try {
    const disasterId = req.params.disasterId;
    const ownerAgencyId = req.user._id; // Assuming you have authentication middleware

    // Find the disaster by ID
    const disaster = await Disaster.findById(disasterId);

    // Check if the disaster exists
    if (!disaster) {
      return res.status(404).json({ success: false, message: "Disaster not found" });
    }

    // Check if the requesting agency owns the disaster
    if (disaster.agencies.some(agencyId => agencyId.toString() !== ownerAgencyId.toString())) {
      return res.status(403).json({ success: false, message: "Permission denied. You are not the owner of this disaster." });
    }

    // Remove the disaster from the agencies' resources
    await Disaster.updateMany(
      { _id: { $in: disaster.agencies } },
      { $pull: { agencies: disasterId } }
    );

    // Delete the disaster
    await Disaster.findByIdAndRemove(disasterId);

    res.status(200).json({ success: true, message: "Disaster deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error deleting disaster", error });
  }
};
