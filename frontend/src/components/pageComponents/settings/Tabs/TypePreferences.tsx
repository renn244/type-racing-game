
import { TabsContent } from "@/components/ui/tabs"
import { CardHeader, CardContent, CardFooter, Card, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectTrigger, SelectItem, SelectValue, SelectContent } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Switch } from "@/components/ui/switch"
import { useMutation } from "@tanstack/react-query"
import axiosFetch from "@/lib/axiosFetch"
import LoadingSpinner from "@/components/common/LoadingSpinner"

type keyboardLayout = 'qwerty' | 'azerty' | 'dvorak'

const TypePreferencesTab = () => {
    const [soundEffect, setSoundEffect] = useState<boolean>(true)
    const [fontSize, setFontSize] = useState<number>(16)
    const [keyboardLayout, setKeyboardLayout] = useState<keyboardLayout>('qwerty')

    const { mutate: saveChanges, isPending } = useMutation({
        mutationKey: ['updateTypePreferences'],
        onMutate: async () => {
            const response = await axiosFetch.post('/user/updateTypePreferences', {
                soundEffects: soundEffect,
                fontSize: fontSize,
                keyboardLayout: keyboardLayout
            })

            return response.data
        }
    })

    return (
        <TabsContent value="preferences">
            <Card>
                <CardHeader>
                    <CardTitle>Typing Preferences</CardTitle>
                    <CardDescription>
                        Customize your typing experience
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="sound-effects">Sound Effects</Label>
                        <Switch checked={soundEffect} onCheckedChange={setSoundEffect} id="sound-effects" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="keyboard-layout">Keyboard Layout</Label>
                        <Select value={keyboardLayout} onValueChange={value => setKeyboardLayout(value as keyboardLayout)} >
                            <SelectTrigger id="keyboar-layout">
                                <SelectValue placeholder="Select a keyboard layout" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="qwerty" >QWERTY</SelectItem>
                                <SelectItem value="azerty">AZERTY</SelectItem>
                                <SelectItem value="dvorak">Dvorak</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="font-size" >Font Size: {fontSize}</Label>
                        <Slider id="font-size"
                            min={12}
                            max={24}
                            step={1}
                            value={[fontSize]}
                            onValueChange={(value) => setFontSize(value[0])}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={() => saveChanges()}  >
                        {isPending ? <LoadingSpinner /> : "Save Changes"}
                    </Button>
                </CardFooter>
            </Card>
        </TabsContent>
    )
}

export default TypePreferencesTab