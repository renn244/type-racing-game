import { useThemeContext } from "@/Context/ThemeContext"
import { cn } from "@/lib/utils"
import { Moon, Sun, SunMoon } from "lucide-react"
import { ComponentProps } from "react"

type ThemeSwitchProps = {
    className?: string,
} & ComponentProps<'div'>

const ThemeSwitch = ({
    className,
    ...props
}: ThemeSwitchProps) => {
    const { theme, setTheme }= useThemeContext()
    
    const switchTheme = () => {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"
        
        if (theme === 'system') {
            if (systemTheme === 'dark') {
                setTheme('light')
            } else {
                setTheme('dark')
            }
        } else if (theme === 'dark') {
            setTheme('light')
        } else if (theme === 'light') {
            setTheme('dark')
        }
    }

    return (
        <div 
        {...props}
        title="theme" className={cn("flex justify-start gap-3", className)}>
            <SunMoon />
            <label 
            className="bg-border"
            htmlFor="themeSwitch" >
                <div className="h-[28px] w-[52px] flex items-center bg-background">
                    <div className="bg-primary rounded-full w-[52px] h-[28px]  p-1">
                        <div className={`rounded-full w-[20px] h-[20px] 
                        ${theme === 'dark' ? 'translate-x-6 bg-black' : 'translate-x-0 bg-white'} transition-all p-[3px]`}>
                            {theme === 'dark' ? <Moon className="w-[15px] h-[15px]" color="white" /> : <Sun className="w-[15px] h-[15px]" color="black" />}
                        </div>
                    </div>
                </div>
            </label>
            <input hidden id="themeSwitch" type="checkbox" onChange={() => switchTheme()}>
            </input>
        </div>
    )
}

export default ThemeSwitch