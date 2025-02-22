const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ModuleSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
  },
  skill_id: {
    type: Schema.Types.ObjectId,
    ref: "Skill",
  },
  video_id: {
    type: Schema.Types.ObjectId,
    ref: "Video",
    unique: true
  },
  prerequisites: {
    type: [Schema.Types.ObjectId],
    ref: "Module",
    default: [],
  },
  section_id: {
    type: Schema.Types.ObjectId,
    ref: "Section",
    required: true,
  },
});

module.exports = mongoose.model("Module", ModuleSchema);
