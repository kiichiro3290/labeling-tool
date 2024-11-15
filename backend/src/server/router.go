package server

import (
	"github.com/gin-gonic/gin"
	"github.com/kiichiro3290/labeling-tool/src/controllers"
)

func a(c *gin.Context) {
	c.JSON(200, gin.H{
		"message": "Health check OK",
	})
}

func NewRouter() (*gin.Engine, error) {
	engine := gin.Default()

	engine.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{
			"message": "Health check OK",
		})
	})

	userController := controllers.NewUserController()
	engine.GET("/user", userController.GetUsers)

	labelController := controllers.NewLabelController()
	engine.GET("/label", labelController.GetLabels)

	experimentController := controllers.NewExperimentController()
	engine.GET("/experiment", experimentController.GetExperiments)

	stampController := controllers.NewStampController()
	engine.GET("/stamp/:docId", stampController.GetStamps)

	return engine, nil
}
