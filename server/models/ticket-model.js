const mongoose = require('mongoose')
const { Schema, model } = mongoose

const TicketSchema = new Schema({
    flightNumber: String,
    airline: String,
    departureAirport: String,
    arrivalAirport: String,
    departureTime: Date,
    arrivalTime: Date,
    durationMinutes: Number,
    price: {
        amount: Number,
        currency: { type: String, default: 'USD' }
    },
    cabinClass: { type: String, enum: ['economy', 'business', 'first'], default: 'economy' },
    seatsAvailable: Number,
    baggageIncluded: Boolean,
    isDirect: Boolean,
    bookingLink: String,
}, { timestamps: true })

module.exports = model('Ticket', TicketSchema)