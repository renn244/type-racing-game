import { User } from "./User.type";

const statusEnum = {
    pending: 'pending',
    accepted: 'accepted',
    rejected: 'rejected'
} as const;
type invitationStatus = typeof statusEnum[keyof typeof statusEnum];

export type Invitation = {
    id: string,
    roomId: string,
    senderId: string,
    receiverId: string,

    status: invitationStatus,
    createdAt: string;
}

export type InvitationNotification = {
    user: Partial<User>,
} & Invitation