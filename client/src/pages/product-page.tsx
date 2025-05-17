import {useParams} from "react-router"
import {useQuery} from '@tanstack/react-query'
import {ProductService} from '@/services/ProductService.ts'
import {Skeleton} from '@/components/ui/skeleton.tsx'
import {sizes} from '@/utils/sizes.ts'
import {Button} from '@/components/ui/button.tsx'
import {Star} from 'lucide-react'
import {useEffect, useState} from 'react'
import type {Variant} from '@/types/Product.ts'
import {Avatar, AvatarFallback} from "@/components/ui/avatar"
import {Card, CardContent} from '@/components/ui/card.tsx'
import {format} from 'date-fns'
import {ReviewFormCard} from '@/components/review-form-card.tsx'
import {Carousel, CarouselContent, CarouselItem} from '@/components/ui/carousel.tsx'
import {API_URL} from '@/http'

const ProductPage = () => {
    const {id} = useParams()
    if (!id) return <>Error...</>

    const [variant, setVariant] = useState<Variant | undefined>(undefined)
    const [size, setSize] = useState('')
    const [image, setImage] = useState('')

    const {isPending, error, data} = useQuery({
        queryKey: ['product', id],
        queryFn: () => ProductService.getById(id).then(res => res.data)
    })

    useEffect(() => {
        if (data) {
            setVariant(data.variants[0])
            setImage(data.variants[0].images[0])
            setSize(data.variants[0].sizes[0])
        }
    }, [data])

    const handeVariant = (variant: Variant) => {
        setVariant(variant)
        setImage(variant.images[0])
        setSize(variant.sizes[0])
    }

    const handeImage = (image: string) => {
        setImage(image)
    }

    const handleSize = (size: string) => {
        setSize(size)
    }

    if (isPending) return (
        <div className={'container m-auto p-4 flex flex-col items-center gap-10'}>
            <div className={'hidden md:flex container m-auto p-4 flex-col items-center'}>
                <div className={'w-full flex justify-center gap-6'}>
                    <div className={'w-15 flex flex-col gap-4'}>
                        <Skeleton className={'w-15 h-15'}/>
                        <Skeleton className={'w-15 h-15'}/>
                        <Skeleton className={'w-15 h-15'}/>
                        <Skeleton className={'w-15 h-15'}/>
                    </div>
                    <Skeleton className={'w-full max-w-[500px] md:h-[392px] lg:h-auto'}/>
                    <div className={'w-full max-w-[382px] flex flex-col gap-8'}>
                        <div className={'flex flex-col gap-1'}>
                            <Skeleton className={'w-full h-9'}/>
                            <Skeleton className={'w-full h-6'}/>
                        </div>
                        <div className={'flex flex-wrap gap-2'}>
                            <Skeleton className={'w-[70px] h-[70px]'}/>
                            <Skeleton className={'w-[70px] h-[70px]'}/>
                            <Skeleton className={'w-[70px] h-[70px]'}/>
                            <Skeleton className={'w-[70px] h-[70px]'}/>
                            <Skeleton className={'w-[70px] h-[70px]'}/>
                        </div>
                        <div className={'grid grid-cols-2 gap-2'}>
                            <Skeleton className={'w-full h-9'}/>
                            <Skeleton className={'w-full h-9'}/>
                            <Skeleton className={'w-full h-9'}/>
                            <Skeleton className={'w-full h-9'}/>
                            <Skeleton className={'w-full h-9'}/>
                            <Skeleton className={'w-full h-9'}/>
                            <Skeleton className={'w-full h-9'}/>
                            <Skeleton className={'w-full h-9'}/>
                            <Skeleton className={'w-full h-9'}/>
                            <Skeleton className={'w-full h-9'}/>
                            <Skeleton className={'w-full h-9'}/>
                            <Skeleton className={'w-full h-9'}/>
                            <Skeleton className={'w-full h-9'}/>
                            <Skeleton className={'w-full h-9'}/>
                            <Skeleton className={'w-full h-9'}/>
                            <Skeleton className={'w-full h-9'}/>
                            <Skeleton className={'w-full h-9'}/>
                            <Skeleton className={'w-full h-9'}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className={'flex md:hidden w-full flex-col gap-4'}>
                <Skeleton className={'w-full h-[400px] sm:h-[500px]'}/>
                <div className={'flex flex-col gap-1'}>
                    <Skeleton className={'w-full h-9'}/>
                    <Skeleton className={'w-full h-6'}/>
                </div>
                <div className={'flex flex-wrap gap-2'}>
                    <Skeleton className={'w-[70px] h-[70px]'}/>
                    <Skeleton className={'w-[70px] h-[70px]'}/>
                    <Skeleton className={'w-[70px] h-[70px]'}/>
                    <Skeleton className={'w-[70px] h-[70px]'}/>
                    <Skeleton className={'w-[70px] h-[70px]'}/>
                </div>
                <div className={'grid grid-cols-4 gap-2'}>
                    <Skeleton className={'w-full h-9'}/>
                    <Skeleton className={'w-full h-9'}/>
                    <Skeleton className={'w-full h-9'}/>
                    <Skeleton className={'w-full h-9'}/>
                </div>
            </div>
            <div className={'w-full flex flex-col'}>
                <Skeleton className={'w-full h-9 mb-5'}/>
                <div className={'flex gap-6 flex-col md:flex-row'}>
                    <Skeleton className={'w-full h-[246px] md:max-w-md'}/>
                    <div className={'w-full grid grid-cols-1 gap-4'}>
                        <Skeleton className={'w-full h-[72px]'}/>
                        <Skeleton className={'w-full h-[72px]'}/>
                        <Skeleton className={'w-full h-[72px]'}/>
                    </div>
                </div>
            </div>
        </div>
    )

    if (error) return 'An error has occurred: ' + error.message

    return (
        <div className={'container m-auto p-4 flex flex-col items-center gap-10'}>
            <div className={'hidden md:flex w-full justify-center gap-6'}>
                <div className={'w-15 flex flex-col gap-2'}>
                    {variant?.images.map(item => (
                        <div className={'w-15 h-15'} key={item} onMouseEnter={() => handeImage(item)}>
                            <img
                                src={`${API_URL}${item}`}
                                alt={data.name}
                                className={`rounded-lg object-cover h-full w-full ${item === image && 'border-1 border-black'}`}
                            />
                        </div>
                    ))}
                </div>
                <div className={'w-full max-w-[500px]'}>
                    <img className={'rounded-lg object-contain w-full'} src={`${API_URL}${image}`} alt={data.name}/>
                </div>
                <div className={'w-full max-w-[382px] flex flex-col gap-8'}>
                    <div className={'flex flex-col gap-1'}>
                        <div className={'text-3xl'}>{data.name}</div>
                        <div className={'font-light flex justify-between items-center'}>
                            <div>${variant?.price}</div>
                            <div className={'flex items-center gap-1'}>
                                <Star size={20} className={'text-yellow-500 fill-yellow-500'}/> {data.averageRating}
                            </div>
                        </div>
                    </div>
                    <div className={'flex flex-wrap gap-2'}>
                        {data.variants.map(item => (
                            <div
                                key={item.color}
                                className={`w-[70px] h-[70px] cursor-pointer`}
                                onClick={() => handeVariant(item)}
                            >
                                <img
                                    src={`${API_URL}${item.images[0]}`}
                                    alt={data.name}
                                    className={`rounded-lg object-cover h-full w-full ${item.color === variant?.color && 'border-1 border-black'}`}
                                />
                            </div>
                        ))}
                    </div>
                    <div className={'grid grid-cols-2 gap-2'}>
                        {sizes.map(item => (
                            <Button
                                key={item}
                                variant={!variant?.sizes.includes(item) ? 'ghost' : 'outline'}
                                className={`cursor-pointer ${item === size && 'border-black'}`}
                                disabled={!variant?.sizes.includes(item)}
                                onClick={() => handleSize(item)}
                            >
                                EU {item}
                            </Button>
                        ))}
                    </div>
                </div>
            </div>
            <div className={'flex md:hidden flex-col gap-4'}>
                <Carousel>
                    <CarouselContent>
                        {variant?.images.map(item => (
                            <CarouselItem>
                                <div className={'w-full h-[400px] sm:h-[500px] flex items-center justify-center overflow-hidden rounded-lg'}>
                                    <img className={'rounded-lg object-cover w-full'} src={`${API_URL}${item}`} alt={data.name}/>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
                <div className={'flex flex-col gap-1'}>
                    <div className={'text-3xl'}>{data.name}</div>
                    <div className={'font-light flex justify-between items-center'}>
                        <div>${variant?.price}</div>
                        <div className={'flex items-center gap-1'}>
                            <Star size={20} className={'text-yellow-500 fill-yellow-500'}/> {data.averageRating}
                        </div>
                    </div>
                </div>
                <div className={'flex flex-wrap gap-2'}>
                    {data.variants.map(item => (
                        <div
                            key={item.color}
                            className={`w-[70px] h-[70px] cursor-pointer`}
                            onClick={() => handeVariant(item)}
                        >
                            <img
                                src={`${API_URL}${item.images[0]}`}
                                alt={data.name}
                                className={`rounded-lg object-cover h-full w-full ${item.color === variant?.color && 'border-1 border-black'}`}
                            />
                        </div>
                    ))}
                </div>
                <div className={'grid grid-cols-4 gap-2'}>
                    {sizes.map(item => variant?.sizes.includes(item) ? (
                        <Button
                            key={item}
                            variant={!variant?.sizes.includes(item) ? 'ghost' : 'outline'}
                            className={`cursor-pointer ${item === size && 'border-black'}`}
                            disabled={!variant?.sizes.includes(item)}
                            onClick={() => handleSize(item)}
                        >
                            EU {item}
                        </Button>
                    ) : null)}
                </div>
            </div>
            <div className={'container flex flex-col'}>
                <div className={'text-3xl font-bold mb-5'}>Reviews</div>
                <div className={'flex gap-6 flex-col md:flex-row'}>
                    <ReviewFormCard/>
                    <div className={'max-h-80 overflow-auto w-full grid grid-cols-1 gap-4'}>
                        {data.reviews.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map(item => (
                            <Card key={item._id} className={'py-0'}>
                                <CardContent className="p-4 flex flex-col gap-2">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="bg-gray-200 rounded-full w-10 h-10 flex items-center justify-center">
                                                <Avatar className={'w-10 h-10'}>
                                                    <AvatarFallback>{item.username.slice(0, 2).toUpperCase()}</AvatarFallback>
                                                </Avatar>
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-sm">{item.username}</span>
                                                <span className="text-xs text-muted-foreground">
                                            {format(new Date(item.createdAt), "MMMM d, yyyy")}
                                        </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1 text-sm  font-medium">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500"/>
                                            {item.rating}
                                        </div>
                                    </div>
                                    {item.comment && (
                                        <p className="ml-[52px] text-sm text-gray-800 leading-relaxed mt-1">{item.comment}</p>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
                </div>
        </div>
    )
}

export default ProductPage