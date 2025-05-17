"use client"

import { useForm, useFieldArray } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { useMutation } from "@tanstack/react-query"
import {ProductService} from '@/services/ProductService.ts'
import {toast} from 'sonner'
import type {AxiosError} from 'axios'

const variantSchema = z.object({
    color: z.string().min(1, "Color is required"),
    price: z.coerce.number().positive("Price must be positive"),
    images: z.array(z.instanceof(File)).min(1, "At least one image required"),
    sizes: z.array(z.string().min(1)).min(1, "At least one size required"),
})

const productSchema = z.object({
    name: z.string().min(2),
    variants: z.array(variantSchema).min(1, "At least one variant is required")
})

export type ProductFormValues = z.infer<typeof productSchema>

export default function AdminPage() {
    const form = useForm<ProductFormValues>({
        resolver: zodResolver(productSchema),
        defaultValues: {
            name: "",
            variants: [
                { color: "", price: 0, images: [], sizes: [""] }
            ],
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "variants"
    })

    const { mutate, isPending } = useMutation({
        mutationFn: async (data: ProductFormValues) => {
            const formData = new FormData()
            formData.append("name", data.name)

            data.variants.forEach((variant, i) => {
                formData.append(`variants[${i}][color]`, variant.color)
                formData.append(`variants[${i}][price]`, variant.price.toString())
                variant.sizes.forEach((size, j) => {
                    formData.append(`variants[${i}][sizes][${j}]`, size)
                })
                variant.images.forEach((file) => {
                    formData.append(`variants[${i}][images]`, file)
                })
            })

            await ProductService.create(formData)
        },
        onSuccess: () => {

        },
        onError: (error: AxiosError<{message?: string}>) => {
            toast(error.response?.data?.message || "Something went wrong")
        }
    })

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Add Product</h1>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit((data) => mutate(data))}
                    className="flex flex-col gap-6"
                >
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nike Air Max" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {fields.map((field, index) => (
                        <div key={field.id} className="border rounded-lg p-4 space-y-4">
                            <h2 className="font-semibold">Variant {index + 1}</h2>

                            <FormField
                                control={form.control}
                                name={`variants.${index}.color`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Color</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Black" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={`variants.${index}.price`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Price</FormLabel>
                                        <FormControl>
                                            <Input type="number" placeholder="99.99" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={`variants.${index}.images`}
                                render={({ field: { onChange, value, ...fieldProps } }) => (
                                    <FormItem>
                                        <FormLabel>Images</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                onChange={(e) => {
                                                    const files = Array.from(e.target.files || [])
                                                    onChange(files)
                                                }}
                                                {...fieldProps}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name={`variants.${index}.sizes`}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Sizes (comma-separated)</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="40, 41, 42"
                                                onChange={(e) => {
                                                    const sizes = e.target.value.split(",").map(s => s.trim())
                                                    field.onChange(sizes)
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {fields.length > 1 && (
                                <Button type="button" variant="destructive" onClick={() => remove(index)}>
                                    Remove Variant
                                </Button>
                            )}
                        </div>
                    ))}

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => append({ color: "", price: 0, images: [], sizes: [""] })}
                    >
                        Add Variant
                    </Button>

                    <Button type="submit" disabled={isPending}>
                        {isPending ? "Submitting..." : "Add Product"}
                    </Button>
                </form>
            </Form>
        </div>
    )
}
