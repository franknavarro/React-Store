import mongoose from 'mongoose';

const { String } = mongoose.Schema.Types;

const USER_ROLES = ['user', 'admin', 'root'];

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    role: {
      type: String,
      required: true,
      default: USER_ROLES[0],
      enum: USER_ROLES,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.User || mongoose.model('User', UserSchema);
