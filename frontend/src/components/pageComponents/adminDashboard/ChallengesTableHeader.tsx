import axiosFetch from "@/lib/axiosFetch"
import useDebounce from "@/lib/useDebounce"
import { FormEvent, useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"

const ChallengesTableHeader = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    
    const [search, setSearch] = useState<string>(searchParams.get('search') || "")
    const [autoCorrectSearch, setAutoCorrectSearch] = useState<any[]>([])

    const debounce = useDebounce(search, 300)

    useEffect(() => {
        const getAutoCorrect = async () => {
            if (debounce === "") {
                return setAutoCorrectSearch([])
            }
            const response = await axiosFetch.post('/challenge/autoCorrect', {
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
                        <option  key={index} value={item.title} />
                    ))}
                </datalist>
                <Button
                type="submit"
                >
                    Search
                </Button>
            </form>

            <Button onClick={() => window.location.assign('/addChallenge')}>
                Add Challenge
            </Button>
        </header>
    )
}

export default ChallengesTableHeader