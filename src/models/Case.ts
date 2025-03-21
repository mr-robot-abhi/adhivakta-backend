import mongoose, { Schema } from "mongoose";

const caseSchema = new Schema({
  caseName: { type: String, required: true },
  caseNumber: { type: String, required: true },
  caseDate: { type: Date, required: true },
  advocateOnRecord: { type: Schema.Types.ObjectId, ref: "User", required: true },
  courtType: { type: String, required: true },
  hearingDates: [{ date: Date, outcome: String }],
  documents: [{ fileName: String, path: String, uploadedAt: Date }],
  status: { type: String, enum: ["open", "closed"], default: "open" },
});

export default mongoose.model("Case", caseSchema);