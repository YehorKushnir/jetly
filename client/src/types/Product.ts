interface Review {
    _id: string
    username: string
    rating: string
    comment: string
    createdAt: string
}

export interface Variant {
    color: string
    price: number
    images: string[]
    sizes: string[]
}

export interface Product {
    _id: string
    name: string
    variants: Variant[]
    reviews: Review[]
    averageRating: number
    totalReviews: number
}