

build-app:
	cd ./frontend/ && npm ci && npm run build
	cp -R ./frontend/dist/* ./backend/public/
	cd ./backend/ && npm ci

start-app:
	cd ./backend && npm run start

deploy: build-app start-app
