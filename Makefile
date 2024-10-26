

build-app:
	cd ./frontend/ && npm i
	cd ./frontend/ && npm run build
	cp -R ./frontend/dist/* ./backend/public/
	cd ./backend/ && npm i

start-app:
	cd ./backend && npm run start

deploy: build-app start-app
