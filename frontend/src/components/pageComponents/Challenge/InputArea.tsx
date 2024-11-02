import { Card, CardContent } from '@/components/ui/card'
import { useEffect, useRef } from 'react'

type InputAreaProps = {
    typed: string
}

const InputArea = ({
    typed
}: InputAreaProps) => {
    const inputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
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