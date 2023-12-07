// models/rsvp.js

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rsvpSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    event: { type: Schema.Types.ObjectId, ref: 'event', required: true },
    status: { type: String, enum: ['YES', 'NO', 'MAYBE'], required: true },
}, { timestamps: true });

module.exports = mongoose.model('RSVP', rsvpSchema);
