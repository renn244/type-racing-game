import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAuthContext } from "@/Context/AuthContext"
import { useSocketContext } from "@/Context/SocketContext"
import axiosFetch from "@/lib/axiosFetch"
import { Dispatch, memo, SetStateAction, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useSearchParams } from "react-router-dom"
import { io } from "socket.io-client"

type PlayerProgress = {
    progress: number,
    playerId: string,
    roomId: string,
    username: string,
    profile: string,
}

type MultiPlayerProgressProps = {
    setReady: Dispatch<SetStateAction<boolean>>
}

const MultiPlayerProgress = ({
    setReady
}: MultiPlayerProgressProps) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [progress, setProgress] = useState<PlayerProgress[]>([])
    const { user } = useAuthContext()
    const { socket } = useSocketContext();
    // if you refresh the page the progress will be lost // bug

    useEffect(() => {
        if (!user) return setReady(false)
        
        // remove this socket and use the socket context
        if(!socket) return;
        socket.on('player-joined', async data => {
            setProgress([]) // clearing the progress to prevent duplicate

            data.map((player: PlayerProgress) => {
                setProgress(prev => [...prev, player])
            })
        })

        socket.on('invitation-rejected', async (data: string) => {
            console.log(data)
            toast.error(data)
        })

        // just creating a room if there is no room yet
        const createRoom = async () => {
            if(searchParams.get('roomId')) return;
            const res = await axiosFetch.post('/multiplayer/createRoom', {
                challengeId: searchParams.get('challengeId'),
                name: 'room name'
            })

            if(res.status >= 400) {
                toast.error('Error creating room')
                return;
            }

            // adding Romm Id in the search params
            const prevParams = Object.fromEntries(searchParams.entries());
            setSearchParams({...prevParams, roomId: res.data.id })
        }
        createRoom();

        return () => {
            socket.off('player-joined')
            socket.off('invitation-rejected')
        }
    }, [socket])

    return (
        <Card className="mb-6">
            <CardContent className="p-4">
                Room Id: {searchParams.get('roomId')}
                <div className="space-y-4 p-3">
                    {progress.map(competitor => (
                        <div key={competitor.playerId} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Avatar className="h-6 w-6">
                                    <AvatarImage src={competitor.profile} />
                                    <AvatarFallback>{competitor.username}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{competitor.username}</span>
                                </div>
                            </div>
                            <Progress value={competitor.progress} className="h-2" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

export default memo(MultiPlayerProgress)