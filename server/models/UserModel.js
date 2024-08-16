import mongoose from "mongoose";
import { genSalt, hash } from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      require: [true, "Email is Required"],
      unique: true,
    },
    password: {
      type: String,
      require: [true, "Password is Required"],
    },
    firstName: {
      type: String,
      require: false,
    },
    lastName: {
      type: String,
      require: false,
    },
    img: {
      type: String,
      require: false,
      default: "",
    },
    color: {
      type: Number,
      require: false,
    },
    profileSetup: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  const salt = await genSalt();
  this.password = await hash(this.password, salt);
  next(); // to let server know that the above part is complete and proceed to next part of code
});

const User = mongoose.model("Users", userSchema);

export default User;
