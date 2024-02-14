export type Submission = {
    userId: string
    date: string
    info: SubmissionInfo
}

export type SubmissionInfo = {
    title: string
    description: string
    challenge?: string
    platform: string
}