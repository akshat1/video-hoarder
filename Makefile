# https://hackernoon.com/a-better-way-to-develop-node-js-with-docker-cd29d3a0093
install:
	docker-compose -f docker-compose.builder.yml run --rm install_deps
dev:
	docker-compose up --remove-orphans
# run:
# 	docker-compose up --remove-orphans
stop:
	docker-compose down --remove-orphans
clean:
	docker-compose down -v --remove-orphans
	docker-compose -f docker-compose.dev.yml down -v --remove-orphans
