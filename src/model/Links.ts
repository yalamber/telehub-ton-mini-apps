import mongoose from 'mongoose';

export interface Links extends mongoose.Document {
  link: string;
  country: string;
  city: string;
  language: string;
  category: string;
  submittedBy: string;
}

/* PetSchema will correspond to a collection in your MongoDB database. */
const LinkSchema = new mongoose.Schema<Links>({
  link: {
    type: String,
    required: [true, 'Please provide a link.'],
    // maxlength: [60, "link cannot be more than 60 characters"],
  },
  country: {
    type: String,
    required: [true, 'Please provide the country'],
  },
  city: {
    type: String,
    required: [true, 'Please provide the city'],
  },
  language: {
    type: String,
    required: [true, 'Please provide the language'],
  },
  category: {
    type: String,
    required: [true, 'Please provide the category'],
  },
  submittedBy: {
    type: String,
    required: [true, 'Please provide who submitted'],
  },
});

export default mongoose.models.Pet || mongoose.model<Links>('Link', LinkSchema);
