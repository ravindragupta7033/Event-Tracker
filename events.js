const mongoose = require('mongoose');

// Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/event_tracker', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => {
//     console.log('Connected to MongoDB');
// }).catch(err => {
//     console.error('Error connecting to MongoDB:', err);
// });

const eventSchema = new mongoose.Schema({
    name: String,
    site_link: String,
    registration_date: Date,
    start_date: Date,
    end_date: Date
});

const Event = mongoose.model('Event', eventSchema);

module.exports = {
    addEvent: async (name, site_link, registration_date, start_date, end_date) => {
        const event = new Event({
            name,
            site_link,
            registration_date,
            start_date,
            end_date
        });
        await event.save();
    },
    getEvents: async () => await Event.find(),
    upcomingEvents: async () => await Event.find({ start_date: { $gt: new Date() } }),
    ongoingEvents: async () => await Event.find({ start_date: { $lte: new Date() }, end_date: { $gte: new Date() } })
};
