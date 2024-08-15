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
  featuredType: 'NONE' | 'TRENDING' | 'NEW';
}

/* PetSchema will correspond to a collection in your MongoDB database. */
const LinkSchema = new mongoose.Schema<Link>(
  {
    link: {
      unique: true,
      type: String,
      required: [true, 'Please provide a link.'],
    },
    type: {
      type: String,
      enum: ['CHANNEL', 'GROUP'],
    },
    title: {
      type: String,
      required: [true, 'Please provide a title.'],
    },
    about: {
      type: String,
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
      enum: ['TRENDING', 'NEW', 'NONE'],
      default: 'NONE',
    },
  },
  { timestamps: true }
);

// Add single-field indexes
LinkSchema.index({ country: 1 });
LinkSchema.index({ city: 1 });
LinkSchema.index({ language: 1 });
LinkSchema.index({ category: 1 });
LinkSchema.index({ type: 1 });
LinkSchema.index({ status: 1 });
LinkSchema.index({ featuredType: 1 });

// Add compound indexes for common query patterns
LinkSchema.index({ country: 1, city: 1 });
LinkSchema.index({ country: 1, language: 1 });
LinkSchema.index({ country: 1, category: 1 });
LinkSchema.index({ status: 1, featuredType: 1 });

export default mongoose.models.Link || mongoose.model<Link>('Link', LinkSchema);
