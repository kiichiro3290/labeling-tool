package controllers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/kiichiro3290/labeling-tool/src/models"
	"github.com/kiichiro3290/labeling-tool/src/repositories"
)

type UserController interface {
	GetUsers(gc *gin.Context)
}

type userController struct {
	userRepository repositories.UserRepository
}

func NewUserController() UserController {
	userRepository := repositories.NewUserRepository()
	return &userController{userRepository}
}

func (c *userController) GetUsers(gc *gin.Context) {
	users, err := c.userRepository.GetUsers()
	if err != nil {
		err := models.NewError(http.StatusBadRequest)
		gc.JSON(err.Code, err)
	}

	gc.JSON(http.StatusOK, users)
}
