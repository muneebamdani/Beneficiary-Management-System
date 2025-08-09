const mongoose = require('mongoose');

const beneficiarySchema = new mongoose.Schema({
  cnic: { type: String, required: true, unique: true },
  name: String,
  phone: String,
  address: String,
  purpose: String,
  tokenID: { type: String, unique: true },
  status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
  remarks: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

beneficiarySchema.pre('save', async function(next) {
  if (!this.tokenID) {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    const count = await this.constructor.countDocuments({
      createdAt: { $gte: new Date().setHours(0, 0, 0, 0) }
    });
    this.tokenID = `${today}${String(count + 1).padStart(3, '0')}`;
  }
  next();
});

module.exports = mongoose.model('Beneficiary', beneficiarySchema);
