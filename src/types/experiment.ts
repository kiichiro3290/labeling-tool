type Experiment = {
    name: string
    createdAt: Date
    conditions: string[]
}

type Stamp = {
    timestamp: Date
    experimentId: string
    condition: string
}