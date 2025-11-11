.PHONY: help install build test lint format clean dev deploy docker monitoring

# Default target
.DEFAULT_GOAL := help

# Colors for output
RED := \033[0;31m
GREEN := \033[0;32m
YELLOW := \033[1;33m
NC := \033[0m # No Color

help: ## Show this help message
	@echo "$(GREEN)USDX Wexel Platform - Makefile Commands$(NC)"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'

# Installation
install: ## Install all dependencies
	@echo "$(GREEN)Installing dependencies...$(NC)"
	pnpm install

install-ci: ## Install dependencies for CI
	@echo "$(GREEN)Installing CI dependencies...$(NC)"
	pnpm install --frozen-lockfile

# Development
dev: ## Start development servers
	@echo "$(GREEN)Starting development servers...$(NC)"
	pnpm --parallel -r dev

dev-webapp: ## Start webapp development server
	@echo "$(GREEN)Starting webapp...$(NC)"
	pnpm --filter webapp dev

dev-indexer: ## Start indexer development server
	@echo "$(GREEN)Starting indexer...$(NC)"
	pnpm --filter indexer dev

# Building
build: ## Build all applications
	@echo "$(GREEN)Building all applications...$(NC)"
	pnpm --parallel -r build

build-webapp: ## Build webapp
	@echo "$(GREEN)Building webapp...$(NC)"
	NODE_ENV=production pnpm --filter webapp build

build-indexer: ## Build indexer
	@echo "$(GREEN)Building indexer...$(NC)"
	pnpm --filter indexer build

# Testing
test: ## Run all tests
	@echo "$(GREEN)Running tests...$(NC)"
	pnpm --parallel -r test

test-unit: ## Run unit tests
	@echo "$(GREEN)Running unit tests...$(NC)"
	pnpm --filter indexer test

test-e2e: ## Run E2E tests
	@echo "$(GREEN)Running E2E tests...$(NC)"
	pnpm --filter webapp test:e2e

test-coverage: ## Run tests with coverage
	@echo "$(GREEN)Running tests with coverage...$(NC)"
	pnpm --filter indexer test:cov

# Code Quality
lint: ## Run linters
	@echo "$(GREEN)Running linters...$(NC)"
	pnpm --parallel -r lint

lint-fix: ## Run linters and fix issues
	@echo "$(GREEN)Running linters with --fix...$(NC)"
	pnpm --parallel -r lint:fix

format: ## Format code with Prettier
	@echo "$(GREEN)Formatting code...$(NC)"
	pnpm --parallel -r format

typecheck: ## Run TypeScript type checking
	@echo "$(GREEN)Running type check...$(NC)"
	pnpm --parallel -r typecheck

# Database
db-generate: ## Generate Prisma client
	@echo "$(GREEN)Generating Prisma client...$(NC)"
	pnpm --filter indexer prisma generate

db-migrate: ## Run database migrations
	@echo "$(GREEN)Running database migrations...$(NC)"
	pnpm --filter indexer prisma migrate deploy

db-seed: ## Seed database
	@echo "$(GREEN)Seeding database...$(NC)"
	pnpm --filter indexer prisma db seed

db-studio: ## Open Prisma Studio
	@echo "$(GREEN)Opening Prisma Studio...$(NC)"
	pnpm --filter indexer prisma studio

db-reset: ## Reset database (WARNING: destructive)
	@echo "$(RED)Resetting database...$(NC)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		pnpm --filter indexer prisma migrate reset; \
	fi

# Docker
docker-build: ## Build Docker images
	@echo "$(GREEN)Building Docker images...$(NC)"
	docker-compose -f infra/production/docker-compose.backend.yml build

docker-up: ## Start Docker containers
	@echo "$(GREEN)Starting Docker containers...$(NC)"
	bash scripts/start-docker.sh

docker-down: ## Stop Docker containers
	@echo "$(GREEN)Stopping Docker containers...$(NC)"
	docker-compose -f infra/production/docker-compose.backend.yml down

docker-logs: ## View Docker logs
	@echo "$(GREEN)Viewing Docker logs...$(NC)"
	docker-compose -f infra/production/docker-compose.backend.yml logs -f

docker-clean: ## Remove Docker containers and volumes
	@echo "$(RED)Cleaning Docker containers and volumes...$(NC)"
	docker-compose -f infra/production/docker-compose.backend.yml down -v

# Monitoring
monitoring-up: ## Start monitoring stack
	@echo "$(GREEN)Starting monitoring stack...$(NC)"
	bash scripts/start-monitoring.sh

monitoring-down: ## Stop monitoring stack
	@echo "$(GREEN)Stopping monitoring stack...$(NC)"
	docker-compose -f infra/monitoring/docker-compose.monitoring.yml down

monitoring-logs: ## View monitoring logs
	@echo "$(GREEN)Viewing monitoring logs...$(NC)"
	docker-compose -f infra/monitoring/docker-compose.monitoring.yml logs -f

# Deployment
deploy-contracts-solana: ## Deploy Solana contracts
	@echo "$(GREEN)Deploying Solana contracts...$(NC)"
	bash scripts/deploy-solana-contracts.sh

deploy-contracts-tron: ## Deploy Tron contracts
	@echo "$(GREEN)Deploying Tron contracts...$(NC)"
	bash scripts/deploy-tron-contracts.sh

deploy-production: ## Deploy to production
	@echo "$(GREEN)Deploying to production...$(NC)"
	@echo "$(YELLOW)This will:$(NC)"
	@echo "  1. Run tests"
	@echo "  2. Build applications"
	@echo "  3. Deploy via CI/CD"
	@read -p "Continue? [y/N] " -n 1 -r; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		make test && make build; \
		echo "$(GREEN)Build successful. Push to main branch to deploy.$(NC)"; \
	fi

# Git operations
git-commit: ## Create commit with conventional format
	@echo "$(GREEN)Creating commit...$(NC)"
	@git add .
	@git status
	@read -p "Commit message: " msg; \
	git commit -m "$$msg

🤖 Generated with Claude Code

Co-Authored-By: Claude <noreply@anthropic.com>"

# Cleanup
clean: ## Clean build artifacts and dependencies
	@echo "$(RED)Cleaning build artifacts...$(NC)"
	rm -rf apps/*/dist
	rm -rf apps/*/build
	rm -rf apps/*/.next
	rm -rf node_modules
	rm -rf apps/*/node_modules
	@echo "$(GREEN)Clean complete$(NC)"

clean-cache: ## Clean pnpm cache
	@echo "$(RED)Cleaning pnpm cache...$(NC)"
	pnpm store prune
	@echo "$(GREEN)Cache cleaned$(NC)"

# Full workflow
ci: install-ci lint typecheck test build ## Run full CI pipeline

setup: install db-generate db-migrate docker-up ## Complete project setup

validate: lint typecheck test ## Validate code quality

# Development helpers
logs: ## View application logs
	@echo "$(GREEN)Viewing logs...$(NC)"
	tail -f apps/indexer/logs/*.log

status: ## Show project status
	@echo "$(GREEN)Project Status:$(NC)"
	@echo ""
	@echo "Git:"
	@git status --short
	@echo ""
	@echo "Docker:"
	@docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
	@echo ""
	@echo "Node:"
	@node --version
	@echo "pnpm: $$(pnpm --version)"

# Utilities
check-env: ## Check environment variables
	@echo "$(GREEN)Checking environment variables...$(NC)"
	@test -f apps/indexer/.env && echo "✓ Indexer .env exists" || echo "✗ Indexer .env missing"
	@test -f apps/webapp/.env.local && echo "✓ Webapp .env.local exists" || echo "✗ Webapp .env.local missing"

ports: ## Check if required ports are available
	@echo "$(GREEN)Checking ports...$(NC)"
	@lsof -ti:3000 && echo "$(RED)✗ Port 3000 in use$(NC)" || echo "$(GREEN)✓ Port 3000 available$(NC)"
	@lsof -ti:3001 && echo "$(RED)✗ Port 3001 in use$(NC)" || echo "$(GREEN)✓ Port 3001 available$(NC)"
	@lsof -ti:5432 && echo "$(RED)✗ Port 5432 in use$(NC)" || echo "$(GREEN)✓ Port 5432 available$(NC)"
	@lsof -ti:6379 && echo "$(RED)✗ Port 6379 in use$(NC)" || echo "$(GREEN)✓ Port 6379 available$(NC)"
