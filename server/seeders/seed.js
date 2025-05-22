const fs = require('fs')
require('dotenv').config()
const mongoose = require('mongoose')
const { faker } = require('@faker-js/faker')
const Ticket = require('../models/ticket-model')

const airportsData = JSON.parse(fs.readFileSync('./airports.json', 'utf8'))
const airlines = JSON.parse(fs.readFileSync('./airlines.json', 'utf8'))

async function generateTickets(count = 100) {
    await mongoose.connect(process.env.DB_URL)

    const tickets = []

    for (let i = 0; i < count; i++) {
        const from = faker.helpers.arrayElement(airportsData)
        let to = faker.helpers.arrayElement(airportsData)
        while (to.iata === from.iata) to = faker.helpers.arrayElement(airportsData)

        const departureTime = faker.date.future()
        const duration = faker.number.int({ min: 60, max: 2000 }) // от 1 до 12 часов
        const arrivalTime = new Date(departureTime.getTime() + duration * 60000)

        tickets.push({
            flightNumber: faker.string.alpha({ length: 2, casing: 'upper' }) + faker.number.int({ min: 100, max: 999 }),
            airline: faker.helpers.arrayElement(airlines),
            departureAirport: from.iata,
            arrivalAirport: to.iata,
            departureCity: from.city,
            arrivalCity: to.city,
            departureTime,
            arrivalTime,
            durationMinutes: duration,
            price: {
                amount: faker.number.int({ min: 50, max: 1000 }),
                currency: 'USD',
            },
            cabinClass: faker.helpers.arrayElement(['economy', 'business']),
            seatsAvailable: faker.number.int({ min: 0, max: 150 }),
            baggageIncluded: faker.datatype.boolean(),
            isDirect: faker.datatype.boolean(),
        })
    }

    await Ticket.insertMany(tickets)
    console.log(`✅ Inserted ${count} fake tickets`)
    process.exit()
}

generateTickets(100000)