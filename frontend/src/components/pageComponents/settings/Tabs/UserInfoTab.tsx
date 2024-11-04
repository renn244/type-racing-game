import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { TabsContent } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { useMutation } from "@tanstack/react-query"
import { ChangeEvent, useState } from "react"
import axiosFetch from "@/lib/axiosFetch"
import LoadingSpinner from "@/components/common/LoadingSpinner"


type UserInfoTabProps = {
    initialBio?: string,
    initialLocation?: string,
    initialSocialMedias: string[]
}

type userInfoForm = {
    bio: string,
    location: string,
    socialMedias: string[]
}

const UserInfoTab = ({
    initialBio,
    initialLocation,
    initialSocialMedias
}: UserInfoTabProps) => {
    const [newSocialMedia, setNewSocialMedia] = useState<string>("")
    const [userInfo, setUserInfo] = useState<userInfoForm>({
        bio: initialBio || "",
        location: initialLocation || "",
        socialMedias: initialSocialMedias || [""]
    })

    const changeEvent = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setUserInfo({
            ...userInfo,
            [e.target.name]: e.target.value
        })
    }

    const addToSocialMedia = () => {
        setUserInfo({
            ...userInfo,
            socialMedias: [...userInfo.socialMedias, newSocialMedia]
        })
        setNewSocialMedia('')
    }

    const changeSocialMedia = (e: ChangeEvent<HTMLInputElement>, idx: number) => {
        const socialMedias = [...userInfo.socialMedias]
        socialMedias[idx] = e.target.value  

        setUserInfo({
            ...userInfo,
            [e.target.name]: socialMedias
        })
    }

    const { mutate: saveChanges, isPending } = useMutation({
        mutationKey: ['userPreferencesSave'],
        mutationFn: async () => {
            const response = await axiosFetch.post('/user/updateUserInfo', userInfo)
            
            console.log(response.data)

            return response.data 
        }
    })

    return (
        <TabsContent value="userInfo">
            <Card>
                <CardHeader>
                    <CardTitle>User Information</CardTitle>
                    <CardDescription>
                        Manage User Information details 
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="BioInput">Bio</Label>
                        <Textarea 
                        name="bio"
                        value={userInfo.bio}
                        onChange={changeEvent}
                        placeholder="eg. I am a passionate software engineer with a love for clean code and innovative solutions. I enjoy exploring new technologies and sharing my knowledge with others."
                        className="resize-none"></Textarea>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="LocationInput">Location</Label>
                        <Input 
                        name="location"
                        value={userInfo.location}
                        onChange={changeEvent}
                        className="w-full"
                        placeholder="eg. New York City, NY, USA"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Social Media's</Label>
                        <div className="space-y-2">
                            {userInfo.socialMedias?.map((socialMedia, idx) => {
                                return (
                                    <Input className="max-w-[500px]" name="socialMedias" value={socialMedia} 
                                    key={idx} onChange={e => changeSocialMedia(e, idx)} />
                                )
                            })}
                            <div className="flex gap-3 max-w-[680px]">
                                <Input className="max-w-[500px]" value={newSocialMedia}
                                onChange={e => setNewSocialMedia(e.target.value)} 
                                placeholder="social media Link" />
                                {newSocialMedia && <Button onClick={addToSocialMedia} variant={'secondary'}>Add To Social Media</Button>}
                            </div>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                    onClick={() => saveChanges()}
                    disabled={isPending}
                    className="rounded-lg"
                    >
                        {isPending ? <LoadingSpinner /> : "Save Changes"}
                    </Button>
                </CardFooter>
            </Card>
        </TabsContent>
    )
}

export default UserInfoTab