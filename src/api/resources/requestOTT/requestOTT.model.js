import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate';

const { Schema } = mongoose;
const requestOTTSchema = new Schema({
  user_ott_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'UserOTT'
  },
  content: {
    type: String
  },
  ott_type: {
    type: String
  },
  images: [],
  files: [],
  deleted: {type: Boolean, default: false}
},{
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  }
});
requestOTTSchema.plugin(mongoosePaginate);
export default mongoose.model('RequestOTT', requestOTTSchema);
