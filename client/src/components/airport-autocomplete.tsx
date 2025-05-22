import * as React from "react"
import {Check, ChevronsUpDown} from "lucide-react"

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import type {Airport} from '@/types/Airport.ts'

interface Props {
    options: Airport[]
    label: string
    onSelect: (airport: Airport) => void
}

const AirportCombobox: React.FC<Props> = ({options, label, onSelect}) => {
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState("")
    const [value, setValue] = React.useState<Airport | null>({
        city: "Odessa",
        country: "Ukraine",
        iata: "ODS",
        name: "Odessa International Airport"
    })

    const filtered = React.useMemo(() => {
        const q = query.toLowerCase().trim()
        return options
            .filter((a) =>
                `${a.city} ${a.country} ${a.iata}`.toLowerCase().includes(q)
            )
            .slice(0, 10)
    }, [query, options])

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="justify-between"
                >
                    {value
                        ? `${value.city}, ${value.country} (${value.iata})`
                        : label}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command shouldFilter={false}>
                    <CommandInput
                        placeholder={`Search ${label.toLowerCase()} airport...`}
                        value={query}
                        onValueChange={setQuery}
                    />
                    <CommandList>
                        <CommandEmpty>No airport found.</CommandEmpty>
                        <CommandGroup>
                            {query && filtered.map((airport) => (
                                <CommandItem
                                    key={airport.iata}
                                    onSelect={() => {
                                        setValue(airport)
                                        onSelect(airport)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value?.iata === airport.iata ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <div className="flex flex-col">
                                        <span className="font-medium">
                                          {airport.city}, {airport.country}
                                        </span>
                                        <span className="text-sm text-muted-foreground">
                                          {airport.iata}
                                        </span>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export default AirportCombobox
