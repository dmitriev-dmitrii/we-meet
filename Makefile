clone-modules:
	rm -rf we-meet-backend
	rm -rf we-meet-frontend
	git clone https://github.com/dmitriev-dmitrii/we-meet-backend
	git clone https://github.com/dmitriev-dmitrii/we-meet-frontend

build-app:
	rm -rf  app
	mkdir  app
	cd ./we-meet-frontend/ && npm i && npm run build
	cp -R ./we-meet-backend/* ./app
	cp -R ./we-meet-frontend/dist/* ./app/public/

start-app:
	cd ./app/ && npm i && npm run start

make start: clone-modules build-app start-app
