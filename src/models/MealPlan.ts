import mongoose, { Document, Schema } from 'mongoose';

export interface IMealPlan extends Document {
  userId: string;
  creationDate: Date;
  type: 'AI Plan' | 'Chef Plan';
  cost: number;
  details: string;
  content: string;
  status: 'pending' | 'completed' | 'cancelled';
  chefId?: string;
  completedAt?: Date;
}

const MealPlanSchema = new Schema<IMealPlan>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  creationDate: {
    type: Date,
    default: Date.now
  },
  type: {
    type: String,
    enum: ['AI Plan', 'Chef Plan'],
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  details: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'cancelled'],
    default: 'pending'
  },
  chefId: {
    type: String,
    default: undefined
  },
  completedAt: {
    type: Date,
    default: undefined
  }
});

export default mongoose.models.MealPlan || mongoose.model<IMealPlan>('MealPlan', MealPlanSchema);