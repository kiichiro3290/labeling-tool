package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kiichiro3290/labeling-tool/src/models"
	"github.com/kiichiro3290/labeling-tool/src/repositories"
)

type ExperimentController interface {
	GetExperiments(gc *gin.Context)
}

type experimentController struct {
	experimentRepository repositories.ExperimentRepository
}

func NewExperimentController() ExperimentController {
	experimentRepository := repositories.NewExperimentRepository()
	return &experimentController{experimentRepository}
}

func (c *experimentController) GetExperiments(gc *gin.Context) {
	experiments, err := c.experimentRepository.GetExperiments()
	if err != nil {
		err := models.NewError(http.StatusBadRequest)
		gc.JSON(err.Code, err)
	}

	gc.JSON(http.StatusOK, experiments)
}
