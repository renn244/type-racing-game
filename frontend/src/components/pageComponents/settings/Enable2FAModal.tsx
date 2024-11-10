import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuthContext } from "@/Context/AuthContext"
import axiosFetch from "@/lib/axiosFetch"
import { useMutation } from "@tanstack/react-query"
import { Dispatch, SetStateAction, useState } from "react"

type Enable2FAModalProps = {
    MultiFactor: boolean,
    setMultiFactor: Dispatch<SetStateAction<boolean>>
}

const Enable2FAModal = ({
    MultiFactor,
    setMultiFactor
}: Enable2FAModalProps) => {
    const [isOpen, setIsOpen] = useState(false)
    const { user } = useAuthContext()
    
    const hasEmail = user?.email ? true : false
    const TextToShow = MultiFactor ? "Disable" : "Enable" // will decide what to show base on the current state of 2FA

    const { mutate, isPending } = useMutation({
        mutationKey: ['update2FA'],
        mutationFn: async () => {
            const response = await axiosFetch.post('/user/enable2FA', {
                multiFA: MultiFactor
            })
            
            setMultiFactor(prev => !prev)
            setIsOpen(false)
            return response.data
        },
    })

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant={MultiFactor ? "destructive" : "outline"} className="w-full">
                {TextToShow} Two-Factor Authentication
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {TextToShow}
                        Two-Factor Authentication</DialogTitle>
                    <DialogDescription>
                        Secure your account with an extra layer of security
                    </DialogDescription>
                </DialogHeader>
                {!hasEmail && (
                    <Card>
                        <CardContent className="p-6">
                            <p className="text-red-600">
                                Two-Factor Authentication is currently disabled for your account. 
                                To enable it, you will need to verify your email address.
                            </p>
                        </CardContent>
                    </Card>
                )}
                {hasEmail && (
                    <div className="space-y-2 py-2">
                        <div className="space-y-1">
                            <Label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email
                            </Label>
                            <Input id="email" value={user?.email} />
                        </div>
                    </div>
                )}
                <DialogFooter>
                    <Button variant={'outline'} onClick={() => setIsOpen(false)}>
                        Cancel
                    </Button>
                    <Button 
                    onClick={() => mutate()}
                    disabled={!hasEmail || isPending}>
                        {TextToShow} Two-Factor Authentication
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default Enable2FAModal