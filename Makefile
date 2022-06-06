NAME=simiacode/video-hoarder
VERSION=dev
build:
	docker build -t $(NAME):$(VERSION) .

push:
	docker push $(NAME):$(VERSION)
