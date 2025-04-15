import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import bcrypt from "bcryptjs";
import validator from "validator";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 100,
    },
    emailId: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value))
          throw new Error("Invalid email format" + value);
      },
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      validate(value) {
        if (!validator.isStrongPassword(value))
          throw new Error("password is not strong");
      },
    },

    resetPasswordOTP: {
      type: String,
      default: null,
    },
    resetPasswordOTPExpires: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

userSchema.methods.validatePassword = async function (userEnteredPassword) {
  const user = this;
  return await bcrypt.compare(userEnteredPassword, user.password);
};

export default mongoose.model("User", userSchema);
