type Experiment = {
    userId: string
    name: string
    createdAt: Date
    conditions: string[]
}

type Stamp = {
    userId: string
    timestamp: Date
    experimentId: string
    condition: string
}