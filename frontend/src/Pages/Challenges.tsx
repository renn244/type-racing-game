
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Trophy, Zap, Star, Code, BookOpen } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import axiosFetch from '@/lib/axiosFetch'
import {  Challenge, ChallengesForUser } from '@/types/Challenge.type'
import { Link } from 'react-router-dom'

const DifficultyBadge = ({ difficulty }: { difficulty: string }) => {
    const colors = {
      Easy: "bg-green-500/10 text-green-500",
      Medium: "bg-yellow-500/10 text-yellow-500",
      Hard: "bg-red-500/10 text-red-500"
    }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[difficulty as keyof typeof colors]}`}>
        {difficulty}
      </span>
    )
}

const ChallengeCard = ({ challenge }: { challenge: Challenge }) => (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xl mb-2">{challenge.title}</CardTitle>
            <CardDescription>{challenge.description}</CardDescription>
          </div>
          {challenge.category === "Featured" && (
            <Star className="h-5 w-5 text-yellow-500" />
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-4">
          <DifficultyBadge difficulty={challenge.difficulty} />
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {/* {challenge.duration} */}
            no duration
          </Badge>
          {/* <Badge variant="secondary" className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {challenge.participants.toLocaleString()}
          </Badge> */}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Code className="h-4 w-4 text-muted-foreground" />
          </div>
          <Link to={`/challenge?challengeId=${challenge.id}`}>
            <Button className='rounded-lg'>Start Challenge</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
)

export default function Challenges() {
  const [searchQuery, setSearchQuery] = useState('')
  const [category, setCategory] = useState<string>('')

  const { data: challenges, refetch } = useQuery({
    queryKey: ['challenges', category],
    queryFn: async () => {
      const response = await axiosFetch.get(`/challenge/getChallengesForUser?search=${searchQuery}&category=${category}`)

      return response.data as ChallengesForUser
    },
  })

  const changeTab = (category: string) => {
    setCategory(category)
  }

  return (
    <div className="min-h-[750px]">
      <div className="min-h-screen bg-background">
        <main className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Typing Challenges</h1>
              <p className="text-muted-foreground">Test your skills with our collection of typing challenges</p>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <Input
                placeholder="Search challenges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-xs"
              />
              <Button onClick={() => refetch()}>Search</Button>
            
            </div>
          </div>

          <Tabs defaultValue="all" className="space-y-8" >
            <TabsList>
              <TabsTrigger onClick={() => changeTab('')} value="all">All Challenges</TabsTrigger>
              <TabsTrigger onClick={() => changeTab('Featured')} value="featured">Featured</TabsTrigger>
              <TabsTrigger onClick={() => changeTab('Daily')} value="daily">Daily</TabsTrigger>
              <TabsTrigger onClick={() => changeTab('Practice')} value="practice">Practice</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-8">
              {/* Featured Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-500" />
                  <h2 className="text-2xl font-semibold">Featured Challenges</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {challenges?.featured.map(challenge => (
                    <ChallengeCard key={challenge.id} challenge={challenge} />
                  ))}
                </div>
              </div>

              {/* Daily Challenges */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-semibold">Daily Challenges</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {challenges?.daily.map(challenge => (
                    <ChallengeCard key={challenge.id} challenge={challenge} />
                  ))}
                </div>
              </div>

              {/* Practice Challenges */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <h2 className="text-2xl font-semibold">Practice Challenges</h2>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  {challenges?.practice.map(challenge => (
                    <ChallengeCard key={challenge.id} challenge={challenge} />
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="featured" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {challenges?.featured.map(challenge => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="daily" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {challenges?.daily.map(challenge => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="practice" className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {challenges?.practice.map(challenge => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}