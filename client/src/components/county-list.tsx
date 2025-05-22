import {useStore} from '@/store.ts'
import {useQuery} from '@tanstack/react-query'
import {TicketService} from '@/services/TiketService.ts'
import type {Ticket} from '@/types/Ticket.ts'
import type {Airport} from '@/types/Airport.ts'
import {Button} from '@/components/ui/button.tsx'

type AirportWithTickets = {
    iata: string
    city: string
    name: string
    tickets: Ticket[]
}

type Result = {
    country: string
    airports: AirportWithTickets[]
}

const getMinPriceForAirport = (tickets: Ticket[]): number | null => {
    if (tickets.length === 0) return null

    return Math.min(...tickets.map(t => t.price.amount))
}

const getMinOfAirportMinPrices = (airports: AirportWithTickets[]): number | null => {
    const airportMinPrices: number[] = []

    for (const airport of airports) {
        const iata = airport.iata

        const relevant = airport.tickets.filter(
            t => t.departureAirport === iata || t.arrivalAirport === iata
        )

        if (relevant.length > 0) {
            const min = Math.min(...relevant.map(t => t.price.amount))
            airportMinPrices.push(min)
        }
    }

    if (airportMinPrices.length === 0) return null

    return Math.min(...airportMinPrices)
}

export const buildAirportStructure = (airports: Airport[], tickets: Ticket[]): Result[] => {
    const usedCodes = new Set<string>()
    tickets.forEach(t => {
        usedCodes.add(t.departureAirport)
        usedCodes.add(t.arrivalAirport)
    })

    const airportMap = new Map<string, Airport>()
    airports.forEach(a => {
        if (usedCodes.has(a.iata)) {
            airportMap.set(a.iata, a)
        }
    })

    const airportTickets = new Map<string, Ticket[]>()
    tickets.forEach(t => {
        const push = (iata: string) => {
            if (!airportTickets.has(iata)) airportTickets.set(iata, [])
            airportTickets.get(iata)!.push(t)
        }
        push(t.departureAirport)
        push(t.arrivalAirport)
    })

    const countries = new Map<string, Result["airports"]>()

    airportMap.forEach((airport, iata) => {
        const airportWithTickets = {
            iata,
            city: airport.city,
            name: airport.name,
            tickets: airportTickets.get(iata) || []
        }

        if (!countries.has(airport.country)) {
            countries.set(airport.country, [])
        }
        countries.get(airport.country)!.push(airportWithTickets)
    })

    return Array.from(countries.entries()).map(([country, airports]) => ({
        country,
        airports
    }))
}

export const buildAirportListForCountry = (countryName: string, airports: Airport[], tickets: Ticket[]): AirportWithTickets[] => {
    const usedCodes = new Set<string>()
    tickets.forEach(t => {
        usedCodes.add(t.departureAirport)
        usedCodes.add(t.arrivalAirport)
    })

    const airportMap = new Map<string, Airport>()
    airports.forEach(a => {
        if (usedCodes.has(a.iata) && a.country === countryName) {
            airportMap.set(a.iata, a)
        }
    })

    const airportTickets = new Map<string, Ticket[]>()
    tickets.forEach(t => {
        const push = (iata: string) => {
            if (!airportTickets.has(iata)) airportTickets.set(iata, [])
            airportTickets.get(iata)!.push(t)
        }
        push(t.departureAirport)
        push(t.arrivalAirport)
    })

    const result: AirportWithTickets[] = []

    airportMap.forEach((airport, iata) => {
        result.push({
            iata,
            city: airport.city,
            name: airport.name,
            tickets: airportTickets.get(iata) || []
        })
    })

    return result
}

const CountyList = () => {
    const tickets = useStore(state => state.tickets)
    const country = useStore(state => state.country)
    const setCountry = useStore(state => state.setCountry)

    const {data, isPending} = useQuery({
        queryKey: ['airports'],
        queryFn: async () => (await TicketService.getAirports()).data,
        refetchOnWindowFocus: false
    })

    if (isPending || !data) {
        return <>Loading</>
    }

    return (
        <div className={'min-w-[240px] h-full flex flex-col gap-4'}>
            <div className={'text-xl font-bold'}>
                {country ? (
                    <Button
                        variant={'ghost'}
                        onClick={() => setCountry('')}
                    >
                        Back to countries
                    </Button>
                ) : 'Countries'}
            </div>
            <div className={'h-full flex flex-col gap-4 overflow-y-auto'}>
                {country ? buildAirportListForCountry(country, data, tickets).map(({city, tickets}) => (
                    <Button
                        variant={'outline'}
                        className={'h-12 flex justify-between items-center gap-4 cursor-pointer'}
                    >
                        <div className={'flex flex-col items-start'}>
                            <div className={'text-lg font-bold'}>{city}</div>
                        </div>
                        <div className={'font-bold text-lg'}>
                            ${getMinPriceForAirport(tickets)}
                        </div>
                    </Button>
                )) : buildAirportStructure(data, tickets).map(({country, airports}) => (
                    <Button
                        variant={'outline'}
                        onClick={() => setCountry(country)}
                        className={'h-16 flex justify-between items-center gap-4 cursor-pointer'}
                    >
                        <div className={'flex flex-col items-start'}>
                            <div className={'text-lg font-bold'}>{country}</div>
                            <div className={'font-light text-sm'}>
                                {airports.length} {airports.length === 1 ? 'direction' : 'directions'}
                            </div>
                        </div>
                        <div className={'font-bold text-lg'}>
                            ${getMinOfAirportMinPrices(airports)}
                        </div>
                    </Button>
                ))}
            </div>
        </div>
    )
}

export default CountyList