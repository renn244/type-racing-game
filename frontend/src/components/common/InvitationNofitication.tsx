import { useEffect, useState } from 'react'
import { useSocketContext } from '@/Context/SocketContext'
import { InvitationNotification } from '@/types/Invitation.type'
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Profile from './Profile'
import { useMutation } from '@tanstack/react-query'
import axiosFetch from '@/lib/axiosFetch'
import toast from 'react-hot-toast'
import LoadingSpinner from './LoadingSpinner'
import notificationSound from '@/lib/notificationSound'


const InvitationNofitication = () => {
    const [invitation, setInvitation] = useState<InvitationNotification | undefined>(undefined)
    const { socket } = useSocketContext()
  
    useEffect(() => {
      if(!socket) return;
  
      socket.on('invitation', async (data: InvitationNotification) => {
        setInvitation(data)
        notificationSound()
      })
  
  
      return () => {
        socket.off('invitation')
      }
    }, [socket])

    const { mutate: AcceptInvite, isPending: AcceptInviteLoading } = useMutation({
        mutationKey: ['acceptInvitation'],
        mutationFn: async () => {
            if(!invitation) return;
            const response = await axiosFetch.post('/multiplayer/acceptInvite', {
                inviteId: invitation.id
            })

            if(response.status >= 400) {
                toast.error(response.data.message)
            }
            // redirect to the roomId
            window.location.assign(`/challenge?challengeId=${response.data.challengeId}&mode=multiplayer&roomId=${response.data.roomId}`)
                
            return response.data
        }
    }) 

    const { mutate: RejectInvite, isPending: RejectInviteLoading } = useMutation({
        mutationKey: ['rejectInvitation'],
        mutationFn: async () => {
            if(!invitation) return;
            const response = await axiosFetch.post('/multiplayer/rejectInvite', {
                inviteId: invitation.id
            })

            if(response.status >= 400) {
                toast.error(response.data.message)
            }
            setInvitation(undefined)
            return response.data
        }
    })
    
    if(!invitation) return undefined;
    // make a profile clickable??
    return (  
      <div className='fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-full  flex justify-center items-center z-[60]'>
        <div className='absolute w-full h-screen bg-black opacity-40 z-[60]'></div>
        <Card className='max-w-[460px] min-h-[142px] w-full z-[70]'>
          <CardHeader>
            <CardTitle>
              Invitation!
            </CardTitle>
            <CardDescription className='flex gap-3 text-base items-end '>
              <Profile src={invitation.user.profile || ''} />
              <span className='my-2'>
                {invitation.user.username} has invited you to join a room!
              </span>
            </CardDescription>
          </CardHeader>
          <CardFooter className='gap-3'>
                <Button disabled={AcceptInviteLoading} onClick={() => AcceptInvite()}>
                    {AcceptInviteLoading ? <LoadingSpinner /> : 'Accept'}
                </Button>
              <Button disabled={RejectInviteLoading} onClick={() => RejectInvite()} variant={'outline'}>
                    {RejectInviteLoading ? <LoadingSpinner /> : 'Reject'}
              </Button>
          </CardFooter>
        </Card>
      </div>
    )
}

export default InvitationNofitication