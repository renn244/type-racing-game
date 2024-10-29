import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import axiosFetch from "@/lib/axiosFetch"
import { Challenge } from "@/types/Challenge.type"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import toast from "react-hot-toast"

type DeleteChallengeModalProps = {
    challengeId: Challenge['id']
}

const DeleteChallengeModal = ({
    challengeId
}: DeleteChallengeModalProps) => {
    const queryClient = useQueryClient()
    const [isOpen, setIsOpen] = useState(false)

    const { mutate, isPending } = useMutation({
        mutationKey: ['deleteChallenge'],
        mutationFn: async () => {
            const response = await axiosFetch.delete(`/challenge/deleteChallenge/${challengeId}`)

            if (response.status === 404) {
                throw new Error('challenge not found')
            } else if (response.status >= 400) {
                throw new Error('internal server error')
            }

            return response.data as Challenge
        },
        onSuccess: () => {
            queryClient .invalidateQueries({
                queryKey: ['challenges']
            })
            setIsOpen(false)
        },
        onError: async (error) => {
            toast.error(error.message)
        }
    }) 

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="w-full justify-start" variant={'ghost'}>
                    Delete
                </Button>
            </DialogTrigger>
            <DialogContent>

                <DialogHeader>
                    <DialogTitle>
                        Delete Challenge
                    </DialogTitle>
                    <DialogDescription>
                        Are you sure you want to delete this challenge?
                    </DialogDescription>
                </DialogHeader>
                
                <DialogFooter>
                    <Button 
                    onClick={() => mutate()}
                    disabled={isPending}
                    variant="destructive">
                        {isPending ? <LoadingSpinner /> : "Delete"}
                    </Button>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    )
}

export default DeleteChallengeModal