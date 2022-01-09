import { Schema as _Schema, model } from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
const Schema = _Schema;

const userSchema = new Schema({
    email: String,
    username: {
        type: String,
        required: true
    },
    image: String,
    name: String,
    password: {
        type: String,
        required: true
    },
    position: {
        type: String,
        default: "Marketing"
    }
});

userSchema.plugin(passportLocalMongoose);

export default model("User", userSchema);