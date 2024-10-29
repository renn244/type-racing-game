import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import axiosFetch from "@/lib/axiosFetch"
import { Challenge, CreateChallengeForm, difficulty } from "@/types/Challenge.type"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import toast from "react-hot-toast"


type EditChallengeModalProps = {
    challenge: Challenge
}

const EditChallengeModal = ({
    challenge
}: EditChallengeModalProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const queryClient = useQueryClient()
    const { register, handleSubmit, getValues, setError , formState: { errors }, setValue, clearErrors } = useForm<CreateChallengeForm>({
        defaultValues: {
            title: challenge.title,
            description: challenge.description,
            challenge: challenge.challenge,
            difficulty: challenge.difficulty
        }
    })

    const { mutate, isPending } = useMutation({
        mutationKey: ['editChallenge'],
        mutationFn: async (data: CreateChallengeForm) => {
            const response = await axiosFetch.patch(`/challenge/editChallenge/${challenge.id}`, data)

            if (response.status === 404 || response.status === 410) {
                if (response.data.name) {
                    setError(response.data.name, {
                        type: 'manual',
                        message: response.data.message
                    })
                }
                throw new Error()
            } else if (response.status >= 400) {
                throw new Error('internal server error')
            }    
            
            return response.data as Challenge
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['challenges']
            })
            setIsOpen(false)
        },
        onError: (error) => {
            if (error.message === 'internal server error') {
                toast.error('error try again!')
            }
        }
        
    })

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button className="w-full justify-start" variant={'ghost'}>
                    Edit
                </Button>
            </DialogTrigger>
            <DialogContent>

                <DialogHeader>
                    <DialogTitle>
                        Edit Challenge
                    </DialogTitle>
                    <DialogDescription>
                        Edit the challenge
                    </DialogDescription>
                </DialogHeader>
                {/* do later */}
                <form
                className="flex flex-col gap-3"
                onSubmit={handleSubmit(mutate as SubmitHandler<CreateChallengeForm>)}
                >
                    <div>
                        <Input  {...register('title', {
                            required: 'Title is required',
                            minLength: { value: 5, message: 'Title should be at least 5 characters long' },
                            maxLength: { value: 40, message: 'Title should not exceed 40 characters' }
                        })}
                        className={`${errors.title ? 'focus-visible:ring-red-700' : ''}`}
                        placeholder="Title"
                        />
                        {errors.title && <span className="font-semibold text-red-700">{errors.title.message}</span>}
                    </div>
                    <div>
                        <Textarea {...register('description', {
                            required: 'Description is required',
                            minLength: { value: 10, message: 'Description should be at least 10 characters long' },
                            maxLength: { value: 300, message: 'Description should not exceed 500 characters' }
                        })}
                        className={`${errors.description ? 'focus-visible:ring-red-700' : ''} resize-none`}
                        placeholder="Description"
                        />
                        {errors.description && <span className="font-semibold text-red-700">{errors.description.message}</span>}
                    </div>
                    <div>
                        <Textarea {...register('challenge', {
                            required: 'Challenge is required',
                            minLength: { value: 30, message: 'Challenge should be at least 30 characters long' },
                            maxLength: { value: 300, message: 'Challenge should not exceed 300 characters' }
                        })}
                        className={`${errors.challenge ? 'focus-visible:ring-red-700' : ''} resize-none`}
                        placeholder="Challenge"
                        />
                        {errors.challenge && <span className="font-semibold text-red-700">{errors.challenge.message}</span>}
                    </div>
                    
                    <div>
                        <Select 
                        defaultValue={getValues('difficulty')}
                        onValueChange={value => {
                            // we need to manually control and clear the error
                            setValue('difficulty', (value as difficulty))    
                            if (errors.difficulty) {
                                clearErrors('difficulty')
                            }
                        }}>
                            <SelectTrigger className={`w-[390px] ${errors.difficulty && 'focus:ring-red-700 ring-red-700'}`}>
                                <SelectValue placeholder="Difficulty" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem value="EASY" >easy</SelectItem>
                                    <SelectItem value="MEDIUM" >medium</SelectItem>
                                    <SelectItem value="HARD" >hard</SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        {errors.difficulty && <span className="font-semibold text-red-700">{errors.difficulty.message}</span>}
                    </div>
                    <Button 
                    disabled={isPending}
                    type="submit" >
                        {isPending ? <LoadingSpinner /> : "Create"}
                    </Button>
                </form>

            </DialogContent>
        </Dialog>
    )
}

export default EditChallengeModal