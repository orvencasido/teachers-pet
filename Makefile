.PHONY: setup verify test lint db-start db-stop db-reset db-status db-diff clean

# Master Quality Gate
verify: lint test

lint:
	@echo "Checking formatting and linting..."
	@which pnpm > /dev/null 2>&1 && pnpm lint || npm run lint --if-present

test:
	@echo "Running test suite..."
	@which pnpm > /dev/null 2>&1 && pnpm test || npm test --if-present

# Supabase Local Engine Controls
db-start:
	npx supabase start

db-stop:
	npx supabase stop

db-status:
	npx supabase status

db-reset:
	npx supabase db reset

db-diff:
	@read -p "Migration name: " name; npx supabase db diff -f $$name

clean:
	rm -rf dist build .cache node_modules/.cache
