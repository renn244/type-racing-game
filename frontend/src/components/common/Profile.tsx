import { cn } from "@/lib/utils"
import { ComponentProps } from "react"
import { UserRound } from "lucide-react"

type ProfileProps = {
    src: string,
    alt?: string,
    className?: string,
}

const Profile = ({
    src,
    alt,
    className,
    ...props
}: ProfileProps & ComponentProps<'img'>) => {
    


    return (
        <div className="flex justify-center items-center border border-1 rounded-full overflow-hidden">
            { src ? 
                <img 
                {...props}
                alt={alt}
                className={cn('size-[42px] rounded-full stroke-primary', className)}
                loading="lazy"
                src={src}
                />
                : 
                <UserRound 
                className={cn('size-[42px] stroke-primary', className)}
                />
            }
        </div>
    )
}

export default Profile