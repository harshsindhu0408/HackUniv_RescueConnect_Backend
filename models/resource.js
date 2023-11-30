import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
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
  ownerAgency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Agency",
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  availability: {
    type: Boolean,
    required: true,
    default: true,
  },
  sharedWith: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Agency',
    },
  ],
});

export default mongoose.model("Resources",resourceSchema);