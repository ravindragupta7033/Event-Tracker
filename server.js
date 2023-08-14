const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const events = require('./events');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('Error connecting to MongoDB:', err);
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true })); // Use body-parser for form data

app.get('/', async (req, res) => {
    const allEvents = await events.getEvents();
    const upcomingEvents = await events.upcomingEvents();
    const ongoingEvents = await events.ongoingEvents();

    res.render('index', {
        events: allEvents,
        upcomingEvents,
        ongoingEvents
    });
});

app.post('/', async (req, res) => {
    const { name, site_link, registration_date, start_date, end_date } = req.body;

    // Convert date strings to Date objects
    const registrationDate = new Date(registration_date);
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);

    await events.addEvent(name, site_link, registrationDate, startDate, endDate);
    res.redirect('/');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});


