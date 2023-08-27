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

export type PublishLog = {
    text: string,
    hashtag: string,
    sessionId: string
}

export type LikeLog = {
    id: string,
    sessionId: string,
    action: "plus" | "minus"
}

export type HashtagInfo = {
    firstLog: string|null,
    lastActive: string|null,
    totalLogs: string|null,
    myLogs: string|null,
}

export type CacheType = {
    logs: ALog[]
}