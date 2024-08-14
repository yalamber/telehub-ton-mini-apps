import mongoose from 'mongoose';

export interface Link extends mongoose.Document {
  link: String;
  title: String;
  about: String;
  country: String;
  city: String;
  language: String;
  category: String;
  submittedById: Number;
  memberCount: Number;
  photo: String;
  type: 'CHANNEL' | 'GROUP';
  status: 'APPROVED' | 'PENDING' | 'NOT_APPROVED';
  featuredType: 'TRENDING' | 'NEW';
}

/* PetSchema will correspond to a collection in your MongoDB database. */
const LinkSchema = new mongoose.Schema<Link>({
  link: {
    unique: true,
    type: String,
    required: [true, 'Please provide a link.'],
  },
  type: {
    type: String,
    enum: ['CHANNEL', 'GROUP'],
  },
  about: {
    type: String,
  },
  title: {
    type: String,
    required: [true, 'Please provide a title.'],
  },
  country: {
    type: String,
    required: [true, 'Please provide the country'],
  },
  city: {
    type: String,
  },
  language: {
    type: String,
    required: [true, 'Please provide the language'],
  },
  category: {
    type: String,
    required: [true, 'Please provide the city'],
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
  featuredType: {
    type: String,
    enum: ['TRENDING', 'NEW'],
    default: 'NEW',
  },
});

export default mongoose.models.Link || mongoose.model<Link>('Link', LinkSchema);
