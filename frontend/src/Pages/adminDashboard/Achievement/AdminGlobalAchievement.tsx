import LoadingSpinner from "@/components/common/LoadingSpinner"
import AchievementTableHeader from "@/components/pageComponents/adminDashboard/AchievementTableHeader"
import AdminTablePopOver from "@/components/pageComponents/adminDashboard/adminAchievementTablePopOver/AdminTablePopOver"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import axiosFetch from "@/lib/axiosFetch"
import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { useSearchParams } from "react-router-dom"

const AdminGlobalAchievement = () => {
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

    const { data, isLoading } = useQuery({
        queryKey: ['globalAchievements', page, search],
        queryFn: async () => {
            const response = await axiosFetch.get(`/globalAchievement/getAllGlobalAchievements?page=${page}&search=${search}`)
            
            setHasNext(response.data.hasNext)
            return response.data
        },
        retry: false,
    })
        
    if(isLoading) {
        return <LoadingSpinner />
    }

    return (
        <div className="w-full min-h-[750px]">
            <div className="max-w-[1200px] w-full mx-auto py-7">
                <div className="max-w-[1000px] space-y-4">
                    <AchievementTableHeader />
                    <div className="rounded-md border-2 p-2 max-w-[1000px] bg-card shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow>

                                    <TableHead className="text-primary font-bold text-lg w-[250px]">
                                        name
                                    </TableHead>

                                    <TableHead className="text-primary font-bold text-lg">
                                        description
                                    </TableHead>

                                    <TableHead className="text-primary font-bold text-lg w-[100px]">
                                        taskType
                                    </TableHead>

                                    <TableHead className="text-primary font-bold text-lg w-[40px]">
                                        category
                                    </TableHead>

                                    <TableHead className="text-primary font-bold text-lg w-[25px]">
                                        {/* this is for the function */}
                                    </TableHead>
                                    
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data?.achievements?.map((achievement: any) => (
                                    <TableRow key={achievement.id}>
                                        <TableCell className="font-medium">{achievement.name}</TableCell>
                                        <TableCell className="font-medium">{achievement.description}</TableCell>
                                        <TableCell className="font-medium">{achievement.taskType}</TableCell>
                                        <TableCell className="font-medium">{achievement.category}</TableCell>
                                        <TableCell className="font-medium">
                                            <AdminTablePopOver globalAchivement={achievement} />
                                        </TableCell>
                                    </TableRow>
                                ))}
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
                            onClick={() => changePage('prev')}
                            variant={'outline'}
                            >
                                Prev
                            </Button>
                            <Button
                            disabled={!hasNext}
                            onClick={() => changePage('next')}
                            variant={'outline'}
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

export default AdminGlobalAchievement   