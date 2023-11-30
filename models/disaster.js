import mongoose from "mongoose";

const disasterSchema = new mongoose.Schema({
  typeOfDisaster: {
    type: String,
    required: true,
    minlenght: 3,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  severity: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum:["active","inactive"],
    default:'active',
  },
  contact: {
    address: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      postalCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
    },
    coordinates: {
      type: [Number],
      index: "2dsphere",
    },
  },
  description: {
    type: String,
    default: "No discription available",
  },
  agencies: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Agency",
    },
  ],
});

export default mongoose.model("Disaster", disasterSchema);
