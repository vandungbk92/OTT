import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const { Schema } = mongoose;
const userOTTSchema = new Schema({
  ott_type: {
    type: String,
    required: true,
  },
  document_id: {
    type: String
  },
  full_name: {
    type: String
  },
  username: {
    type: String
  },
  email: {
    type: String
  },
  link: {
    type: String
  }
},{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});
userOTTSchema.plugin(mongoosePaginate);
export default mongoose.model('UserOTT', userOTTSchema)
