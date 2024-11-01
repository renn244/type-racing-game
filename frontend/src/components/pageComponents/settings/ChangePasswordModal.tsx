import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import axiosFetch from "@/lib/axiosFetch"
import { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import toast from "react-hot-toast"

type PasswordForm = {
    password: string,
    newPassword: string,
    confirmPassword: string 
}

const ChangePasswordModal = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const { register, handleSubmit, resetField, setError, formState: { errors, isLoading } } = useForm<PasswordForm>()

    const onSubmit: SubmitHandler<PasswordForm> = async (data) => {
        if (data.newPassword !== data.confirmPassword) {
            setError('newPassword', {
                type: 'manual',
                message: 'newPassword does not match'
            })
            setError('confirmPassword', {
                type: 'manual',
                message: 'confirmPassword does not match'
            })
            return
        }

        const response = await axiosFetch.post('/user/updatePassword', data)
        
        if(response.status === 410) {
            if(response.data.name) {
                setError(response.data.name, {
                    type: 'manual',
                    message: response.data.message
                })
            }
            return
        }

        if(response.status >= 400) {
            return toast.error('Failed to update password try again later') 
        }

        toast.success('Password updated successfully')
        setIsOpen(false)
        resetField('password')
        resetField('newPassword')
        resetField('confirmPassword')
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button type="button" variant={'outline'} className="rounded-lg">
                    Change Password
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <DialogHeader>
                        <DialogTitle>Change Password</DialogTitle>
                        <DialogDescription>
                            Change your password here you. you can change it anytime you want.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-3 py-4">
                        <div className="space-y-1">
                            <Label htmlFor="PasswordInput">Password</Label>
                            <Input {...register('password', { 
                                required: 'Password is required',
                                minLength: { value: 6, message: 'Password must be at least 6 characters' },
                                maxLength: { value: 30, message: 'Password must not exceed 30 characters' }
                            })}
                            className={`${errors.password ? 'focus-visible:ring-red-700' : ''}`}
                            type="password"
                            id="PasswordInput"/>
                            {errors.password && <span className="font-semibold text-red-700">{errors.password.message}</span>}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="newPasswordInput">
                                new Password
                            </Label>
                            <Input {...register('newPassword', { 
                                required: 'newPassword is required',
                                minLength: { value: 6, message: 'Password must be at least 6 characters' },
                                maxLength: { value: 30, message: 'Password must not exceed 30 characters' }
                            })}
                            className={`${errors.newPassword ? 'focus-visible:ring-red-700' : ''}`}
                            type="password"
                            id="newPasswordInput"/>
                            {errors.newPassword && <span className="font-semibold text-red-700">{errors.newPassword.message}</span>}
                        </div>
                        <div className="space-y-1">
                            <Label htmlFor="confirmPasswordInput">confirm Password</Label>
                            <Input {...register('confirmPassword', { 
                                required: 'confirmPassword is required',
                                minLength: { value: 6, message: 'Password must be at least 6 characters' },
                                maxLength: { value: 30, message: 'Password must not exceed 30 characters' }
                            })}
                            className={`${errors.confirmPassword ? 'focus-visible:ring-red-700' : ''}`}
                            type="password"
                            id="confirmPasswordInput"/>
                            {errors.confirmPassword && <span className="font-semibold text-red-700">{errors.confirmPassword.message}</span>}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button disabled={isLoading} type="submit" className="rounded-lg">
                            {isLoading ? <LoadingSpinner  /> : "Save Changes"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}

export default ChangePasswordModal