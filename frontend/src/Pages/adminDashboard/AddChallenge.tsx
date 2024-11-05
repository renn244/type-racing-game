import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { category, CreateChallengeForm, difficulty } from "@/types/Challenge.type"
import { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from "@/components/ui/select"
import LoadingSpinner from "@/components/common/LoadingSpinner"
import axiosFetch from "@/lib/axiosFetch"
import toast from "react-hot-toast"


const AddChallenge = () => {
    const [loading, setLoading] = useState(false)
    const { register, setValue, setError, handleSubmit, clearErrors, formState: { errors } } = useForm<CreateChallengeForm>()

    const onSubmit: SubmitHandler<CreateChallengeForm> = async (data) => {
        if(!data.difficulty) { // manually setting the error in select
            setError('difficulty', {
                type: 'required',
                message: 'Difficulty is required'
            })
            return
        }

        if(!data.category) {
            setError('category', {
                type: 'required',
                message: 'Category is required'
            })
            return
        }

        setLoading(true)
        const response = await axiosFetch.post('/challenge/createChallenge', JSON.stringify(data), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        })

        if (response.status === 410) {
            if (response.data.name) {
                setError(response.data.name, {
                    type: 'manual',
                    message: response.data.message
                })
            } else {
                toast.error(response.data.message)
            }
            setLoading(false)
            return
        } else if (response.status >= 400) {
            toast.error('error try again!')
            setLoading(false)
            return
        }

        setLoading(false)
        window.location.assign('/adminChallenge')
    }

    return (
        <div className="w-full h-screen flex justify-center items-center">
            <Card className="max-w-[700px] w-full shadow-lg">
                <CardHeader>
                    <h2 className="text-3xl font-bold">
                        Create Challenge
                    </h2>
                </CardHeader>
                <CardContent>
                    <form
                    className="flex flex-col gap-3"
                    onSubmit={handleSubmit(onSubmit)}
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
                        
                        <div className='flex gap-3'>
                            <div>   
                                <Select onValueChange={value => {
                                    // we need to manually control and clear the error
                                    setValue('difficulty', (value as difficulty))    
                                    if (errors.difficulty) {
                                        clearErrors('difficulty')
                                    }
                                }}>
                                    <SelectTrigger className={`w-[300px] ${errors.difficulty && 'focus:ring-red-700 ring-red-700'}`}>
                                        <SelectValue placeholder="Difficulty" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="Easy" >easy</SelectItem>
                                            <SelectItem value="Medium" >medium</SelectItem>
                                            <SelectItem value="Hard" >hard</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {errors.difficulty && <span className="font-semibold text-red-700">{errors.difficulty.message}</span>}
                            </div>
                            
                            <div>
                                <Select onValueChange={value => {
                                    // we need to manually control and clear the error
                                    setValue('category', (value as category))    
                                    if (errors.category) {
                                        clearErrors('category')
                                    }
                                }}>
                                    <SelectTrigger className={`w-[300px] ${errors.difficulty && 'focus:ring-red-700 ring-red-700'}`}>
                                        <SelectValue placeholder="Category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectItem value="Featured" >Featured</SelectItem>
                                            <SelectItem value="Daily" >Daily</SelectItem>
                                            <SelectItem value="Practice" >Practice</SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                                {errors.category && <span className="font-semibold text-red-700">{errors.category.message}</span>}
                            </div>
                        </div>

                        <Button 
                        disabled={loading}
                        type="submit" >
                            {loading ? <LoadingSpinner /> : "Create"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default AddChallenge