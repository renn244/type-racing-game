import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Category, GlobalAchievementForm, TaskType } from "@/types/Achievement.type"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select" 
import { useForm, SubmitHandler } from "react-hook-form"
import { Button } from "@/components/ui/button"
import LoadingSpinner from "@/components/common/LoadingSpinner"
import axiosFetch from "@/lib/axiosFetch"
import { useState } from "react"

const AddGlobalAchievement = () => {
    // this is only used for the dynamic forms for occurence
    const [taskType, setTaskType] = useState<TaskType | null>(null)
    const { register, handleSubmit, setValue, clearErrors, setError, setFocus, formState: { errors, isLoading } } = useForm<GlobalAchievementForm>()

    const onSubmit:SubmitHandler<GlobalAchievementForm> = async (data) => {
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

        if(data.category === "Challenges" && data.taskType === "Process") {
            setError('category', {
                type: 'manual',
                message: 'Challenges category cannot have a process taskType'
            })
            setFocus('taskType')
            return
        }

        const response = await axiosFetch.post('/globalAchievement/createGlobalAchievement', data)

        if (response.status === 410) {
            if (response.data.name) {
                setError(response.data.name, {
                    type: 'manual',
                    message: response.data.message
                })
            }
            return
        } 

        return window.location.assign('/adminGlobalAchievement')
    }

    return (
        <div className="w-full h-screen flex justify-center items-center">
            <Card className="max-w-[700px] w-full shadow-lg" >
                <CardHeader>
                    <h2 className="text-3xl font-bold">
                        Create Global Achievement
                    </h2>
                </CardHeader>
                <CardContent>
                    <form
                    className="flex flex-col gap-3"
                    onSubmit={handleSubmit(onSubmit)}>
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
                                <Select onValueChange={value => {
                                    setValue('category', (value as Category))
                                    if (errors.category) {
                                        clearErrors('category')
                                    }
                                }}>
                                    <SelectTrigger className={`w-[300px] ${errors.category && 'focus:ring-red-700 ring-red-700'}`}>
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
                                <Select onValueChange={value => {
                                    setValue('taskType', (value as TaskType))
                                    setTaskType(value as TaskType)
                                    if (errors.taskType) {
                                        clearErrors('taskType')
                                    }
                                }}>
                                    <SelectTrigger className={`w-[300px] ${errors.category && 'focus:ring-red-700 ring-red-700'}`}>
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
                        disabled={isLoading}
                        type="submit"
                        >
                            {isLoading ? <LoadingSpinner /> : "Create"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default AddGlobalAchievement