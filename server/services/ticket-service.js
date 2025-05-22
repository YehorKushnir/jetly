const Ticket = require('../models/ticket-model')

class TicketService {
    async getAll(filters = {}) {
        const query = {}

        if (filters.from) query.departureAirport = filters.from
        if (filters.to) query.arrivalAirport = filters.to
        if (filters.cabinClass) query.cabinClass = filters.cabinClass
        if (filters.baggageIncluded === 'true') query.baggageIncluded = true
        if (filters.isDirect === 'true') query.isDirect = true
        if (filters.departureDate) {
            const date = new Date(filters.departureDate)
            const nextDay = new Date(date)
            nextDay.setDate(date.getDate() + 1)
            query.departureTime = { $gte: date, $lt: nextDay }
        }
        if (filters.arrivalDate) {
            const date = new Date(filters.arrivalDate)
            const nextDay = new Date(date)
            nextDay.setDate(date.getDate() + 1)
            query.arrivalTime = { $gte: date, $lt: nextDay }
        }

        return Ticket.find(query).sort({ departureTime: 1 })
    }

    async getById(id) {
        return Ticket.findById(id)
    }
}

module.exports = new TicketService()