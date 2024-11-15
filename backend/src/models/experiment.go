package models

import (
	"time"
)

type Experiment struct {
	ExperimentId string    `json:"experimentId"`
	Conditions   []string  `json:"conditions"`
	Name         string    `json:"name"`
	UserId       string    `json:"userId"`
	CreatedAt    time.Time `json:"createdAt"`
}

type Stamp struct {
	StampId      string    `json:"stampId"`
	Condition    string    `json:"condition"`
	ExperimentId string    `json:"experimentId"`
	Timestamp    time.Time `json:"timestamp"`
	TimeStr      string    `json:"TimeStr"`
	UserId       string    `json:"userId"`
	State        string    `json:"state"`
}
