import $api from '../http'
import type {AxiosResponse} from 'axios'
import type {Product} from '@/types/Product.ts'
import type {ReviewFormValues} from '@/components/review-form-card.tsx'

export class ProductService {
    static async getAll(): Promise<AxiosResponse<Product[]>> {
        return await $api.get<Product[]>('/product')
    }
    static async getById(id: string): Promise<AxiosResponse<Product>> {
        return await $api.get<Product>(`/product/${id}`)
    }
    static async create(data: FormData) {
        await $api.post('/product', data)
    }
    static async update(id: string): Promise<AxiosResponse<Product>> {
        return await $api.put(`/product:${id}`)
    }
    static async remove(id: string): Promise<AxiosResponse<{message: string}>> {
        return await $api.delete(`/product:${id}`)
    }
    static async review(id: string, data: ReviewFormValues): Promise<AxiosResponse<Product>> {
        return await $api.post(`/product/${id}/review`, data)
    }
}