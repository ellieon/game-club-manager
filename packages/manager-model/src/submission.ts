export type Submission = {
    id: string
    pending: boolean
    date: string
    info: SubmissionInfo
    gameid?: string
}

export type SubmissionInfo = {
    title: string
    description: string
    challenge?: string
    platform: string
}