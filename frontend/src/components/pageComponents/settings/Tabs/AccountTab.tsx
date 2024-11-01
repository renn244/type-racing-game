import { TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card" 
import Profile from "@/components/common/Profile"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import React, { useState } from "react"
import FileUpload from "@/components/common/FileUpload"
import { useMutation } from "@tanstack/react-query"
import axiosFetch from "@/lib/axiosFetch"
import toFormData from "@/lib/toFomData.util"
import LoadingSpinner from "@/components/common/LoadingSpinner"
import ChangePasswordModal from "../ChangePasswordModal"

type AccountTabProps = {
    profile?: string | File,
    username: string,
    email: string,
}

const AccountTab = ({
    profile,
    username,
    email,
}: AccountTabProps) => {
    const [file, setFile] = useState<File | undefined>(undefined)
    const [previewFile, setPreviewFile] = useState<any>('')
    const [userInfo, setUserInfo] = useState<AccountTabProps>({
        profile: profile || '',
        username: username,
        email: email
    })

    const changeEvent = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInfo({
            ...userInfo,
            [e.target.name]: e.target.value
        })
    }

    const { mutate:saveChanges, isPending } = useMutation({
        mutationKey: ['updateUser'],
        onMutate: async () => {
            const formData = toFormData({
                ...userInfo,
                profile: file
            })
            const response = await axiosFetch.post('/user/updateAccount', formData, {
                headers: {
                    'Content-Type' : 'multipart/form-data'
                }
            })

            return response.data
        }
    })

    return (
        <TabsContent value="account">
            <Card>
                    <CardHeader>
                        <CardTitle>Account Information</CardTitle>
                        <CardDescription>
                            Manage your account details and profile
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">

                        <div className="flex items-center space-x-4">
                            <Profile src={previewFile || userInfo.profile} className="w-20 h-20" />
                            <FileUpload
                            file={file}
                            setFile={setFile} 
                            setPreviewFile={setPreviewFile}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="UsernameInput">Username</Label>
                            <Input 
                            name="username"
                            onChange={(e) => changeEvent(e)}
                            value={userInfo.username}
                            id="UsernameInput"  />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="EmailInput">Email</Label>
                            <Input 
                            name="email"
                            onChange={(e) => changeEvent(e)}
                            value={userInfo.email} 
                            id="EmailInput" />
                        </div>
                        
                        <div className="space-y-2">
                            <Label htmlFor="PasswordInput">Password</Label>
                            <Input 
                            readOnly 
                            type="password"
                            value={'*************'} 
                            id="PasswordInput" />

                            <ChangePasswordModal />                            
                        </div>
                        
                    </CardContent>
                    <CardFooter>
                        <Button 
                        onClick={() => saveChanges()}
                        disabled={isPending}
                        className="rounded-lg">
                            {isPending ? <LoadingSpinner /> : "Save Changes"}
                        </Button>
                    </CardFooter>
            </Card>
        </TabsContent>
    )
}

export default AccountTab