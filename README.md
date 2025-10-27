Файл tz.md документ техническое задание описиывающее концепцию проекта
файл task.md документ с задачами для реализации


## 🤖 Automation Features

This project now includes automatic PR creation for Cursor IDE:

### ✅ Auto PR Creation
- Cursor configuration for seamless PR creation
- Manual scripts for PR creation
- GitHub Actions for automated workflows
- Auto-merge functionality when checks pass

### 🛠 How to Use
1. Create feature branch: `git checkout -b feature/your-task`
2. Make changes in Cursor
3. Run: `./scripts/create-pr.sh "Task Name" "Description"`
4. PR is created automatically and ready for review

### 📋 Available Scripts
- `pnpm create-pr" - Create PR manually
- `pnpm task:complete" - Full workflow (lint + build + PR)
- `pnpm pr:auto" - Quick PR creation

*Last updated: Mon Oct 27 03:45:08 PM UTC 2025*
