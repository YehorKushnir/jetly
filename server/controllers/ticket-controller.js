const ticketService = require('../services/ticket-service')

class TicketController {
    async getAll(req, res) {
        try {
            const tickets = await ticketService.getAll(req.query)
            res.json(tickets)
        } catch (e) {
            res.status(500).json({ error: 'Ошибка при получении билетов' })
        }
    }

    async getById(req, res) {
        try {
            const ticket = await ticketService.getById(req.params.id)
            if (!ticket) return res.status(404).json({ error: 'Билет не найден' })
            res.json(ticket)
        } catch (e) {
            res.status(500).json({ error: 'Ошибка при получении билета' })
        }
    }
}

module.exports = new TicketController()