import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  uid: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  tokenBalance: number;
  role?: 'admin';
  createdAt: Date;
  orders?: string[];
  purchases?: string[];
}

const UserSchema = new Schema<IUser>({
  uid: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  displayName: {
    type: String,
    default: null
  },
  email: {
    type: String,
    default: null
  },
  photoURL: {
    type: String,
    default: null
  },
  tokenBalance: {
    type: Number,
    default: 2000 // Free tokens on signup
  },
  role: {
    type: String,
    enum: ['admin'],
    default: undefined
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  orders: [{
    type: Schema.Types.ObjectId,
    ref: 'MealPlan'
  }],
  purchases: [{
    type: Schema.Types.ObjectId,
    ref: 'Transaction'
  }]
});

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);