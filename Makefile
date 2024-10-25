git-clone-submodules:
	echo 'epta'
	
build-app:

	npm ci

	cd ./we-meet-frontend/ && npm run build

	# cd ./we-meet-backend/ && npm run build

	mv --force ./we-meet-frontend/dist/*  ./we-meet-backend/public/

start-app
	cd ./we-meet-backend/ npm run start

make start: git-clone-submodules build-app start-app