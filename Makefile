git-clone-submodules:
	@echo "Current directory: $$(pwd)"
	@echo "Git status:"
	git status
	@echo "Submodule status before update:"
	git submodule status
	@echo "Updating submodules..."
	git submodule update --init --recursive --force || (echo "Error updating submodules" && exit 1)
	@echo "Submodule status after update:"
	git submodule status

build-app:
	npm ci
	cd ./we-meet-frontend/ && npm run build
	# cd ./we-meet-backend/ && npm run build
	mv --force ./we-meet-frontend/dist/*  ./we-meet-backend/public/

start-app:
	cd ./we-meet-backend/ && npm run start

make start: git-clone-submodules build-app start-app
