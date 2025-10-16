import mongoose, { Document, Schema } from 'mongoose';

export interface ITransaction extends Document {
  userId: string;
  date: Date;
  details: string;
  tokens: number;
  amount: number;
  currency: 'GBP' | 'EUR';
  type: 'Purchase' | 'MealPlan';
  mealPlanId?: string;
}

const TransactionSchema = new Schema<ITransaction>({
  userId: {
    type: String,
    required: true,
    index: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  details: {
    type: String,
    required: true
  },
  tokens: {
    type: Number,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    enum: ['GBP', 'EUR'],
    required: true
  },
  type: {
    type: String,
    enum: ['Purchase', 'MealPlan'],
    required: true
  },
  mealPlanId: {
    type: String,
    default: undefined
  }
});

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);