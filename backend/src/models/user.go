package models

import "time"

type User struct {
	UserId    string    `json:"userId"`
	CreatedAt time.Time `json:"createdAt"`
}
