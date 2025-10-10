.PHONY: install-deps install-service start stop status start-mocks

install-deps:
	@echo "Run: sudo ./scripts/install-deps-debian.sh"

install-service:
	@echo "Installing systemd service (requires sudo)"
	sudo ./scripts/install-systemd.sh

uninstall-service:
	@echo "Uninstalling systemd service (requires sudo)"
	sudo ./scripts/uninstall-systemd.sh

start:
	@echo "Start native in background"
	npm run start:background

stop:
	@echo "Stop background native (best-effort)"
	# This attempts to kill common user processes; adjust if needed
	pkill -f "node src/index.js" || true
	pkill -f vite || true

status:
	@echo "Service status (systemd)"
	systemctl status praevisio-native.service --no-pager || true

start-mocks:
	./scripts/start-mocks.sh

native: install-deps
	@echo "Setting up native dev environment..."
	npm ci
	cd server && npm ci && npx prisma generate --schema=./prisma/schema.prisma && cd ..
	./scripts/start-mocks.sh || true
	npm run start:background
