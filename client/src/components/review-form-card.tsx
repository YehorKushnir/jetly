import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"
import { useState } from "react"
import {useMutation, useQueryClient} from '@tanstack/react-query'
import {useParams} from 'react-router'
import {ProductService} from '@/services/ProductService.ts'
import {toast} from 'sonner'
import type {AxiosError} from 'axios'

const reviewSchema = z.object({
    rating: z.number().min(1, "Please select a rating"),
    comment: z.string().optional(),
})

export type ReviewFormValues = z.infer<typeof reviewSchema>

export function ReviewFormCard() {
    const {id} = useParams()
    if (!id) return <>Error...</>

    const form = useForm<ReviewFormValues>({
        resolver: zodResolver(reviewSchema)
    })

    const [hoverRating, setHoverRating] = useState(0)

    const handleRatingClick = (value: number) => {
        form.setValue("rating", value)
    }

    const queryClient = useQueryClient()

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: ReviewFormValues) => {
            await ProductService.review(id, data)
        },
        onSuccess: async () => {
            form.reset()
            await queryClient.invalidateQueries({ queryKey: ["product", id] })
        },
        onError: (error: AxiosError) => {
            if (error.status === 401) {
                toast('You should authenticate to review a product')
            }
        }
    })

    return (
        <Card className="w-full h-fit md:max-w-md">
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit((data) => mutate(data))} className="flex flex-col gap-4">
                        <FormField
                            control={form.control}
                            name="rating"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Rating</FormLabel>
                                    <FormControl>
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    onMouseEnter={() => setHoverRating(star)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    onClick={() => handleRatingClick(star)}
                                                    className={`w-5 h-5 cursor-pointer transition ${
                                                        (hoverRating || field.value) >= star
                                                            ? "fill-yellow-500 text-yellow-500"
                                                            : "text-gray-400"
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="comment"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Comment (optional)</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Write your thoughts..." rows={3} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <Button type="submit" disabled={isPending}>
                            {isPending ? "Submitting..." : "Submit Review"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}