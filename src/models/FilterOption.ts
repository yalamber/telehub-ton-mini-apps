import mongoose from 'mongoose';

export interface FilterOptions extends mongoose.Document {
  label: string;
  value: string;
}

/* PetSchema will correspond to a collection in your MongoDB database. */
const FilterOptionSchena = new mongoose.Schema<FilterOptions>({
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
  mongoose.model<FilterOptions>('FilterOptions', FilterOptionSchena);
