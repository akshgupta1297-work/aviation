const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const toJSON = require("../models/plugins/toJSON.plugin");
const paginate = require("../models/plugins/paginate.plugin");

const adminSchema = new mongoose.Schema(
  {
    adminId: {
      type: String,
      unique: true,
    },
    role: {
      type: String,
      default: "Admin",
    },
    firstName: {
      type: String,
      required: [true, "firstName is required"],
    },
    lastName: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email Id is already present"],
      validator(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Email is inValid");
        }
      },
    },
    password: {
      type: String,
      minlength: 8,
      validate(value) {
        if (
          !value.match(
            /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
          )
        ) {
          throw new Error(
            "password must contain At least one lower case and At least one upper case English letter and 1 number"
          );
        }
      },
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
adminSchema.plugin(toJSON);
adminSchema.plugin(paginate);

adminSchema.methods.isPasswordMatch = async function (oldPassword) {
  const admin = this;
  return bcrypt.compare(oldPassword, admin.password);
};

adminSchema.pre("save", async function (next) {
  const admin = this;
  if (admin.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    admin.password = await bcrypt.hash(admin.password, salt);
  }
  next();
});

adminSchema.pre("save", function (next) {
  if (this.isNew) {
    const { adminId } = this;
    if (!adminId || typeof adminId !== "string") {
      this.adminId = crypto.randomUUID();
    }
    this._md = { ...this._md, createdBy: this.adminId, createdDtm: new Date() };
  }
  next();
});

const Admin = mongoose.model("Admin", adminSchema);

module.exports = Admin;
