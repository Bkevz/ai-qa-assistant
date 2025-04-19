# GitHub Deployment Guide

## Sensitive Data Protection

The following files containing sensitive data are already configured to be ignored by Git:

- `backend/.env` - Contains your OpenAI API key
- `frontend/.env` - Contains environment variables for the frontend

## Deploying to GitHub

Follow these steps to deploy your project to GitHub:

1. **Create a new GitHub repository**
   - Go to [GitHub](https://github.com) and sign in
   - Click the '+' icon in the top right and select 'New repository'
   - Name your repository (e.g., 'ai-qa-assistant')
   - Choose public or private visibility
   - Do not initialize with README, .gitignore, or license (we already have these)
   - Click 'Create repository'

2. **Link your local repository to GitHub**
   ```bash
   # Replace the URL with your repository URL
   git remote add origin https://github.com/yourusername/ai-qa-assistant.git
   ```

3. **Commit your changes**
   ```bash
   git commit -m "Initial commit"
   ```

4. **Push to GitHub**
   ```bash
   git push -u origin main
   ```

## Deployment Options

For deploying the application to production:

### Frontend (Next.js)
- **Vercel**: The easiest option for Next.js apps
  - Connect your GitHub repository
  - Set environment variables in the Vercel dashboard
  - Vercel will automatically build and deploy your app

### Backend (FastAPI)
- **Render**: Free tier available
  - Create a new Web Service
  - Connect your GitHub repository
  - Set the build command: `pip install -r requirements.txt`
  - Set the start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
  - Add your environment variables (OPENAI_API_KEY)

## Important Notes

1. **Never commit sensitive data**: Double-check that .env files are not being committed
2. **Environment variables**: Set these in your deployment platform, not in your code
3. **CORS settings**: Update the CORS settings in `backend/app/main.py` to allow requests from your deployed frontend URL

## Checking for Sensitive Data

Before pushing to GitHub, you can run this command to see what will be committed:

```bash
./check-gitignore.ps1
```

This will show you which files will be tracked by Git and which will be ignored.
