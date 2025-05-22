import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import {useQuery} from '@tanstack/react-query'
import {TicketService} from '@/services/TiketService.ts'
import type {Airport} from '@/types/Airport.ts'
import type {Ticket} from '@/types/Ticket.ts'
import {useStore} from '@/store.ts'
import { useEffect } from "react"

type CityWithTickets = {
    city: string
    country: string
    lat: number | null
    lng: number | null
    airports: string[]
    tickets: Ticket[]
}

function buildCityListFromTickets(
    airports: Airport[],
    tickets: Ticket[]
): CityWithTickets[] {
    const airportMap = new Map<string, Airport>()
    airports.forEach(a => airportMap.set(a.iata, a))

    const cityMap = new Map<string, CityWithTickets>()

    tickets.forEach(ticket => {
        const iatas = [ticket.departureAirport, ticket.arrivalAirport]

        iatas.forEach(iata => {
            const airport = airportMap.get(iata)
            if (!airport) return

            const key = `${airport.city}|${airport.country}`
            if (!cityMap.has(key)) {
                cityMap.set(key, {
                    city: airport.city,
                    country: airport.country,
                    lat: +airport.lat,
                    lng: +airport.lng,
                    airports: [],
                    tickets: []
                })
            }

            const cityEntry = cityMap.get(key)!
            if (!cityEntry.airports.includes(iata)) {
                cityEntry.airports.push(iata)
            }
            cityEntry.tickets.push(ticket)
        })
    })

    return Array.from(cityMap.values())
}

const MapUpdater = ({ cities, country }: { cities: CityWithTickets[]; country: string | null }) => {
    const map = useMap()
    useEffect(() => {
        if (country && cities.length > 0) {
            const bounds = L.latLngBounds(
                cities
                    .filter(c => c.country === country && c.lat !== null && c.lng !== null)
                    .map(c => [c.lat!, c.lng!] as [number, number])
            )
            if (bounds.isValid()) {
                map.fitBounds(bounds, { padding: [80, 80], maxZoom: 6 })
            }
        } else {
            map.flyTo([20, 0], 2, {duration: 0.5})
        }
    }, [cities, country])
    return null
}

const CountryMap = () => {
    const tickets = useStore(state => state.tickets)
    const country = useStore(state => state.country)

    const {data, isPending} = useQuery({
        queryKey: ['airports'],
        queryFn: async () => (await TicketService.getAirports()).data,
        refetchOnWindowFocus: false
    })

    if (isPending || !data) {
        return <>Loading</>
    }

    const visibleCities = buildCityListFromTickets(data, tickets)

    return (
        <MapContainer
            center={[20, 0]}
            zoom={2}
            scrollWheelZoom
            className="w-full h-full rounded-xl z-0"
        >
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="&copy; OpenStreetMap contributors"
            />
            <MapUpdater cities={visibleCities} country={country} />

            {visibleCities.map((a) =>
                a.lat && a.lng ? (
                    <Marker key={a.city} position={[a.lat, a.lng]}>
                        <Popup>
                            {a.city}, {a.country}
                        </Popup>
                    </Marker>
                ) : null
            )}
        </MapContainer>
    )
}

export default CountryMap