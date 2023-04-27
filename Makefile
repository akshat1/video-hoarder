NAME=simiacode/video-hoarder
VERSION=dev
CONTAINER_NAME=vh_dev

build:
	docker build -t $(NAME):$(VERSION) .

clean:
	docker-compose down && docker volume rm video-hoarder_postgres-dev video-hoarder_node_modules

push:
	docker push $(NAME):$(VERSION)

dev:
	docker-compose -f docker-compose.dev.yml up -d

dev-connect:
	docker exec -it $(CONTAINER_NAME) /bin/bash

stop-dev:
	docker-compose stop
