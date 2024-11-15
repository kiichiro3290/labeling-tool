package repositories

import (
	"context"
	"log"

	"github.com/kiichiro3290/labeling-tool/src/config"
	"github.com/kiichiro3290/labeling-tool/src/models"
	"github.com/kiichiro3290/labeling-tool/src/utils"
)

type UserRepository interface {
	GetUsers() ([]*models.User, error)
}

type userRepository struct {
}

func NewUserRepository() UserRepository {
	return &userRepository{}
}

func (c *userRepository) GetUsers() ([]*models.User, error) {
	ctx := context.Background()
	client, err := config.InitFirestore(ctx)
	defer client.Close()
	if err != nil {
		return nil, err
	}

	docs, err := client.Collection("users").Documents(ctx).GetAll()
	if err != nil {
		log.Printf("error: %v", err)
		return nil, err
	}

	users := make([]*models.User, 0)
	for _, doc := range docs {
		u := new(models.User)
		utils.Map2Struct(doc.Data(), &u)
		u.UserId = doc.Ref.ID
		users = append(users, u)
	}

	return users, err
}
