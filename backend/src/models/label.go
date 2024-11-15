package models

import "time"

type Label struct {
	LabelId   string    `json:"labelId"`
	UserId    string    `json:"userId"`
	CreatedAt time.Time `json:"createdAt"`
	Type      string    `json:"type"`
	Name      string    `json:"name"`
}
