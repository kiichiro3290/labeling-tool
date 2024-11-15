package repositories

import (
	"context"
	"log"

	"github.com/kiichiro3290/labeling-tool/src/config"
	"github.com/kiichiro3290/labeling-tool/src/models"
	"github.com/kiichiro3290/labeling-tool/src/utils"
)

type LabelRepository interface {
	GetLabels() ([]*models.Label, error)
}

type labelRepository struct {
}

func NewLabelRepository() LabelRepository {
	return &labelRepository{}
}

func (c *labelRepository) GetLabels() ([]*models.Label, error) {
	ctx := context.Background()
	client, err := config.InitFirestore(ctx)
	defer client.Close()
	if err != nil {
		return nil, err
	}

	docs, err := client.Collection("labels").Documents(ctx).GetAll()
	if err != nil {
		log.Printf("error: %v", err)
		return nil, err
	}

	labels := make([]*models.Label, 0)
	for _, doc := range docs {
		l := new(models.Label)
		utils.Map2Struct(doc.Data(), &l)
		l.LabelId = doc.Ref.ID
		labels = append(labels, l)
	}

	return labels, err
}
