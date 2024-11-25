import { Tabs, TabsContent, TabsTrigger, TabsList } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription,  CardTitle, CardHeader, } from "@/components/ui/card"
import { Lock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useQuery } from "@tanstack/react-query"
import { Link, Navigate, useParams } from "react-router-dom"
import axiosFetch from "@/lib/axiosFetch"
import { UserProfile } from "@/types/User.type"
import LoadingSpinner from "@/components/common/LoadingSpinner"
import { format } from 'date-fns'
import { useAuthContext } from "@/Context/AuthContext"
import AchievementCard from "@/components/common/AchievementCard"

const Profile = () => {
    const { user: userCheck } = useAuthContext()
    const { userId } = useParams()

    const { data: user, isLoading } = useQuery({
        queryKey: ['userProfileData'],
        queryFn: async () => {
            if(!userId) return

            const response = await axiosFetch.get(`/user/getProfile?userId=${userId}`)
            if(response.status === 404) {
                return undefined
            }

            return response.data as UserProfile
        }
    })

    // const user = {
    //     username: "Jane Doe",
    //     email: "speedtyper",
    //     profile: "/placeholder.svg",
    //     bio: "Passionate about improving my typing skills and competing in challenges. Always striving for that perfect accuracy!",
    //     createdAt: "January 2023",
    //     location: "New York, USA",
    //     wpm: 85,
    //     accuracy: 98.5,
    //     totalTests: 500,
    //     totalTime: "100 hours",
    //     rank: "Expert",
    //     achievements: [
    //       { id: 1, name: "Speed Demon", description: "Achieve 100 WPM", progress: 85 },
    //       { id: 2, name: "Accuracy Master", description: "Maintain 99% accuracy", progress: 95 },
    //       { id: 3, name: "Marathon Typer", description: "Type for 24 hours total", progress: 70 },
    //       { id: 4, name: "Challenge Champion", description: "Win 50 multiplayer challenges", progress: 60 },
    //     ],
    //     recentChallenges: [
    //       { id: 1, name: "Daily Sprint", wpm: 88, accuracy: 97.5, date: "2024-02-01" },
    //       { id: 2, name: "Code Master", wpm: 75, accuracy: 99, date: "2024-01-30" },
    //       { id: 3, name: "Literature Challenge", wpm: 82, accuracy: 98.2, date: "2024-01-28" },
    //     ],
    //     stats: [
    //       { name: "Fastest WPM", value: 110, icon: Zap },
    //       { name: "Avg. Accuracy", value: "98.5%", icon: Target },
    //       { name: "Challenges Won", value: 75, icon: Trophy },
    //       { name: "Total Tests", value: 500, icon: Flag },
    //     ]
    //   }


    if (isLoading) {
        return (
            <LoadingSpinner />
        )
    }

    if(!user) {
        return <Navigate to={'/error'} />
    }

    return (
        <div className="container mx-auto px-4 py-8 min-h-[822px]">
            <div className="grid gap-6 md:grid-cols-3">
                {/* User Info Card */}
                <Card className="md:col-span-1">

                    <CardHeader className="text-center">
                        <Avatar className="w-24 h-24 mx-auto">
                            <AvatarImage src={user.profile} alt={user.username} />
                            <AvatarFallback>{user.username.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <CardTitle>{user.username}</CardTitle>
                        <CardDescription>@{user.email}</CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {user.userinfo?.bio &&  <p className="text-center text-muted-foreground">{user.userinfo.bio}</p> }
                        <div className="flex justify-center space-x-2">
                            {/* later must become status or rank */}
                            <Badge variant={'secondary'}>Role: {user.role}</Badge> 
                        </div>
                        <div className="text-sm text-muted-foreground">
                            <p>📅 Joined: {format(new Date(user.createdAt), 'yyyy-MM-d')}</p>
                            {user.userinfo?.location && <p>📍 Located: {user.userinfo.location}</p>}
                        </div>
                        <div className="space-y-1 my-1">
                            {user.userinfo?.socialMedias.map((socialMedia) => {
                                return <a className="underline-offset-2 hover:underline text-blue-700 cursor-pointer">{socialMedia}</a>
                            })}
                        </div>
                        {userCheck?.id === userId && (
                                <Button className='w-full p-0'>
                                    <Link className="w-full h-full px-4 py-2 flex justify-center items-center" to={'/settings'} >
                                        Edit Profile
                                    </Link>
                                </Button>
                        )}
                    </CardContent>
    
                </Card>
    
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Typing Statistics</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {!user.Biometrics ? (
                                <PrivateInfo />
                            ) : (
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold">{user.Biometrics?.AverageWpm}</div>
                                        <div className="text-sm text-muted-foreground">Words per minute</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="text-2xl font-bold">{user.Biometrics?.AverageAccuracy}</div>
                                        <div className="text-sm text-muted-foreground">Accuracy</div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                        
                    </Card>

                    {/* <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {true ? (
                            <Card className="col-span-4">
                                <CardContent className="h-32">
                                    <PrivateInfo />
                                </CardContent>
                            </Card>
                        ) : (
                            // user.stats.map((stat, index) => (
                            //     <Card key={index}>
                            //         <CardContent className="flex flex-col items-center justify-center p-4">
                            //             <stat.icon className="h-8 w-8 text-primary mb-2" />
                            //             <div className="text-xl font-bold">{stat.value}</div>
                            //             <div className="text-sm text-muted-foreground text-center">{stat.name}</div>
                            //         </CardContent>
                            //     </Card>
                            // ))
                            <div></div>
                        )}
                    </div> */}

                    <Tabs defaultValue="achievements">
                        <TabsList className="grid w-full grid-cols-2" >
                            <TabsTrigger value="achievements">Achievements</TabsTrigger>
                            <TabsTrigger value="recent">Recent Challenges</TabsTrigger>
                        </TabsList>
                        <TabsContent value="achievements">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Achievements</CardTitle>
                                    <CardDescription>
                                        Track your progress towards typing mastery
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {!user.Achievements ? (
                                        <PrivateInfo />
                                    ) : (
                                        user.Achievements.map((achievement) => (
                                            <AchievementCard achievement={achievement} key={achievement.id} />
                                        ))
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="recent">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Recent Challenges</CardTitle>
                                    <CardDescription>
                                        Latest Challenges
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    {!user.completedChallenges ? (
                                        <PrivateInfo />
                                    ) : (
                                        <div className="space-y-4">
                                            {user.completedChallenges.map((challenge) => (
                                                <div key={challenge.id} className="flex items-center justify-between p-4 border rounded-lg">
                                                    <div>
                                                        <h4 className="font-semibold">{challenge.challenge.title}</h4>
                                                        <p className="text-sm text-muted-foreground">{challenge.dataCompleted}</p>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="font-semibold">{challenge.wpm} WPM</p>
                                                        <p className="text-sm text-muted-foreground">{challenge.accuracy}% accuracy</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

const PrivateInfo = () => (
    <div className="flex items-center justify-center h-full">
        <div className="text-center text-muted-foreground">
            <Lock className="h-12 w-12 mx-auto mb-2" />
            <p className="text-lg font-semibold">Private Information</p>
            <p>This infomation is hidden in private mode.</p>
        </div>
    </div>
)

export default Profile