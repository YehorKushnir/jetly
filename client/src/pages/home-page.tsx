import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card.tsx'
import {Star} from 'lucide-react'
import {useQuery} from '@tanstack/react-query'
import {ProductService} from '@/services/ProductService.ts'
import {Skeleton} from '@/components/ui/skeleton.tsx'
import {Link} from 'react-router'
import {API_URL} from '@/http'

const HomePage = () => {
    const {isPending, error, data} = useQuery({
        queryKey: ['products'],
        queryFn: () => ProductService.getAll().then(res => res.data)
    })


    if (error) return 'An error has occurred: ' + error.message

    return (
        <div className={'container m-auto p-4'}>
            <div className={'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 '}>
                {isPending ? (
                    <>
                        <Skeleton className="w-full h-[400px]"/>
                        <Skeleton className="w-full h-[400px]"/>
                        <Skeleton className="w-full h-[400px]"/>
                        <Skeleton className="w-full h-[400px]"/>
                    </>
                ) : data.map((item) => (
                    <Link key={item._id} to={`/product/${item._id}`}>
                        <Card className={'w-full max-h-[400px] cursor-pointer'}>
                            <CardHeader>
                                <CardTitle>{item.name}</CardTitle>
                                <CardDescription className={'flex flex-row items-center justify-between'}>
                                    ${item.variants[0].price}
                                    <div className={'flex items-center gap-1'}>
                                        <Star size={20} className={'text-yellow-500 fill-yellow-500'}/> {item.averageRating}
                                    </div>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className={'h-[286px]'}>
                                <img className={'rounded-xl object-cover h-full w-full'} src={`${API_URL}${item.variants[0].images[0]}`} alt={item.name}/>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default HomePage