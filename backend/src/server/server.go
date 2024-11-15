package server

import (
	"log"
	"time"
)

func Init() error {
	jst := time.FixedZone("Asia/Tokyo", 9*60*60)
	time.Local = jst

	r, err := NewRouter()
	if err != nil {
		return err
	}

	PORT := ":8080"
	if err := r.Run(PORT); err != nil {
		log.Fatal(err)
		return err
	}

	return nil
}
