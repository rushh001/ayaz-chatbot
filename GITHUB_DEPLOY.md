# Quick Start: Deploy to GitHub & Host Your App

Follow these steps to get your AI Voice Agent on GitHub and deployed:

## ⚠️ Important: Why GitHub Pages Won't Work

**GitHub Pages CANNOT host this app** because:
- ❌ GitHub Pages only serves static files (HTML/CSS/JS)
- ❌ Your app needs server-side API routes (`/api/chat`, `/api/transcribe`)
- ❌ Groq API key must stay secret on the server (can't be in browser code)

**Solution**: Use Vercel, Netlify, or Railway (all free!) - instructions below ⬇️

## Step 1: Create GitHub Repository

1. Go to https://github.com/new
2. Repository name: `ai-voice-agent` (or your preferred name)
3. Description: "AI Voice Agent with Groq Whisper and Llama integration"
4. Make it **Public** (or Private if you prefer)
5. **DO NOT** initialize with README, .gitignore, or license
6. Click "Create repository"

## Step 2: Push Your Code

Open PowerShell and run these commands:

```powershell
# Navigate to your project
cd c:\Users\mohdz\Downloads\aws-cloud\ai-voice-agent

# Add your GitHub repository as remote (replace with your info)
git remote add origin https://github.com/YOUR_USERNAME/ai-voice-agent.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

**Replace `YOUR_USERNAME` with your actual GitHub username!**

## Step 3: Get Groq API Key

1. Visit: https://console.groq.com
2. Sign up or log in
3. Go to "API Keys" in the dashboard
4. Click "Create API Key"
5. Copy and save the key securely

## Step 4: Choose Your Deployment Platform

### Option A: Vercel (⭐ RECOMMENDED - Easiest & Best for Next.js)

**Why Vercel?**
- Made by Next.js creators
- Zero configuration needed
- Automatic HTTPS
- Free tier: 100GB bandwidth, unlimited projects
- Auto-deploys on git push

**Deploy Steps:**
1. Visit: https://vercel.com/signup
2. Sign up with GitHub
3. Click "Add New..." → "Project"
4. Import your `ai-voice-agent` repository
5. In the "Environment Variables" section:
   - Name: `GROQ_API_KEY`
   - Value: `[paste your Groq API key here]`
6. Click "Deploy"
7. Wait 2-3 minutes
8. Your app is live! 🎉

### Option B: Netlify

**Deploy Steps:**
1. Visit: https://app.netlify.com
2. Sign up with GitHub
3. Click "Add new site" → "Import an existing project"
4. Choose GitHub and select your repository
5. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
6. Add environment variable:
   - Key: `GROQ_API_KEY`
   - Value: `[your Groq API key]`
7. Click "Deploy site"

### Option C: Railway

**Deploy Steps:**
1. Visit: https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your `ai-voice-agent` repository
5. Add environment variable:
   - `GROQ_API_KEY` = `[your Groq API key]`
6. Railway auto-detects Next.js and deploys

### ❌ NOT Supported: GitHub Pages, Surge, etc.

These platforms only support static sites and **will not work** with this app.

## Step 5: Test Your App

1. Click the deployment URL from Vercel
2. Allow microphone access when prompted
3. Try typing a message first
4. Then try the voice recording feature

## Updating Your App

After making changes:

```powershell
cd c:\Users\mohdz\Downloads\aws-cloud\ai-voice-agent
git add .
git commit -m "Description of your changes"
git push
```

Vercel will automatically redeploy!

## Common Issues

### "Permission denied" when pushing to GitHub
- Make sure you're authenticated with GitHub
- You may need to use a Personal Access Token instead of password
- See: https://docs.github.com/en/authentication

### "Failed to compile" errors
- Make sure you added the GROQ_API_KEY environment variable
- Check that your .env.local is NOT committed (it's in .gitignore)

### Microphone not working
- Make sure you're using HTTPS (Vercel provides this automatically)
- Grant microphone permissions in your browser

## Need Help?

- Read the full DEPLOYMENT.md for more options
- Check the README.md for project details
- Create an issue on GitHub if you encounter problems

Happy deploying! 🚀
