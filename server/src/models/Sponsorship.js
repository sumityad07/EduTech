const mongoose = require('mongoose');

const sponsorshipSchema = new mongoose.Schema({
    sponsor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, default: 0 },
    startDate: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
    notes: { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Sponsorship', sponsorshipSchema);
