import mongoose from 'mongoose';

export interface Link extends mongoose.Document {
  link: String;
  country: String;
  city: String;
  language: String;
  category: String;
  submittedById: Number;
  memberCount: Number;
  photo: String;
  status: 'APPROVED' | 'PENDING' | 'NOT_APPROVED';
}

/* PetSchema will correspond to a collection in your MongoDB database. */
const LinkSchema = new mongoose.Schema<Link>({
  link: {
    unique: true,
    type: String,
    required: [true, 'Please provide a link.'],
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
  },
  submittedById: {
    type: Number,
    required: [true, 'Please provide who submitted'],
  },
  memberCount: {
    type: Number,
  },
  photo: {
    type: String,
  },
  status: {
    type: String,
    enum: ['APPROVED', 'PENDING', 'NOT_APPROVED'],
    default: 'PENDING',
  },
});

export default mongoose.models.Link || mongoose.model<Link>('Link', LinkSchema);
