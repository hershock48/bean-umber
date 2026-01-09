# Quick Deploy Commands

Copy and paste these commands to deploy:

## 1. Push to GitHub

```bash
git push origin main
```

## 2. Generate Admin Token

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Save the output securely!** You'll need it for step 3.

## 3. Add to Vercel Environment Variables

Go to: Vercel Dashboard → Your Project → Settings → Environment Variables

Add each of these (replace with your actual values):

```
AIRTABLE_API_KEY=pat...
AIRTABLE_BASE_ID=app...
AIRTABLE_SPONSORSHIPS_TABLE=Sponsorships
AIRTABLE_UPDATES_TABLE=Updates
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
ADMIN_API_TOKEN=<paste_token_from_step_2>
NEXT_PUBLIC_SITE_URL=https://www.beanumber.org
SENDGRID_API_KEY=SG...
SENDGRID_FROM_EMAIL=info@beanumber.org
SENDGRID_FROM_NAME=Be A Number, International
```

## 4. Deploy (Automatic)

Vercel will auto-deploy when you push to main. Watch the deployment in your Vercel dashboard.

## 5. Verify Deployment

After deployment completes:

```bash
# Test homepage
curl https://www.beanumber.org

# Check if API is working
curl https://www.beanumber.org/api/sponsor/updates?code=BAN-2024-001
```

## That's It!

See [PRE_DEPLOYMENT_CHECKLIST.md](PRE_DEPLOYMENT_CHECKLIST.md) for detailed information.
