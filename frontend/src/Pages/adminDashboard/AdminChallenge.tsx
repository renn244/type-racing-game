import LoadingSpinner from "@/components/common/LoadingSpinner"
import AdminTablePopOver from "@/components/pageComponents/adminDashboard/adminTablePopOver/AdminTablePopOver"
import ChallengesTableHeader from "@/components/pageComponents/adminDashboard/ChallengesTableHeader"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import axiosFetch from "@/lib/axiosFetch"
import { Challenge } from "@/types/Challenge.type"
import { useQuery } from "@tanstack/react-query"
import { format } from 'date-fns'
import { useState } from "react"
import { useSearchParams } from "react-router-dom"

// add the categories in the table? and might also have filters for it

const AdminChallenge = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const [hasNext, setHasNext] = useState<boolean>()
    const page = searchParams.get('page') || '1'
    const search = searchParams.get('search') || ''

    const changePage = (action: 'next' | 'prev') => {
        const pageInt = parseInt(page)
    
        if(pageInt == 1 && action === 'prev') {
            return 
        }

        const pageParam = pageInt + (action === 'next' ? 1 : -1)
        setSearchParams({ page: pageParam.toString() })
    }

    const { data: challenges, isLoading } = useQuery({
        queryKey: ['challenges', page, search],
        queryFn: async () => {
            const response = await axiosFetch.get(`/challenge/getAll?page=${page}&search=${search}`)

            setHasNext(response.data.hasNext)
            return response.data.challenges as Challenge[]
        }
    })

    if (isLoading) {
        return <LoadingSpinner />
    }

    return (
        <div className="w-full min-h-[750px]">
            <div className="max-w-[1200px] w-full mx-auto py-7">
                <div className="max-w-[1000px] space-y-4">
                    <ChallengesTableHeader />
                    <div className="rounded-md border-2 p-2 max-w-[1000px] bg-card shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    
                                    <TableHead className="text-primary font-bold text-lg  w-[250px]">
                                        id
                                    </TableHead>

                                    <TableHead className="text-primary font-bold text-lg w-[400px]">
                                        title 
                                    </TableHead>

                                    <TableHead className="text-primary font-bold text-lg">
                                        difficulty
                                    </TableHead>

                                    <TableHead className="text-primary font-bold text-lg w-[100px]">
                                        createdAt
                                    </TableHead>

                                    <TableHead className="text-primary font-bold text-lg w-[25px]">
                                        {/* this is for the function */}
                                    </TableHead>

                                </TableRow>
                            </TableHeader>
                            <TableBody>

                                {challenges?.map((challenge) => {
                                    return (
                                        <TableRow key={challenge.id}>
                                            <TableCell className="font-medium">{challenge.id}</TableCell>
                                            <TableCell className="font-medium">{challenge.title}</TableCell>
                                            <TableCell className="font-medium">{challenge.difficulty}</TableCell>
                                            <TableCell className="font-medium">{format(new Date(challenge.createdAt), 'yyyy-MM-d')}</TableCell>
                                            <TableCell className="font-medium">
                                                <AdminTablePopOver challenge={challenge} />
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    </div>
                    <footer className="flex items-center justify-between mt-4 px-4">
                        <div>
                            <span className="text-primary font-bold">
                                Page: {page}
                            </span>
                        </div>
                        <div>
                            <Button 
                            disabled={page === '1'}
                            variant={'outline'} 
                            onClick={() => changePage('prev')}
                            >
                                Prev
                            </Button>
                            <Button 
                            disabled={!hasNext}
                            variant={'outline'} 
                            onClick={() => changePage('next')}
                            >
                                Next
                            </Button>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    )
}





export default AdminChallenge