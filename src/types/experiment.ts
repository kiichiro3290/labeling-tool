type Experiment = {
    userId: string
    name: string
    createdAt: Date
    conditions: string[]
}

type Stamp = {
    userId: string
    unixTime: number
    timestamp: Date
    experimentId: string
    condition: string
    state: string
}