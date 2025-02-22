  const mongoose = require("mongoose");
  const Schema = mongoose.Schema;

  const UserBadgesSchema = new Schema({
    user_id: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    badge_id: {
      type: Schema.Types.ObjectId,
      ref: "Badge",
      required: true,
    },
  });

  module.exports = mongoose.model("UserBadges", UserBadgesSchema);