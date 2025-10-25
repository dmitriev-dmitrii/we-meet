#include .env

up:
	@docker network create we-meet-network 2>/dev/null || true
	@docker compose --env-file ./.env up -d --build

down:
	@docker compose down || true

clean:
	@docker compose  down -v --rmi all || true

clean-dist:
	@rm -f -r dist
