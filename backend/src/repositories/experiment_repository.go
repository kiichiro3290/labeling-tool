package repositories

import (
	"context"
	"log"

	"github.com/kiichiro3290/labeling-tool/src/config"
	"github.com/kiichiro3290/labeling-tool/src/models"
	"github.com/kiichiro3290/labeling-tool/src/utils"
)

type ExperimentRepository interface {
	GetExperiments() ([]*models.Experiment, error)
}

type experimentRepository struct {
}

func NewExperimentRepository() ExperimentRepository {
	return &experimentRepository{}
}

func (c *experimentRepository) GetExperiments() ([]*models.Experiment, error) {
	ctx := context.Background()
	client, err := config.InitFirestore(ctx)
	defer client.Close()
	if err != nil {
		return nil, err
	}

	docs, err := client.Collection("experiments").Documents(ctx).GetAll()
	if err != nil {
		log.Printf("error: %v", err)
		return nil, err
	}

	experiments := make([]*models.Experiment, 0)
	for _, doc := range docs {
		e := new(models.Experiment)
		utils.Map2Struct(doc.Data(), &e)
		e.ExperimentId = doc.Ref.ID
		experiments = append(experiments, e)
	}

	return experiments, err
}
