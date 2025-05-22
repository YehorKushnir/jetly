import {z} from "zod"
import {useForm} from "react-hook-form"
import {zodResolver} from "@hookform/resolvers/zod"
import {
    Form, FormField, FormItem, FormLabel, FormControl, FormMessage
} from "@/components/ui/form"
import {Select, SelectTrigger, SelectValue, SelectItem, SelectContent} from "@/components/ui/select"
import {Checkbox} from "@/components/ui/checkbox"
import {Button} from "@/components/ui/button"
import {Calendar} from "@/components/ui/calendar"
import {useQuery} from '@tanstack/react-query'
import AirportCombobox from '@/components/airport-autocomplete.tsx'
import {TicketService} from '@/services/TiketService.ts'
import {useStore} from '@/store.ts'
import {Popover} from '@radix-ui/react-popover'
import {PopoverContent, PopoverTrigger} from '@/components/ui/popover.tsx'
import {CalendarIcon} from 'lucide-react'
import { cn } from "@/lib/utils"
import {format} from 'date-fns'

const formSchema = z.object({
    from: z.string().min(3, "Choose a country/cite"),
    to: z.string(),
    cabinClass: z.enum(["economy", "business"]),
    baggageIncluded: z.boolean(),
    isDirect: z.boolean(),
    departureDate: z.date().optional(),
    arrivalDate: z.date().optional(),
})

type FormValues = z.infer<typeof formSchema>

export default function SearchForm() {
    const setTickets = useStore(state => state.setTickets)
    const setCountry = useStore(state => state.setCountry)

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            from: "ODS",
            to: "",
            cabinClass: "economy",
            baggageIncluded: false,
            isDirect: false,
        }
    })

    const onSubmit = async (values: FormValues) => {
        const params = new URLSearchParams({
            from: values.from,
            to: values.to,
            cabinClass: values.cabinClass,
            baggageIncluded: String(values.baggageIncluded),
            isDirect: String(values.isDirect),
            ...(values.departureDate && {
                departureDate: values.departureDate.toISOString().split("T")[0]
            }),
            ...(values.arrivalDate && {
                arrivalDate: values.arrivalDate.toISOString().split("T")[0]
            })
        })
        const res = await TicketService.getTickets(params.toString())
        setTickets(res.data)
        setCountry('')
    }

    const {data, isPending} = useQuery({
        queryKey: ['airports'],
        queryFn: async () => (await TicketService.getAirports()).data,
        refetchOnWindowFocus: false
    })

    if (isPending || !data) {
        return <>Loading</>
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4">
                <div className="flex justify-between gap-4">
                    <FormField
                        control={form.control}
                        name="from"
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>From</FormLabel>
                                    <FormControl>
                                        <AirportCombobox label={'From'} options={data} onSelect={(airport) => field.onChange(airport.iata)}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }}
                    />
                    <FormField
                        control={form.control}
                        name="to"
                        render={({ field }) => {
                            return (
                                <FormItem>
                                    <FormLabel>To</FormLabel>
                                    <FormControl>
                                        <AirportCombobox label={'To'} options={data} onSelect={(airport) => field.onChange(airport.iata)}/>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )
                        }}
                    />
                    <FormField
                        control={form.control}
                        name="departureDate"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Departure date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] justify-start text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon />
                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="arrivalDate"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Arrival date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-[240px] justify-start text-left font-normal",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon />
                                            {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                        />
                                    </PopoverContent>
                                </Popover>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="cabinClass"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Cabin Class</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger><SelectValue placeholder="Choose a class"/></SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="economy">Economy</SelectItem>
                                        <SelectItem value="business">Business</SelectItem>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />
                </div>
                <div className={'flex items-center gap-8'}>
                    <Button type="submit">Search tickets</Button>
                    <FormField
                        control={form.control}
                        name="baggageIncluded"
                        render={({field}) => (
                            <FormItem className="flex flex-row items-start space-x-2">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange}/>
                                </FormControl>
                                <FormLabel>Baggage included</FormLabel>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="isDirect"
                        render={({field}) => (
                            <FormItem className="flex flex-row items-start space-x-2">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange}/>
                                </FormControl>
                                <FormLabel>Direct flights only</FormLabel>
                            </FormItem>
                        )}
                    />
                </div>
            </form>
        </Form>
    )
}