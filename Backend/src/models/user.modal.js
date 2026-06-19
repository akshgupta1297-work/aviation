const mongoose = require("mongoose");
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const toJSON = require("../models/plugins/toJSON.plugin");
const paginate = require("../models/plugins/paginate.plugin");

const userSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            unique: true,
        },
        role: {
            type: String,
            default: "User",
        },
        firstName: {
            type: String,
            required: [true, "firstName is required"],
        },
        lastName: {
            type: String,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        number: {
            type: String,
            required: [true, "number is required"],
            unique: [true, "Phone No. is already present"],
            validator(value) {
                if (!validator.isMobilePhone(value)) {
                    throw new Error("Phone No. is inValid");
                }
            },
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
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

userSchema.methods.isPasswordMatch = async function (oldPassword) {
    const user = this;
    return bcrypt.compare(oldPassword, user.password);
};

userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified("password")) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
    }
    next();
});

userSchema.pre("save", function (next) {
    if (this.isNew) {
        const { userId } = this;
        if (!userId || typeof userId !== "string") {
            this.userId = crypto.randomUUID();
        }
        this._md = { ...this._md, createdBy: this.userId, createdDtm: new Date() };
    }
    next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
