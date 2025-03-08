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
   - Redirect URI for production in the image given below
   - change the URL according to your deployment URL mine was -> https://task-manager-teams-site.onrender.com
   - ![image](https://github.com/user-attachments/assets/eb1e32f9-3b70-4088-bbe3-ca6d0b5c48fe)

3. After creation, note:
   - **Application (client) ID**
   - **Directory (tenant) ID**
4. Under **API Permissions**, add:
   - `Tasks.ReadWrite`
   - `Group.ReadWrite.All` 
   - `User.Read`
   - `User.Read.All`
5. **Grant Admin Consent** for your organization

### 2. Local Setup

```bash
# Clone repository
git clone https://github.com/sahil1962/task-manager.git
cd task-manager

# Create environment file
REACT_APP_CLIENT_ID= <your client ID>
REACT_APP_TENANT_ID= <your tenant ID>
PUBLIC_URL="/"

# Install dependencies
npm install
```

### 3. Running the Application
```bash
# Development mode
npm install
npm start
```

### 4. Application Structure
```bash
task-manager/
├── src/
│   ├── components/      # React components
│   ├── services/        # Microsoft Graph services
│   ├── auth/            # Authentication configuration
│   └── styles.css       # Main styling
├── public/              # Static assets
└── .env                 # Environment configuration
```

### Usage Guide
1. Login
   - Click "Sign In with Microsoft" using your organizational account
2. Select Plan
   - Choose an existing Microsoft Planner plan from your Teams
3. Dashboard
   - View completion progress
   - Track ongoing tasks
   - Manage assignments
4. Create Tasks
   - Set weekly recurrence
   - Assign to team members
   - Add priority labels


Include these screenshots in a `/screenshots` directory:
## 1. Login screen![image](https://github.com/user-attachments/assets/d1342f73-d8f9-46d7-b899-d7f1b297f070)
## 2. Plan selection ![image](https://github.com/user-attachments/assets/3712b2e2-3e73-4c01-bd93-d905b7f2883b)
## 3. Main dashboard ![image](https://github.com/user-attachments/assets/be3f3a3a-711c-405e-a35c-5184adbb6e79)
## 4. Task creation form ![image](https://github.com/user-attachments/assets/2c1935a3-3c61-4f17-958b-36b093a82a7d)
