import axios from "axios";
import Agency from "../models/agency.js";
import Disaster from "../models/disaster.js";
import Resource from "../models/resource.js";
import jwt from "jsonwebtoken";
import { comparePassword, hashPassword } from "../helpers/bcrypt.js";

// registerAgency controller
export const registerAgency = async (req, res) => {
  try {
    const { name, email, password, contact, phoneNumber, expertise } = req.body;
    if (
      !name ||
      !email ||
      !password ||
      !contact ||
      !phoneNumber ||
      !expertise
    ) {
      return res.status(404).send({
        success: false,
        message: "All the fields are Mendatory",
      });
    }

    const exixtingAgency = await Agency.findOne({ email });
    if (exixtingAgency) {
      return res.status(400).send({
        success: false,
        message: "User is Already Register please login",
      });
    }

    // Use a geocoding service to convert the complete address to coordinates
    const address = `${contact.address.street}, ${contact.address.city}, ${contact.address.state}, ${contact.address.postalCode}, ${contact.address.country}`;
    const geocodingResponse = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        address
      )}.json?access_token=${process.env.MAPBOX_API_KEY}`
    );

    const features = geocodingResponse.data.features;

    if (!features || features.length === 0) {
      return res.status(400).json({ message: "Invalid address" });
    }
    console.log("Coordinates are ->>", features[0].center);
    const coordinates = features[0].center;
    const swappedCoordinates = [coordinates[1], coordinates[0]];

    const hashedPassword = await hashPassword(password);
    const agency = new Agency({
      name,
      email,
      password: hashedPassword,
      contact,
      phoneNumber,
      expertise,
    });
    agency.location = {
      type: "Point",
      coordinates: swappedCoordinates,
    };

    // Save the agency to the database
    await agency.save();

    res.status(201).json({
      success: true,
      message: "Agency registered successfully",
      agency,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Something went wrong", error });
  }
};

// loginAgency controller
export const loginAgency = async (req, res) => {
  try {
    const { email, password } = req.body;
    //vaildation
    if (!email || !password) {
      return res.status(404).send({
        success: false,
        message: "Invalid email or password",
      });
    }
    //check agency
    const user = await Agency.findOne({ email });
    if (!user) {
      return res.status(401).send({
        success: false,
        message: "This email is not registered with us",
      });
    }

    const match = await comparePassword(password, user.password);
    if (!match) {
      return res.status(400).send({
        success: false,
        message: "Invalid password or email",
      });
    }

    //token
    const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECERT, {
      expiresIn: "7d",
    });
    res.status(200).send({
      success: true,
      message: "login successfully",
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

//forgotpasswordController
export const updatePassword = async (req, res) => {
  try {
    const { oldpassword, newpassword } = req.body;
    if (!oldpassword || !newpassword) {
      res.status(400).send({ success:false, message: "All fields are mandatory" });
    }

    const agencyId = req.user._id; // Change the parameter name to agencyId
    console.log(agencyId);

    // Find the agency by ID
    const user = await Agency.findById(agencyId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "not Registered",
      });
    }

    const match = await comparePassword(oldpassword, user.password);
    if (!match) {
      return res.status(400).send({
        success: false,
        message: "Enter your old password correctly",
      });
    }

    const hashed = await hashPassword(newpassword);
    await Agency.findByIdAndUpdate(user._id, { password: hashed });
    res.status(200).send({
      success: true,
      message: "Password Reset Successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
};

// update agency controller
export const updateAgency = async (req, res) => {
  try {
    const { name, email, contact, phone, expertise } = req.body;
    const agency = await Agency.findById(req.user._id);

    // Check if the agency exists
    if (!agency) {
      return res.status(404).json({ success:false, message: "Agency not found" });
    }

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
    const coordinates = features[0].center;
    const swappedCoordinates = [coordinates[1], coordinates[0]];

    agency.name = name || agency.name;
    agency.email = email || agency.email;
    agency.contact = contact || agency.contact;
    agency.phone = phone;
    console.log("Phone ->", phone);
    agency.expertise = expertise || agency.expertise;

    // Update the location coordinates
    agency.location = {
      type: "Point",
      coordinates: swappedCoordinates,
    };

    // Save the updated agency to the database
    const updatedAgency = await agency.save();

    res
      .status(200)
      .json({success:true, message: "Agency updated successfully", updatedAgency });
  } catch (error) {
    console.error(error);
    res.status(500).json({success:false, message: "Error updating agency", error });
  }
};

// get agency controller
export const getAllAgencyLocations = async (req, res) => {
  try {
    // Query all agencies in the database
    const agencies = await Agency.find();

    // Extract relevant information, including location, for each agency
    const agencyLocations = agencies.map((agency) => {
      return {
        _id: agency._id,
        name: agency.name,
        contact: agency.contact,
        location: agency.location,
      };
    });

    res.status(200).json({
      success:true,
      message: "All agency locations retrieved successfully",
      agencies: agencyLocations,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success:false, message: "Error fetching agency locations", error });
  }
};

// getAgencyResourcesAndDisasters
export const getAgencyResourcesAndDisasters = async (req, res) => {
  try {
    const agencyId = req.user._id; // Change the parameter name to agencyId
    console.log(agencyId);

    // Find the agency by ID
    const agency = await Agency.findById(agencyId).select('-password');

    if (!agency) {
      return res.status(404).json({ success:false, message: "Agency not found" });
    }

    // Retrieve all resources associated with the agency
    const resources = await Resource.find({ ownerAgency: agency._id });

    // Retrieve all disasters in which the agency has worked
    const disasters = await Disaster.find({ agencies: agency._id });

    res.status(200).json({
      message: "Agency resources and disasters retrieved successfully",
      agency,
      resources,
      disasters,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success:false,
      message: "Error retrieving agency resources and disasters",
      error,
    });
  }
};

export const agencyProfile = async (req, res) => {
  try {
    // Fetch the agency from the database by ID and exclude the 'password' field
    const agency = await Agency.findById(req.user._id).select('-password');

    // Check if the agency with the provided ID exists
    if (!agency) {
      return res.status(404).json({ message: 'Agency not found' });
    }

    // If the agency is found, send it as a response
    res.status(200).json({ agency });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const findAgency = async(req, res) => {
  try{
    const { id } = req.params;
    const agency = await Agency.findById(id);
    if (!agency) {
      return res.status(201).json({ message: 'Agency not found' });
    }

    const resources = await Resource.find({ ownerAgency: agency._id });

    // Retrieve all disasters in which the agency has worked
    const disasters = await Disaster.find({ agencies: agency._id });


    res.status(200).json({ agency, resources, disasters });
  }catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const findAllAgencies = async (req, res) => {
  try{

    const agency = await Agency.find();
    if (!agency) {
      return res.status(201).json({ message: 'Agency not found' });
    }
    res.status(200).json({ agency });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


