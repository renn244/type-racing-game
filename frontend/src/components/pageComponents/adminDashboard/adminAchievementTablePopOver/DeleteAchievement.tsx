import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import axiosFetch from "@/lib/axiosFetch";
import { GlobalAchievement } from "@/types/Achievement.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";

type DeleteAchievementModalProps = {
    achievementId: GlobalAchievement['id'];
};

const DeleteAchievementModal = ({ achievementId }: DeleteAchievementModalProps) => {
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);

    const { mutate, isPending } = useMutation({
        mutationKey: ["deleteAchievement"],
        mutationFn: async () => {
            const response = await axiosFetch.delete(`/achievement/deleteAchievement?id=${achievementId}`);

            if (response.status === 404) {
                throw new Error("achievement not found");
            } else if (response.status >= 400) {
                throw new Error("internal server error");
            }

            return response.data as GlobalAchievement;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["achievements"],
            });
            setIsOpen(false);
        },
        onError: async (error) => {
            toast.error(error.message);
        },
    });

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="w-full justify-start" variant={"ghost"}>
                    Delete
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Delete Achievement</DialogTitle>
                    <DialogDescription>Are you sure you want to delete this achievement?</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <Button
                        onClick={() => {
                            mutate();
                        }}
                        variant={"destructive"}
                        className="w-full"
                    >
                        {isPending ? <LoadingSpinner /> : "Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default DeleteAchievementModal;