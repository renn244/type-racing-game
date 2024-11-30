import LoadingSpinner from "@/components/common/LoadingSpinner"
import AccountTab from "@/components/pageComponents/settings/Tabs/AccountTab"
import NotificationTab from "@/components/pageComponents/settings/Tabs/NotificationTab"
import PrivacyTab from "@/components/pageComponents/settings/Tabs/PrivacyTab"
import TypePreferencesTab from "@/components/pageComponents/settings/Tabs/TypePreferences"
import UserInfoTab from "@/components/pageComponents/settings/Tabs/UserInfoTab"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import axiosFetch from "@/lib/axiosFetch"
import { UserSettings } from "@/types/User.type"
import { useQuery } from "@tanstack/react-query"
import toast from "react-hot-toast"

const Settings = () => {

    const { data, isLoading } = useQuery({
        queryKey: ['userInfo'],
        queryFn: async () => {
            const response = await axiosFetch.get('/user/getUserInformation')
            
            if(response.status >= 400) {
                if (response.data.name) {
                    toast.error(`${response.data.name} try again`)
                }
                else {
                    toast.error('An error occurred try again')
                }

                return
            }

            return response.data as UserSettings
        },
        refetchOnWindowFocus: false,
        retry: 1
    }) 

    if(isLoading) {
        return (
            <div className="min-h-[750px] bg-background">
                <div className="container mx-auto px-3 py-6">
                
                    <h1 className="text-3xl font-bold mb-6">User Settings</h1>

                    <div className="p-4 rounded-lg">
                        <LoadingSpinner className="w-12 h-12" />
                    </div>

                </div>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="min-h-[750px] bg-background">
                <div className="container mx-auto px-3 py-6">
                
                    <h1 className="text-3xl font-bold mb-6">User Settings</h1>

                    <div className="bg-white p-4 rounded-lg">
                        <p className="text-red-500">An error occurred try again</p>
                    </div>

                </div>
            </div>
        )
    }

    return (
       <div className="min-h-[750px] bg-background">
            <div className="container mx-auto px-3 py-6">
            
                <h1 className="text-3xl font-bold mb-6">User Settings</h1>

                {isLoading ? 
                    <LoadingSpinner className="w-12 h-12" /> 
                    : (
                        <Tabs defaultValue="account" className="space-y-4">
                                            
                            <TabsList>
                                <TabsTrigger value="account" >Account</TabsTrigger>
                                <TabsTrigger value="userInfo">User Info</TabsTrigger>
                                <TabsTrigger value="preferences" >Preferences</TabsTrigger>
                                <TabsTrigger value="notifications" >Notifications</TabsTrigger>
                                <TabsTrigger value="privacy" >Privacy & Security</TabsTrigger>
                            </TabsList>

                            <AccountTab initialProfile={data.profile} initialUsername={data.username} initialEmail={data.email} />

                            <UserInfoTab initialBio={data.userinfo.bio} initialLocation={data.userinfo.location} initialSocialMedias={data.userinfo.socialMedias} />

                            <TypePreferencesTab 
                            initialFontSize={data.preferences.fontSize} 
                            initialSoundEffects={data.preferences.soundEffects}  
                            initialKeyboardLayout={data.preferences.keyboardLayout}
                            />

                            <NotificationTab />

                            <PrivacyTab 
                            initialPrivateprofile={data.preferences.privateProfile}
                            initialShowstats={data.preferences.showStats}
                            initialMultiFactor={data.multiFA}
                            />
                        </Tabs>
                    ) 
                }

            </div>
       </div>
    )
}

export default Settings