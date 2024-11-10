import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { useMutation } from "@tanstack/react-query"
import LoadingSpinner from "@/components/common/LoadingSpinner"
import { useState } from "react"
import toast from "react-hot-toast"
import axiosFetch from "@/lib/axiosFetch"

const MultiFa = () => { 
    const [searchParams] = useSearchParams()
    const [error, setError] = useState('')
    const [otp, setOtp] = useState('')

    const { mutate, isPending } = useMutation({
        mutationKey: ['multiFA'],
        mutationFn: async () => {
            if(otp.length !== 6) return toast.error("Please enter a valid OTP")

            const response = await axiosFetch.post('/auth/VerifyMultiFa', {
                userId: searchParams.get('userId'),
                token: otp
            })

            if(response.status > 400) {
                return toast.error(response.data.message)
            }

            if(response.status === 400) {
                return setError(response.data.message)
            }

            window.localStorage.setItem('access_token', response.data.access_token)
            window.localStorage.setItem('refresh_token', response.data.refresh_token)

            return window.location.assign('/')
        }
    })

    return (
        <div className="min-h-[750px] flex justify-center items-center">
            <Card>
                <CardHeader>
                    <CardTitle>
                        Multi Factor Authentication
                    </CardTitle>
                    <CardDescription className="max-w-[400px]">
                        Enter the code that you get from you email that you have registered in this account
                    </CardDescription>
                    <h2 className="text-muted-foreground">
                        Email: <span className="font-bold text-black">{searchParams.get('email')}</span>
                    </h2>
                </CardHeader>
                <CardContent className="justify-center items-center flex flex-col">
                    <div>
                        <InputOTP 
                        value={otp} 
                        onChange={value => setOtp(value)} 
                        maxLength={6}>
                            <InputOTPGroup>
                                <InputOTPSlot index={0} />
                                <InputOTPSlot index={1}/>
                                <InputOTPSlot index={2}/>
                                <InputOTPSlot index={3}/>
                                <InputOTPSlot index={4}/>
                                <InputOTPSlot index={5}/>
                            </InputOTPGroup>
                        </InputOTP>
                        {error && <p className="text-red-500 font-medium">{error}</p>}
                    </div>
                </CardContent>
                <CardFooter className="justify-between">
                    <Button 
                    onClick={() => window.location.assign('/login')}
                    variant={'outline'} >
                        Back to Login
                    </Button>
                    <Button
                    disabled={isPending}
                    onClick={() => mutate() }
                    >
                        {isPending ? <LoadingSpinner /> : "Submit"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default MultiFa