# make is a program which builds and runs other programs.
#
# Primarily intended to help build C/C++ programs, it was adopted
# by backend developers as an easy an portable way to share common commands.
# Usually no need to learn this syntax, you write it once and then use it.

#
# IMPORTANT: the format uses TABS "\t" to indent commands
#

init:
	- cp -n .env.example .env
	docker run --rm \
		-u "$$(id -u):$$(id -g)" \
		-v "$$(pwd):/var/www/html" \
		-w /var/www/html \
		laravelsail/php83-composer:latest \
		composer install --ignore-platform-reqs
	./vendor/bin/sail build
	docker run --rm \
		-v "$$(pwd)/frontend/node_modules:/app/node_modules" \
		-w /app \
		levelup-2024-frontend-sail \
		pnpm install
	./vendor/bin/sail up -d
	./vendor/bin/sail artisan key:generate
	- ./vendor/bin/sail artisan storage:link

rebuild-frontend:
	./vendor/bin/sail down
	./vendor/bin/sail build frontend
	docker run --rm \
		-v "$$(pwd)/frontend/node_modules:/app/node_modules" \
		-w /app \
		levelup-2024-frontend-sail \
		pnpm install
	./vendor/bin/sail up -d frontend

run: | init
	./vendor/bin/sail up -d

migrate:
	./vendor/bin/sail artisan migrate

migrate-fresh:
	./vendor/bin/sail artisan migrate:fresh

migrate-seed:
	./vendor/bin/sail artisan migrate:fresh --seed

backend-test:
	./vendor/bin/sail artisan test

tinker:
	./vendor/bin/sail artisan tinker
