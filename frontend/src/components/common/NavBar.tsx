import { useAuthContext } from "@/Context/AuthContext"
import { Link } from "react-router-dom"
import { useState } from "react"
import {  
    Sheet,
    SheetTrigger,
    SheetHeader,
    SheetContent,
    SheetTitle,
    SheetDescription,
} from '@/components/ui/sheet'
import Profile from "./Profile"
import { LogOut, Settings2, Sword, UserRound } from "lucide-react"
import ThemeSwitch from "./ThemeSwitch"

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false)

    const Logout = () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.assign('/')
    }

    const { user } = useAuthContext()

    return (
        <header className="border-b-2">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h2 className="font-bold text-2xl">
                    Type
                </h2>
                <nav className="flex space-x-6">
                    <Link className="underline-offset-2 hover:underline" to={'#Features'} >
                        Features
                    </Link>
                    <Link className="underline-offset-2 hover:underline" to={'/challenges'}>
                        Challenges
                    </Link>
                    <Link className="underline-offset-2 hover:underline" to={'/'}>
                        Dashboard
                    </Link>
                </nav>
                {!user && 
                    <Link className="underline-offset-2 hover:underline" to={'/login'}>
                        Login
                    </Link>
                }
                {user &&
                    <Sheet open={isOpen} onOpenChange={setIsOpen} >
                        <SheetTrigger>
                            <Profile src={user.profile || ''}  />
                        </SheetTrigger>
                        <SheetContent className="w-[300px]">
                            <SheetHeader>
                                <SheetTitle>
                                    {user.username}
                                </SheetTitle>
                                {user.email && 
                                    <SheetDescription>
                                        {user.email}
                                    </SheetDescription>
                                }
                            </SheetHeader>
                            <nav className="flex flex-col gap-3 px-4 mt-9 font-semibold text-lg">
                                <div className="flex justify-start gap-3">
                                    <UserRound />
                                    <Link to={'/profile'}>
                                        Profile
                                    </Link> 
                                </div>
                                <div className="flex justify-start gap-3">
                                    <Settings2 />
                                    <Link to={'/settings'}>
                                        Settings
                                    </Link>
                                </div>
                                <div className="flex justify-start gap-3">
                                    <Sword />
                                    <Link to={'/challenges'}>
                                        Challenges
                                    </Link>
                                </div>
                                <ThemeSwitch />
                                <div className="flex justify-start gap-3">
                                    <LogOut />
                                    <button onClick={() => Logout()}>
                                        Logout
                                    </button>
                                </div>
                            </nav>
                        </SheetContent>
                    </Sheet>
                }
            </div>
        </header>
    )
}

export default NavBar