import mongoose from "mongoose";

const alertSchema = new mongoose.Schema({
  senderAgency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agency',
    required: true,
  },
  recipientAgency: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agency',
    required: true,
  },
  severity: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  description: {
    type: String,
    required: true,
  },
});


export default mongoose.model("Alerts",alertSchema)