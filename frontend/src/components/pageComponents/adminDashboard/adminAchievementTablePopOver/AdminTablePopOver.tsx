import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { GlobalAchievement } from "@/types/Achievement.type"
import { Ellipsis } from "lucide-react"
import DeleteAchievementModal from "./DeleteAchievement"
import EditAchievementModal from "./EditAchievement"

type AdminTablePopOverProps = {
    globalAchivement: GlobalAchievement
}

const AdminTablePopOver = ({
    globalAchivement
}: AdminTablePopOverProps) => {

    return (
        <Popover>
            <PopoverTrigger>
                <Ellipsis />
            </PopoverTrigger>
            <PopoverContent  align="start" className="flex flex-col p-1 max-w-[100px] items-start">
                <EditAchievementModal achievement={globalAchivement} />
                <DeleteAchievementModal achievementId={globalAchivement.id} />
            </PopoverContent>
        </Popover>
    )
}

export default AdminTablePopOver