import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import axiosFetch from "@/lib/axiosFetch"
import { Category, GlobalAchievement, GlobalAchievementForm, TaskType } from "@/types/Achievement.type"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import toast from "react-hot-toast"

type EditAchievementModalProps = {
    achievement: GlobalAchievement
}

const EditAchievementModal = ({
    achievement
}: EditAchievementModalProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const [taskType, setTaskType] = useState<TaskType>(achievement.taskType)
    const queryClient = useQueryClient()
    const { register, handleSubmit, getValues, setFocus, setError , formState: { errors }, setValue, clearErrors } = useForm<GlobalAchievementForm>({
        defaultValues: {
            name: achievement.name,
            description: achievement.description,
            taskType: achievement.taskType,
            category: achievement.category,
            goal: achievement.goal,
            occurrence: achievement.occurrence || 0
        }
    })

    const { mutate, isPending } = useMutation({
        mutationKey: ['EditAchievement'],
        mutationFn: async (data: GlobalAchievementForm) => {
            if(!data.category) {
                setError('category', {
                    type: 'required',
                    message: 'Category is required'
                })
                setFocus('category')
                return
            }
    
            if(!data.taskType) {
                setError('taskType', {
                    type: 'required',
                    message: 'TaskType is required'
                })
                setFocus('taskType')
                return
            }
            
            if(!data.occurrence && data.taskType === 'Process') {
                setError('occurrence', {
                    type: 'required',
                    message: 'Occurrence is required when taskType is Process'
                })
                setFocus('occurrence')
                return  
            }
            const response = await axiosFetch.patch(`/globalAchievement/updateGlobalAchievement?id=${achievement.id}`, data)

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
            
            return response.data as GlobalAchievement
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['globalAchievements']
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
                        Edit Global Achievement
                    </DialogTitle>
                    <DialogDescription>
                        Edit the global achievement
                    </DialogDescription>
                </DialogHeader>
                <form
                    className="flex flex-col gap-3 max-w-[462px]"
                    onSubmit={handleSubmit(mutate as SubmitHandler<GlobalAchievementForm>)}>
                        <div>
                            <Input {...register('name', {
                                required: 'Name is required',
                                minLength: { value: 5, message: 'name should be at least 5 characters long' },
                                maxLength: { value: 40, message: 'Title should not exceed 40 characters' }
                            })}
                            className={`${errors.name ? 'focus-visible:ring-red-700' : ''}`}
                            placeholder="Name"
                            />
                            {errors.name && <span className="font-semibold text-red-700">{errors.name.message}</span>}
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

                        <div className="flex gap-2 justify-around">
                            <div>
                                <Select value={getValues('category')} onValueChange={value => {
                                    setValue('category', (value as Category))
                                    if (errors.category) {
                                        clearErrors('category')
                                    }
                                }}>
                                    <SelectTrigger className={`w-[227px] ${errors.category && 'focus:ring-red-700 ring-red-700'}`}>
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="WPM">WPM</SelectItem>
                                            <SelectItem value="Accuracy">Accuracy</SelectItem>
                                            <SelectItem value="Challenges">Challenges</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {errors.category && <span className="font-semibold text-red-700">{errors.category.message}</span>}
                            </div>
                            <div>
                                <Select value={getValues('taskType')} onValueChange={value => {
                                    setValue('taskType', (value as TaskType))
                                    setTaskType(value as TaskType)
                                    if (errors.category) {
                                        clearErrors('taskType')
                                    }
                                }}>
                                    <SelectTrigger className={`w-[227px] ${errors.category && 'focus:ring-red-700 ring-red-700'}`}>
                                        <SelectValue placeholder="taskType" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="Milestone">Milestone</SelectItem>
                                            <SelectItem value="Process">Process</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {errors.taskType && <span className="font-semibold text-red-700">{errors.taskType.message}</span>}
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-2 justify-around">
                            <div className="w-[300px]">
                                <Input {...register('goal', {
                                    required: 'Goal is required',
                                    valueAsNumber: true,
                                    min: { value: 1, message: 'Goal should be at least 1' },
                                })}
                                type="number"
                                className={`${errors.goal ? 'focus-visible:ring-red-700' : ''} w-full max-w-[300px]`}
                                placeholder="Goal"
                                />
                            </div>
                            <div className="w-[300px]">
                                {taskType === 'Process' && (
                                    <Input {...register('occurrence', {
                                        valueAsNumber: true,
                                        min: { value: 0, message: 'Occurrence should be at least 1' },
                                    }
                                    )}
                                    type="number"
                                    className={`${errors.occurrence ? 'focus-visible:ring-red-700' : ''} w-full max-w-[300px]`}
                                    placeholder="Occurrence"
                                    />
                                    
                                )}
                            </div>
                        </div>
                        {errors.goal && <span className="font-semibold text-red-700">{errors.goal.message}</span>}
                        {errors.occurrence && <span className="font-semibold text-red-700">{errors.occurrence.message}</span>}

                        <Button
                        disabled={isPending}
                        type="submit"
                        >
                            {isPending ? <LoadingSpinner /> : "Create"}
                        </Button>
                    </form>
            </DialogContent>
        </Dialog>
    )
}

export default EditAchievementModal