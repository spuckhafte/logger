export type AuthData = {
    email: string,
    username: string,
    password: string
}

export type LoginData = {
    username?: string,
    password?: string,
    sessionId?: string
}

export type EntryData = {
    username?: string,
    email?: string,
    sessionId?: string,
    displayName?: string,
    pfp?: string
}

export type ALog = {
    id: string,

    text: string,
    liked: boolean
    totalLikes: number
    hashtag?: string

    src: string,
    displayname: string,
    username: string,

    when: string,
}