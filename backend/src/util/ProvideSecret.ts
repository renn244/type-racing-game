import * as crypto from 'crypto'

export const provideSecret = async (
    length: number=16
) => {
    length = length / 2
    const secret = crypto.randomBytes(length).toString('hex')

    return secret
}