import mongoose, { Schema, Document } from "mongoose";

export interface IUserProfile {
  skills: string[];
  experience: number;
  domain: string;
  projects: string[];
  education: string;
  bio: string;
  xp: number;
  level: string;
  resumeAnalysis?: any;
}

export interface IUser extends Document {
  name: string;
  email: string;
  role: string;
  password?: string;
  profile?: IUserProfile;
  createdAt: Date;
  updatedAt: Date;
}

const ProfileSchema = new Schema({
  skills: { type: [String], default: [] },
  experience: { type: Number, default: 0 },
  domain: { type: String, default: "" },
  projects: { type: [String], default: [] },
  education: { type: String, default: "" },
  bio: { type: String, default: "" },
  xp: { type: Number, default: 0 },
  level: { type: String, default: "Explorer" },
  resumeAnalysis: { type: Schema.Types.Mixed, default: null },
}, { _id: false });

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    role: { type: String, default: "user" }, // user | admin
    password: { type: String, required: false }, // Optional for OAuth
    profile: { type: ProfileSchema, default: undefined },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

