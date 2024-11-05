import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import axiosFetch from "@/lib/axiosFetch"
import useDebounce from "@/lib/useDebounce"
import { FormEvent, useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"

const AchievementTableHeader = () => {
    const [searchParams, setSearchParams] = useSearchParams()

    const [search, setSearch] = useState<string>(searchParams.get('search') || "")
    const [autoCorrectSearch, setAutoCorrectSearch] = useState<any[]>([])

    const debounce = useDebounce(search, 300)

    useEffect(() => {
        const getAutoCorrect = async () => {
            if (debounce === "") {
                return setAutoCorrectSearch([])
            }
            const response = await axiosFetch.post('/globalAchievement/autoCorrect', {
                search: debounce
            })

            setAutoCorrectSearch(response.data)
        }
        getAutoCorrect()
    }, [debounce])

    const handleSearch = (e: FormEvent) => {
        e.preventDefault()
        setSearchParams({ search: search })
    }

    return (
        <header className="flex justify-between items-center">
            <form 
            onSubmit={(e) => handleSearch(e)}
            className="flex gap-3 max-w-[440px] w-full">
                <Input 
                list="autoCorrect"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="max-w-[400px] w-full shadow-md font-medium text-lg" 
                placeholder="Search Title" />
                <datalist id="autoCorrect">
                    {autoCorrectSearch.map((item, index) => (
                        <option  key={index} value={item.name} />
                    ))}
                </datalist>
                <Button
                type="submit"
                >
                    Search
                </Button>
            </form>

            <Button onClick={() => window.location.assign('/addGlobalAchievement')}>
                Add Global Achievement
            </Button>
        </header>
    )
}

export default AchievementTableHeader