import SearchForm from '@/components/search-form.tsx'
import CountyList from '@/components/county-list.tsx'
import CountryMap from '@/components/country-map.tsx'

const HomePage = () => {
    return (
        <div className="h-full flex flex-col container mx-auto p-4">
            <SearchForm />
            <div className="flex-1 flex gap-8 overflow-hidden p-4">
                <CountyList />
                <CountryMap />
            </div>
        </div>
    )
}

export default HomePage