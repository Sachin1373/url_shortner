import mongoose from 'mongoose';

const clickSchema = new mongoose.Schema({
  linkId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Link',
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ipAddress: {
    type: String,
    required: true
  },
  userAgent: {
    type: String,
    required: true
  },
  device: {
    type: String,
    enum: ['Mobile', 'Desktop', 'Tablet'],
    required: true
  },
 
});

const Click = mongoose.model('Click', clickSchema);

export default Click;
