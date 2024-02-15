export type Submission = {
    id?: string
    user: string
    pending: boolean
    date: string
    info: SubmissionInfo
    gameid?: string
    guild: string
}

export type SubmissionInfo = {
    title: string
    description: string
    challenge?: string
    platform: string
}