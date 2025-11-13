# Deployment Guide

## Prerequisites

Before deploying, make sure you have:
1. A Groq API key from [console.groq.com](https://console.groq.com)
2. A GitHub account
3. An account on your chosen deployment platform (Vercel recommended)

## Step 1: Push to GitHub

1. Create a new repository on GitHub (https://github.com/new)
2. Name it `ai-voice-agent` or any name you prefer
3. Don't initialize with README (we already have one)
4. Run these commands in your terminal:

```bash
cd c:\Users\mohdz\Downloads\aws-cloud\ai-voice-agent
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name.

## Step 2: Deploy to Vercel (Recommended)

### Option A: Using Vercel Dashboard

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click "Add New Project"
3. Import your `ai-voice-agent` repository
4. Configure your project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   
5. Add Environment Variables:
   - Click "Environment Variables"
   - Add: `GROQ_API_KEY` = `your_actual_groq_api_key`
   
6. Click "Deploy"
7. Wait for deployment to complete (usually 2-3 minutes)
8. Your app will be live at `https://your-project-name.vercel.app`

### Option B: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy from your project directory:
```bash
cd c:\Users\mohdz\Downloads\aws-cloud\ai-voice-agent
vercel
```

4. Follow the prompts and add your `GROQ_API_KEY` when asked for environment variables

## Step 3: Alternative Deployment Platforms

### Deploy to Netlify

1. Go to [netlify.com](https://netlify.com) and sign in
2. Click "Add new site" → "Import an existing project"
3. Connect to GitHub and select your repository
4. Configure:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
5. Add environment variable: `GROQ_API_KEY`
6. Click "Deploy site"

### Deploy to Railway

1. Go to [railway.app](https://railway.app) and sign in
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add environment variable: `GROQ_API_KEY`
5. Railway will automatically detect Next.js and deploy

### Deploy to Render

1. Go to [render.com](https://render.com) and sign in
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Add environment variable: `GROQ_API_KEY`
6. Click "Create Web Service"

## Step 4: Get Your Groq API Key

If you don't have a Groq API key yet:

1. Visit [console.groq.com](https://console.groq.com)
2. Sign up or log in
3. Navigate to "API Keys" section
4. Click "Create API Key"
5. Copy the key (you won't be able to see it again!)
6. Add it to your deployment platform's environment variables

## Step 5: Test Your Deployment

1. Visit your deployed URL
2. Try the text chat feature first
3. Grant microphone permissions when prompted
4. Test the voice recording feature
5. Check that responses are being generated correctly

## Troubleshooting

### Build Errors

If you get build errors:
- Check that all dependencies are in `package.json`
- Ensure Node.js version is 18 or higher
- Review build logs for specific error messages

### API Errors

If you get API errors:
- Verify your `GROQ_API_KEY` is set correctly
- Check that the key has not expired
- Ensure you have API credits/quota available on Groq

### Microphone Not Working

If microphone doesn't work:
- Ensure you're using HTTPS (required for microphone access)
- Check browser permissions
- Try a different browser (Chrome/Edge recommended)

## Monitoring and Updates

### View Logs

On Vercel:
- Go to your project dashboard
- Click on a deployment
- View "Function Logs" for API route logs

### Update Your App

To deploy updates:
1. Make changes to your code
2. Commit changes: `git commit -am "Update: description"`
3. Push to GitHub: `git push`
4. Deployment platform will automatically redeploy

## Custom Domain (Optional)

### On Vercel:
1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for DNS propagation (up to 48 hours)

## Security Best Practices

1. Never commit `.env.local` to GitHub
2. Rotate your API keys periodically
3. Monitor API usage on Groq dashboard
4. Set up rate limiting if needed
5. Use environment variables for all secrets

## Cost Considerations

- Vercel: Free tier includes 100GB bandwidth/month
- Groq: Check current pricing at console.groq.com
- Most deployments fit within free tiers for personal use

## Next Steps

After deployment:
1. Share your app with friends!
2. Monitor usage and performance
3. Gather feedback and iterate
4. Consider adding features like:
   - User authentication
   - Chat history persistence
   - Multiple AI model options
   - Custom system prompts
   - Export chat transcripts

## Support

For deployment issues:
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Groq: [console.groq.com/docs](https://console.groq.com/docs)
- GitHub Issues: Create an issue in your repository

Good luck with your deployment! 🚀
