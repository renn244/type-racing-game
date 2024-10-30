import { Card, CardContent } from "@/components/ui/card"
import { memo } from "react"


type VirtualKeyboardProps = {
    keyUp: string,
    timetoStart: number
}

const VirtualKeyboard = ({
    keyUp,
    timetoStart
}: VirtualKeyboardProps) => {

  return (
    <Card>
        <CardContent className="p-4 py-6 relative">
            {/* Virtual Keyboard */}
            {timetoStart !== 0 && 
                <div className="w-full h-full absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-20 flex justify-center items-center bg-muted opacity-50">
                    <h2 className="font-bold text-primary text-7xl">
                        {timetoStart}
                    </h2>
                </div>
            }
            <div className="grid gap-2">
                <div className="flex justify-center gap-1">
                    {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map((key) => (
                        <div
                        key={key}
                        className={`w-10 h-10 flex items-center justify-center rounded border bg-muted font-medium 
                            ${keyUp.toLowerCase() === key.toLowerCase() ? 'bg-primary text-white' : 'bg-background text-muted-foreground'}`}
                        >
                        {key}
                        </div>
                    ))}
                </div>
                <div className="flex justify-center gap-1">
                    {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map((key) => (
                        <div
                        key={key}
                        className={`w-10 h-10 flex items-center justify-center rounded border bg-muted font-medium 
                            ${keyUp.toLowerCase() === key.toLowerCase() ? 'bg-primary text-white' : 'bg-background text-muted-foreground'}`}
                        >
                        {key}
                        </div>
                    ))}
                </div>
                <div className="flex justify-center gap-1">
                    {['Z', 'X', 'C', 'V', 'B', 'N', 'M'].map((key) => (
                        <div
                        key={key}
                        className={`w-10 h-10 flex items-center justify-center rounded border bg-muted font-medium 
                            ${keyUp.toLowerCase() === key.toLowerCase() ? 'bg-primary text-white' : 'bg-background text-muted-foreground'}`}
                        >
                        {key}
                        </div>
                    ))}
                </div>
                <div className="flex justify-center">
                    <div className={`w-64 h-10 flex items-center justify-center rounded border bg-muted font-medium 
                        ${keyUp === " " ? 'bg-primary text-white' : 'bg-background text-muted-foreground'}`}>
                        Space
                    </div>
                </div>
                
            </div>
        </CardContent>
    </Card>
  )
}

export default memo(VirtualKeyboard)