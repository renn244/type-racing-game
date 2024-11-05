import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Challenge } from "@/types/Challenge.type"
import { Ellipsis } from "lucide-react"
import EditChallengeModal from "./EditChallenge"
import DeleteChallengeModal from "./DeleteChallenge"


type AdminTablePopOverProps = {
    challenge: Challenge
}

const AdminTablePopOver = ({
    challenge
}: AdminTablePopOverProps) => {

    
    return (
        <Popover>
            <PopoverTrigger>
                <Ellipsis />
            </PopoverTrigger>
            <PopoverContent  align="start" className="flex flex-col p-1 max-w-[100px] items-start">
                <EditChallengeModal challenge={challenge} />
                <DeleteChallengeModal challengeId={challenge.id} />                                                       
            </PopoverContent>
        </Popover>
    )
}

export default AdminTablePopOver