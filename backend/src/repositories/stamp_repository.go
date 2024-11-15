package repositories

import (
	"context"
	"log"
	"time"

	"github.com/kiichiro3290/labeling-tool/src/config"
	"github.com/kiichiro3290/labeling-tool/src/models"
	"github.com/kiichiro3290/labeling-tool/src/utils"
)

type StampRepository interface {
	GetStamps(docId string) ([]*models.Stamp, error)
}

type stampRepository struct {
}

func NewStampRepository() StampRepository {
	return &stampRepository{}
}

func (c *stampRepository) GetStamps(docId string) ([]*models.Stamp, error) {
	ctx := context.Background()
	client, err := config.InitFirestore(ctx)
	defer client.Close()
	if err != nil {
		return nil, err
	}

	docs, err := client.Collection("experiments").Doc(docId).Collection("stamps").Documents(ctx).GetAll()
	if err != nil {
		log.Printf("error: %v", err)
		return nil, err
	}

	stamps := make([]*models.Stamp, 0)
	for _, doc := range docs {
		s := new(models.Stamp)
		utils.Map2Struct(doc.Data(), &s)

		// タイムゾーンの変更
		jst := time.FixedZone("Asia/Tokyo", 9*60*60)
		s.Timestamp = s.Timestamp.In(jst)
		s.TimeStr = s.Timestamp.Format("2006_0102_150405")
		s.StampId = doc.Ref.ID
		stamps = append(stamps, s)
	}

	return stamps, err
}
