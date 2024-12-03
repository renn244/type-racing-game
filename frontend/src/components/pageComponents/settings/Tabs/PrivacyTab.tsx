import LoadingSpinner from "@/components/common/LoadingSpinner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { TabsContent } from "@/components/ui/tabs"
import axiosFetch from "@/lib/axiosFetch"
import { useMutation } from "@tanstack/react-query"
import { useState } from "react"
import Enable2FAModal from "../Enable2FAModal"

type PrivacyTabProps = {
    initialPrivateprofile: boolean,
    initialShowstats: boolean,
    initialMultiFactor: boolean
}

const PrivacyTab = ({
    initialPrivateprofile,
    initialShowstats,
    initialMultiFactor
}: PrivacyTabProps) => {
    const [privateProfile, setPrivateProfile] = useState<boolean>(initialPrivateprofile)
    const [showStats, setShowStats] = useState<boolean>(initialShowstats)
    const [multiFactor, setMultiFactor] = useState<boolean>(initialMultiFactor)

    const { mutate: saveChanges, isPending } = useMutation({
        mutationKey: ['updatePrivacySettings'],
        onMutate: async () => {
            const response = await axiosFetch.post('/user/updatePrivacySettings', {
                privateProfile: privateProfile,
                showStats: showStats,
            })

            return response.data
        }
    })

    return (
        <TabsContent value="privacy">
            <Card>
                <CardHeader>
                    <CardTitle>Privacy & Security</CardTitle>
                    <CardDescription>
                        Manage your account's privacy and security settings
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="private-profile">Private Account</Label>
                        <Switch checked={privateProfile} onCheckedChange={setPrivateProfile} id="private-profile" />
                    </div>
                    <div className="flex items-center justify-between">
                        <Label htmlFor="show-stats">Show Statistics Publicly</Label>
                        <Switch checked={showStats} onCheckedChange={setShowStats} id="show-stats" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="two-factor">
                            Two-Factor Authentication {""} 
                            <span className="font-bold">{multiFactor ? "(Enabled)" : "(Disabled)"}</span>
                        </Label>
                        <Enable2FAModal MultiFactor={multiFactor} setMultiFactor={setMultiFactor} />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button
                    onClick={() => saveChanges()}
                    disabled={isPending}
                    >
                        {isPending ? <LoadingSpinner /> : 'Save Privacy Settings'}
                    </Button>
                </CardFooter>
            </Card>
        </TabsContent>
    )
}

export default PrivacyTab