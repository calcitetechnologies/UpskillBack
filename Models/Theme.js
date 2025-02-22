const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ThemeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  sections: [
    {
      type: Schema.Types.ObjectId,
      ref: "Section"
    }
  ]
});

module.exports = mongoose.model("Theme", ThemeSchema);
