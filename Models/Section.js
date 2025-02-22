const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SectionSchema = new Schema({
  theme_id: {
    type: Schema.Types.ObjectId,
    ref: "Theme",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  modules: [
    {
      type: Schema.Types.ObjectId,
      ref: "Module"
    }
  ] 
});

module.exports = mongoose.model("Section", SectionSchema);
