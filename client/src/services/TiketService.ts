import axios, {type AxiosResponse} from 'axios'
import type {Airport} from '@/types/Airport.ts'
import $api from '@/http'
import type {Ticket} from '@/types/Ticket.ts'

export class TicketService {
    static async getAirports(): Promise<AxiosResponse<Airport[]>> {
        return await axios.get<Airport[]>('/airports.json')
    }

    static async getTickets(query: string): Promise<AxiosResponse<Ticket[]>> {
        return await $api.get<Ticket[]>(`/ticket?${query}`)
    }
}