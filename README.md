markdown
Copy
# Task Manager for Microsoft Teams

A modern web application for managers to assign and track weekly tasks using Microsoft Planner as backend via Microsoft Graph API.

![Dashboard Preview](screenshots/dashboard.png)

## Features

- 🔐 Microsoft OAuth2 Authentication
- 📅 Recurring weekly task creation
- 📊 Interactive progress dashboard
- 👥 Team member assignment tracking
- 🎨 Modern UI with animations
- 🔄 Real-time sync with Microsoft Planner

## Prerequisites

- Node.js v18+
- Microsoft 365 Organizational Account
- Azure Portal Subscription

## Getting Started

### 1. Azure Application Registration

1. Go to [Azure Portal](https://portal.azure.com)
2. Navigate to **Azure Active Directory** > **App Registrations** > **New Registration**
   - Name: `Task Manager`
   - Supported Account Types: **Accounts in this organizational directory only**
   - Redirect URI: `http://localhost:3000` (development)
3. After creation, note:
   - **Application (client) ID**
   - **Directory (tenant) ID**
4. Under **API Permissions**, add:
   - `Tasks.ReadWrite`
   - `Group.ReadWrite.All` 
   - `User.Read`
5. **Grant Admin Consent** for your organization

### 2. Local Setup

```bash
# Clone repository
git clone https://github.com/yourusername/task-manager.git
cd task-manager

# Install dependencies
npm install

# Create environment file
echo "REACT_APP_CLIENT_ID=your_client_id
REACT_APP_TENANT_ID=your_tenant_id
PUBLIC_URL=http://localhost:3000" > .env
3. Running the Application
bash
Copy
# Development mode
npm start

# Production build
npm run build && npm run serve
Deployment
Create new Web Service on Render.com

Environment Variables:

REACT_APP_CLIENT_ID = Your Azure Client ID

REACT_APP_TENANT_ID = Your Azure Tenant ID

PUBLIC_URL = Your Render URL

Build Command: npm install && npm run build

Start Command: serve -s build -l $PORT --single

Application Structure
Copy
task-manager/
├── src/
│   ├── components/      # React components
│   ├── services/        # Microsoft Graph services
│   ├── auth/            # Authentication configuration
│   └── styles.css       # Main styling
├── public/              # Static assets
└── .env                 # Environment configuration
Usage Guide
Login
Click "Sign In with Microsoft" using your organizational account

Select Plan
Choose an existing Microsoft Planner plan from your Teams

Dashboard

View completion progress

Track ongoing tasks

Manage assignments

Create Tasks

Set weekly recurrence

Assign to team members

Add priority labels

Troubleshooting
Common Issues:

🔄 Page Refresh Errors
Ensure Render.com has proper rewrite rules in render.yaml

🔒 Authentication Failures
Verify Azure redirect URIs match exactly (including trailing slashes)

📊 Missing Planner Data
Check user has access to Planner plans in Microsoft Teams

💾 Environment Variables
Confirm .env file exists with correct Azure credentials

Contributing
Fork the repository

Create feature branch: git checkout -b feature/new-feature

Commit changes: git commit -m 'Add new feature'

Push to branch: git push origin feature/new-feature

Submit pull request

License
MIT License - see LICENSE for details

Note: This application requires Microsoft 365 organizational account and Azure AD admin consent for initial setup.

Copy

Include these screenshots in a `/screenshots` directory:
1. login.png - Login screen
2. plans.png - Plan selection
3. dashboard.png - Main dashboard
4. create-task.png - Task creation form

This README provides complete setup instructions while maintaining security best practices and clear navigation through the application workflow.
