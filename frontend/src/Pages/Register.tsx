import LoadingSpinner from '@/components/common/LoadingSpinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import axiosFetch from '@/lib/axiosFetch'
import { useState } from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

type RegisterInput = {
    username: string,
    email?: string,
    password: string,
    confirmPassword: string
}

const Register = () => {
    const [loading, setLoading] = useState(false)
    const { register, handleSubmit, formState: { errors }, setError } = useForm<RegisterInput>()
    const navigate = useNavigate()

    const onSubmit: SubmitHandler<RegisterInput> = async (data) => {
        setLoading(true)
        if (data.password !== data.confirmPassword) {
            setLoading(false)
            return setError('confirmPassword', {
                type: 'manual',
                message: 'passwords do not match'
            })
        }

        const response = await axiosFetch.post('/auth/register', JSON.stringify(data), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            validateStatus: () => true
        })

        if (response.status === 410) { // handling error in the fields(username, email)
            if (response.data.name) {
                return setError(response.data.name, {
                    type: 'manual',
                    message: response.data.message
                })
            } 
        }

        setLoading(false)
        navigate('/login')
    }

    return (
        <div className='w-full h-screen flex justify-center items-center'>
            <Card className='max-w-[400px] w-full shadow-lg'>
                <CardHeader>
                    <h2 className='text-2xl font-semibold'>
                        Register
                    </h2>
                </CardHeader>
                <CardContent>
                    <form 
                    className='flex flex-col gap-3 max-w-[400px] w-full'
                    onSubmit={handleSubmit(onSubmit)} >

                        <div>
                            <Input {...register("username", {
                                required: 'username is required',
                                minLength: { value: 4, message: 'Username must be at least 4 characters' },
                                maxLength: { value: 20, message: 'Username must not exceed 20 characters' }
                            })} 
                            className={`${errors.username ? 'focus-visible:ring-red-700' : ''}`}
                            placeholder='username'
                            />
                            {errors.username && <span className='font-semibold text-red-700'>{errors.username.message}</span>}
                        </div>

                        <div>
                            <Input {...register("email", {
                                pattern: {
                                    value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                                    message: 'invalid email'
                                }
                            })} 
                            className={`${errors.email ? 'focus-visible:ring-red-700' : ''}`}
                            placeholder='email' />
                            {errors.email && <span className='font-semibold text-red-700'>{errors.email.message}</span>}
                        </div>

                        <div>
                            <Input {...register("password", {
                                required: 'password is required',
                                minLength: { value: 6, message: 'Password must be at least 6 characters' },
                                maxLength: { value: 30, message: 'Password must not exceed 30 characters' }
                            })}
                            className={`${errors.confirmPassword?.message === "passwords do not match" || 
                                errors.password ? 'focus-visible:ring-red-700' : ''}`}
                            placeholder='password'/>
                            {errors.password && <span className='font-semibold text-red-700'>{errors.password.message}</span>}
                        </div>

                        <div>
                            <Input {...register("confirmPassword", {
                                required: 'confirm password is required',
                                minLength: { value: 6, message: 'Password must be at least 6 characters' },
                                maxLength: { value: 30, message: 'Password must not exceed 30 characters' }
                            })}
                            className={`${errors.confirmPassword ? 'focus-visible:ring-red-700' : ''}`}
                            placeholder='confirm Password'/>
                            {errors.confirmPassword && <span className='font-semibold text-red-700'>{errors.confirmPassword.message}</span>}
                        </div>

                        <Button 
                        disabled={loading}
                        type='submit'>
                            {loading ? <LoadingSpinner /> : "Register"}
                        </Button>
                        
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default Register