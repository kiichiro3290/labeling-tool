package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kiichiro3290/labeling-tool/src/models"
	"github.com/kiichiro3290/labeling-tool/src/repositories"
)

type StampController interface {
	GetStamps(gc *gin.Context)
}

type stampController struct {
	stampRepository repositories.StampRepository
}

func NewStampController() StampController {
	stampRepository := repositories.NewStampRepository()
	return &stampController{stampRepository}
}

func (c *stampController) GetStamps(gc *gin.Context) {
	docId := gc.Param("docId")
	Stamps, err := c.stampRepository.GetStamps(docId)
	if err != nil {
		err := models.NewError(http.StatusBadRequest)
		gc.JSON(err.Code, err)
	}

	gc.JSON(http.StatusOK, Stamps)
}
