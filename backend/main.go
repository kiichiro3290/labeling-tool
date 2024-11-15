package main

import (
	"github.com/kiichiro3290/labeling-tool/src/server"
)

func main() {
	if err := server.Init(); err != nil {
		panic(err)
	}
}
