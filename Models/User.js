const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LinkedInSchema = new Schema(
  {
    tokenResponse: { type: Object },
    userInfo: { type: Object },
  },
  { _id: false }
);

const GoogleSchema = new Schema(
  {
    tokenResponse: { type: Object },
    userInfo: { type: Object },
  },
  { _id: false }
);

const AppleSchema = new Schema(
  {
    tokenResponse: { type: Object },
    userInfo: { type: Object },
  },
  { _id: false }
);

const UserSchema = new Schema(
  {
    //  Authentication Method
    authMethod: {
      type: String,
      enum: ["local", "linkedin", "google", "apple"],
      default: "local",
    },

    //  Local Auth Fields
    username: {
      type: String,
      required: function () {
        return this.authMethod === "local";
      },
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: function () {
        return this.authMethod === "local";
      },
    },

    //  Social Login Fields
    linkedin: {
      type: LinkedInSchema,
      required: function () {
        return this.authMethod === "linkedin";
      },
    },
    google: {
      type: GoogleSchema,
      required: function () {
        return this.authMethod === "google";
      },
    },
    apple: {
      type: AppleSchema,
      required: function () {
        return this.authMethod === "apple";
      },
    },

    //  Link to UserProgress Document
    userProgress: {
      type: Schema.Types.ObjectId,
      ref: "UserProgress",
    },

    // Activity & Meta Data
    lastLogin: {
      type: Date,
      default: Date.now,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
