package models

import "net/http"

type Error struct {
	Code    int    `json:"code"`
	Status  string `json:"status"`
	Message string `json:"message"`
}

func NewError(code int, message ...string) Error {
	status := http.StatusText(code)
	msg := ""
	if len(message) > 0 {
		msg = message[0]
	}
	return Error{Code: code, Status: status, Message: msg}
}
