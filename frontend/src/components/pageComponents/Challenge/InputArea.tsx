import { Card, CardContent } from '@/components/ui/card'
import { useAuthContext } from '@/Context/AuthContext'
import { useSocketContext } from '@/Context/SocketContext'
import { useEffect, useRef } from 'react'
import { useSearchParams } from 'react-router-dom'

type InputAreaProps = {
    typed: string,
    challenge: string, // this is the challenge that they need to type
}

const InputArea = ({
    typed,
    challenge
}: InputAreaProps) => {
    const inputRef = useRef<HTMLInputElement>(null)
    const [searchParams] = useSearchParams();
    const { socket } = useSocketContext();
    const { user } = useAuthContext()

    useEffect(() => {
        if(searchParams.get('mode') === 'multiplayer') {
            // calculate the progress here by percentage of 100
            if(!socket) return;
            socket.emit('update-progress', {
                roomId: searchParams.get('roomId'),
                progress: Math.round((typed.length / challenge.length) * 100),
                playerId: user?.Player?.id
            })
        }    

        if(inputRef.current) {
            inputRef.current.scrollLeft = inputRef.current.scrollWidth 
        }
    }, [typed])

    return (
        <Card className="mb-6">
            <CardContent className="p-4">
                <input
                ref={inputRef}
                disabled
                type="text"
                value={typed}
                className="w-full p-2 px-8 text-lg bg-background border-none focus:outline-none focus:ring-0 text-center overflow-x-scroll"
                placeholder="Start typing..."
                aria-label="Typing input"
                />
            </CardContent>
        </Card>
    )
}

export default InputArea