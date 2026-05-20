import mongoose from "mongoose";

const statsSchema = new mongoose.Schema(
  {
    visitors: { type: Number, default: 0 },
    visitedIPs: [{ type: String }],
  },
  { timestamps: true }
);

const Stats = mongoose.model("Stats", statsSchema);
export default Stats;