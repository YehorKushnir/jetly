export interface Ticket {
    _id: string
    flightNumber: string
    airline: string
    departureAirport: string
    arrivalAirport: string
    departureTime: Date
    arrivalTime: Date
    durationMinutes: number
    price: {
        amount: number
        currency: string
    }
    cabinClass: 'economy' | 'business' | 'first'
    seatsAvailable: number
    baggageIncluded: boolean
    isDirect: boolean
    bookingLink: string
}