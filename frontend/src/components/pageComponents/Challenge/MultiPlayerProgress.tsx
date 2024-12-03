import { AvatarFallback, AvatarImage, Avatar } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useAuthContext } from "@/Context/AuthContext"
import { useSocketContext } from "@/Context/SocketContext"
import axiosFetch from "@/lib/axiosFetch"
import { useMultiplayer } from "@/zustand/ChallengeResult.zustand"
import { memo, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useSearchParams } from "react-router-dom"

type PlayerProgress = {
    progress: number,
    playerId: string,
    roomId: string,
    username: string,
    profile: string,
    Ready: boolean,
    finished?: boolean,
    position?: number,
    stats?: { wpm: number, accuracy: number, time: number }
}


const MultiPlayerProgress = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const roomId = searchParams.get('roomId')
    const [progress, setProgress] = useState<PlayerProgress[]>([])
    const { user } = useAuthContext()
    const { socket } = useSocketContext();
    const setGameStarted = useMultiplayer(set => set.setGameStarted);

    useEffect(() => {
        const updateRoomPlayers = async () => {
            if(!roomId) return;
            const response = await axiosFetch.get(`/multiplayer/roomPlayers?roomId=${roomId}`)

            if(response.status >= 400) {
                setSearchParams({...Object.fromEntries(searchParams.entries()), roomId: '', mode: 'single' })
                toast.error("an error occured!")
                return window.location.reload()
            }

            setProgress(response.data)

            return response.data
        }
        updateRoomPlayers()
    }, [roomId])

    useEffect(() => {
        if (!user) return 

        if(!socket) return;

        socket.on('update-playerLobby', async data => {
            setProgress([]) // clearing the progress to prevent duplicate

            setProgress(data)
        })

        socket.on('invitation-rejected', async (data: string) => {
            toast.error(data)
        })

        socket.on('game-started', async () => {
            setGameStarted(true)
        })

        socket.on('player-finished', async data => {
            setProgress(prev => prev.map(player => {
                if(player.playerId === data.playerId) {
                    return {...player, finished: true, position: data.position, stats: data.stats}
                }

                return player
            })
        )
        })

        // FIX LATER: this would slow down the app client
        socket.on('player-progress-update', async data => {
            setProgress(prev => prev.map(player => {
                if(player.playerId === data.playerId) {
                    return {...player, progress: data.progress}
                }

                return player
            }))
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
        
        if(user.Player.roomId) {
            // update the search params
            const prevParams = Object.fromEntries(searchParams.entries());
            setSearchParams({...prevParams, roomId: user.Player.roomId, challengeId: user.Player.room.challengeId })
        } else createRoom();

        return () => {
            socket.off('update-playerLobby')
            socket.off('player-joined')
            socket.off('invitation-rejected')
            socket.off('game-started')
        }
    }, [socket])

    return (
        <Card className="mb-6">
            <CardContent className="p-4">
                <span className="font-bold">Room Id:</span> {searchParams.get('roomId')}
                <div className="space-y-4 p-3">
                    {progress?.map(competitor => (
                        <div key={competitor.playerId} className="space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                    <Avatar className="h-6 w-6">
                                    <AvatarImage src={competitor.profile} />
                                    <AvatarFallback>{competitor.username}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{competitor.username}</span>
                                    <span className="text-muted-foreground">•</span>
                                    {competitor.finished ? 
                                    (
                                        <div className="flex gap-3">
                                            <span className="font-bold text-green-700">
                                                Finished - {competitor.position} place
                                            </span>
                                            <div className="flex gap-3">
                                                <span>WPM: {competitor.stats?.wpm}</span>
                                                <span>Accuracy: {competitor.stats?.accuracy}%</span>
                                                <span>Time: {competitor.stats?.time}s</span>
                                            </div>
                                        </div>
                                    )
                                    : 
                                    <span className={`font-bold ${competitor.Ready ? "text-green-700" : "text-red-700"}`}>
                                        {competitor.Ready ? "Ready" : "Not Ready" }
                                    </span>}
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