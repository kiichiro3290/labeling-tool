package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kiichiro3290/labeling-tool/src/models"
	"github.com/kiichiro3290/labeling-tool/src/repositories"
)

type LabelController interface {
	GetLabels(gc *gin.Context)
}

type labelController struct {
	labelRepository repositories.LabelRepository
}

func NewLabelController() LabelController {
	labelRepository := repositories.NewLabelRepository()
	return &labelController{labelRepository}
}

func (c *labelController) GetLabels(gc *gin.Context) {
	labels, err := c.labelRepository.GetLabels()
	if err != nil {
		err := models.NewError(http.StatusBadRequest)
		gc.JSON(err.Code, err)
	}

	gc.JSON(http.StatusOK, labels)
}
