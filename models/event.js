const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const eventSchema = new Schema({
    title: { type: String, required: [true, 'Title is required'] },
    category: { type: String, required: [true, 'Category is required'] },
    content: { type: String, required: [true, 'Content is required'], minLength: [10, 'The content should have at least 10 characters'] },
    location: { type: String, required: [true, 'Location is required'] },
    start: { type: Date, required: [true, 'Start Date/Time is required'] },
    end: { type: Date, required: [true, 'End Date/Time is required'] },
    image: { type: String, required: [true, 'Image is required'] },
    host: {type: Schema.Types.ObjectId, ref: 'User' },
    rsvps: [{ type: Schema.Types.ObjectId, ref: 'RSVP' }],
}, { timestamps: true });
//collection name is events in the database
module.exports = mongoose.model('event', eventSchema);


