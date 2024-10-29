import { useEffect, useState } from "react"

const keyboardType = "qwertyuiopasdfghjklzxcvbnm,./"

const KeyboardTypeAnimation = () => {
    const text = "lorem ipsum dolor sit amet consectetur adipiscing elit"
    const [typed, setTypes] = useState("")
    const [keyUp, setKeyUp] = useState('')
    
    useEffect(() => {
        const typeAnimation = setInterval(async () => {
            if(text.length === typed.length) {
                clearInterval(typeAnimation)
                return
            }
            setTypes((prev) => prev + text[prev.length])
            setKeyUp(text[typed.length].toLocaleLowerCase())
            await new Promise((resolve) => setTimeout(resolve, 130))
            setKeyUp('')
        }, 200)

        return () => {
            clearInterval(typeAnimation)
        }
    })

    return (
        <div className="md:w-1/2">
            <div className="bg-muted p-6 rounded-lg shadow-lg">
            <h2 className="text-lg text-center mb-4">
                {text?.split("").map((char, i) => {
                    // put an if statement so 
                    if (typed.length <= i) {

                        if (i === typed.length) {
                            return <span key={i} className="underline mx-[1px] text-muted-foreground">{char}</span>
                        }

                        return <span key={i} className="text-muted-foreground">{char}</span>

                    }
                    else if (typed[i] === char) {

                        return <span key={i} className="text-primary">{char}</span>

                    } else {

                        if (char === " ") {
                            return <span key={i} className="text-red-600">_</span>
                        }
                        return <span key={i} className="text-red-600">{char}</span>
                    }
                })}
            </h2>
            <div className="w-full">
                <div className="flex flex-col gap-2 max-w-[470px] mx-auto">
                    <div className="flex">
                        {keyboardType.split("").map((char, i) => {
                            if (!("qwertyuiop").includes(char)) {
                                return
                            }

                            return  <span key={i} className={`${char == keyUp && 'bg-black text-white'} text-lg p-2 border-2  rounded-md w-[40px] mx-1 uppercase`}>
                                        {char}
                                    </span>
                        })}
                    </div>
                    <div className="flex pl-4">
                        {keyboardType.split("").map((char, i) => {
                            if (!("asdfghjkl").includes(char)) {
                                return
                            }

                            return <span key={i} className={`${char == keyUp && 'bg-black text-white'} text-lg p-2 border-2 rounded-md w-[40px] mx-1 uppercase`}>
                            {char}
                        </span>
                        })}
                    </div>
                    <div className="flex">
                        {keyboardType.split("").map((char, i) => {
                            if (!("zxcvbnm,./").includes(char)) {
                                return
                            }

                            return <span key={i} className={`${char == keyUp && 'bg-black text-white'} text-lg p-2 border-2 rounded-md w-[40px] mx-1 uppercase`}>
                            {char}
                        </span>
                        })}
                    </div>
                    <div className="flex justify-center">
                        <div className={`${" " === keyUp && 'bg-black text-white'} text-lg border-2 w-[320px] h-[48px] rounded-md`}>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        </div>
    )
}

export default KeyboardTypeAnimation