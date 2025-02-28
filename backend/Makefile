.PHONY: dev
dev:
	docker-compose up --build

.PHONY: build
build:
	docker-compose -f docker-compose.gcp.yml build

.PHONY: push
push:
	docker push asia-northeast1-docker.pkg.dev/labeling-tool-api/labeling-tool-api/backend-api
