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

const NavBar = () => {
    const [isOpen, setIsOpen] = useState(false)

    const Logout = () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        window.location.assign('/')
    }

    const { user } = useAuthContext()

    return (
        <nav className="w-full border-b-2">
            <main className="max-w-[1400px] h-[50px] p-2 px-8 w-full mx-auto flex justify-between items-center">
                <div>   
                    <h2 className="font-bold text-2xl text-primary">
                        Type
                    </h2>
                </div>
                <div className="flex justify-around items-center max-w-[400px] w-full font-semibold">
                    <Link className="underline-offset-2 hover:underline" to={'/challenges'}>
                        Challenges
                    </Link>
                    <Link className="underline-offset-2 hover:underline" to={'/'}>
                        Dashboard
                    </Link>
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
            </main>
        </nav>
    )
}

export default NavBar