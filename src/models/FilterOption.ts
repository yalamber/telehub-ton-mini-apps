import mongoose from 'mongoose';

export interface FilterOption extends mongoose.Document {
  type: 'COUNTRY' | 'CITY' | 'LANGUAGE' | 'CATEGORY';
  label: string;
  value: string;
  parent: string;
}

/* PetSchema will correspond to a collection in your MongoDB database. */
const FilterOptionSchema = new mongoose.Schema<FilterOption>({
  type: {
    index: true,
    type: String,
    enum: ['COUNTRY', 'CITY', 'LANGUAGE', 'CATEGORY'],
    required: [true, 'Please provide a type.'],
  },
  parent: {
    type: String,
  },
  label: {
    type: String,
    required: [true, 'Please provide a label.'],
  },
  value: {
    type: String,
    required: [true, 'Please provide a value'],
  },
});

export default mongoose.models.FilterOption ||
  mongoose.model<FilterOption>('FilterOption', FilterOptionSchema);
