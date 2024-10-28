import LoadingSpinner from "@/components/common/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import axiosFetch from "@/lib/axiosFetch";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

type LoginInput = {
    username: string;
    password: string;
}

const Login = () => {
    const [loading, setLoading] = useState(false)
    const { register, handleSubmit, formState: { errors }, setError} = useForm<LoginInput>()
    const navigate = useNavigate()

    const onSubmit: SubmitHandler<LoginInput> = async (data) => {
        setLoading(true)
        const response = await axiosFetch.post('/auth/login', JSON.stringify(data), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            validateStatus: () => true
        })

        if (response.status === 410) { // handling the wrong username and password
            if (response.data.name) {
                setError(response.data.name, {
                    type: 'manual',
                    message: response.data.message
                })
            }
            setLoading(false)
            return 
        }
        
        if (response.status > 400) {
            setLoading(false)
            return
        }

        localStorage.setItem('access_token', response.data.access_token)
        localStorage.setItem('refresh_token', response.data.refresh_token)

        setLoading(false)
        navigate('/')
    }

    return (
        <div className="w-full h-screen flex justify-center items-center">
            <Card className="max-w-[400px] w-full shadow-lg">
                <CardHeader>
                    <h2 className="text-2xl font-semibold">
                        Login
                    </h2>
                </CardHeader>
                <CardContent>
                    <form
                    className="flex flex-col gap-3"
                    onSubmit={handleSubmit(onSubmit)}
                    >

                        <div>
                            <Input {...register('username', { 
                                required: 'Username is required',
                                minLength: { value: 4, message: 'Username must be at least 4 characters' },
                                maxLength: { value: 20, message: 'Username must not exceed 20 characters' }
                            })}
                            className={`${errors.username ? 'focus-visible:ring-red-700' : ''}`}
                            placeholder="Username"
                            />
                            {errors.username && <span className="font-semibold text-red-700">{errors.username.message}</span>}
                        </div>

                        <div>
                            <Input {...register('password', { 
                                required: 'Password is required',
                                minLength: { value: 6, message: 'Password must be at least 6 characters' },
                                maxLength: { value: 30, message: 'Password must not exceed 30 characters' }
                            })}
                            className={`${errors.password ? 'focus-visible:ring-red-700' : ''}`}
                            type="password"
                            placeholder="Password"
                            />
                            {errors.password && <span className="font-semibold text-red-700">{errors.password.message}</span>}
                        </div>
                        
                        <Link className="font-medium" to="/register">
                            Don't have an account? <span className="text-blue-600 underline-offset-2 hover:underline">Register</span> 
                        </Link>

                        <Button
                        disabled={loading}
                        type="submit"
                        >
                            {loading ? <LoadingSpinner /> : "Login"}
                        </Button>

                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default Login