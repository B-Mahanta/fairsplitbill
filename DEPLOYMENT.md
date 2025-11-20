# FairSplit - Production Deployment Guide

## 🚀 Quick Deploy

### Prerequisites
- Node.js 18+ or Bun
- Git

### Build for Production
```bash
npm run build:prod
# or
bun run build:prod
```

The optimized production build will be in the `dist/` directory.

---

## 📦 Deployment Platforms

### Vercel (Recommended)
1. Install Vercel CLI: `npm i -g vercel`
2. Run: `vercel`
3. Follow prompts
4. Done! Your app is live.

**Or use Vercel Dashboard:**
1. Go to [vercel.com](https://vercel.com)
2. Import your Git repository
3. Framework Preset: Vite
4. Build Command: `npm run build:prod`
5. Output Directory: `dist`
6. Deploy!

### Netlify
1. Install Netlify CLI: `npm i -g netlify-cli`
2. Run: `netlify deploy --prod`
3. Drag `dist` folder or connect Git

**netlify.toml** (already configured):
```toml
[build]
  command = "npm run build:prod"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### GitHub Pages
```bash
npm run build:prod
# Push dist folder to gh-pages branch
```

### Cloudflare Pages
1. Connect your Git repository
2. Build command: `npm run build:prod`
3. Build output: `dist`
4. Deploy!

### AWS S3 + CloudFront
```bash
# Build
npm run build:prod

# Upload to S3
aws s3 sync dist/ s3://your-bucket-name --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### Docker
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:prod

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

---

## 🔧 Environment Configuration

### Production Environment Variables
Create `.env.production`:
```env
VITE_APP_NAME=FairSplit
VITE_APP_VERSION=2.0.0
VITE_APP_ENV=production
VITE_PWA_ENABLED=true
```

### Custom Domain Setup
1. Add CNAME record: `www.yourdomain.com` → `your-app.vercel.app`
2. Add A record: `yourdomain.com` → Vercel IP
3. Enable HTTPS (automatic on most platforms)

---

## 🔒 Security Checklist

- [x] HTTPS enabled (automatic on Vercel/Netlify)
- [x] Security headers configured
- [x] XSS protection enabled
- [x] Content Security Policy (CSP) ready
- [x] No sensitive data in client code
- [x] Environment variables properly configured
- [x] CORS configured (if using API)

---

## ⚡ Performance Optimizations

### Already Implemented
- ✅ Code splitting (React, UI, Utils)
- ✅ Tree shaking
- ✅ Minification (Terser)
- ✅ Lazy loading
- ✅ Service Worker caching
- ✅ Image optimization
- ✅ Font optimization
- ✅ CSS purging (Tailwind)

### Build Analysis
```bash
npm run build:analyze
```

### Performance Targets
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Time to Interactive (TTI): < 3.5s
- Cumulative Layout Shift (CLS): < 0.1
- First Input Delay (FID): < 100ms

---

## 📱 Mobile Testing

### Test on Real Devices
- iOS Safari (iPhone 12+, iPad)
- Android Chrome (Samsung, Pixel)
- Android Firefox
- Mobile Safari (various iOS versions)

### Browser Testing Tools
- Chrome DevTools Device Mode
- Firefox Responsive Design Mode
- BrowserStack
- LambdaTest

### PWA Testing
1. Open in mobile browser
2. Look for "Add to Home Screen" prompt
3. Install and test offline functionality
4. Verify app icon and splash screen

---

## 🧪 Pre-Deployment Testing

### Checklist
```bash
# 1. Type checking
npm run type-check

# 2. Linting
npm run lint

# 3. Build test
npm run build:prod

# 4. Preview production build
npm run preview

# 5. Test on mobile devices
# Open http://your-local-ip:4173 on mobile
```

### Manual Testing
- [ ] All pages load correctly
- [ ] Forms submit properly
- [ ] Calculations are accurate
- [ ] Export functions work
- [ ] Share functionality works
- [ ] Responsive on all screen sizes
- [ ] Works offline (PWA)
- [ ] No console errors
- [ ] Fast load times

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run build:prod
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 📊 Monitoring & Analytics

### Recommended Tools
- **Performance**: Lighthouse, WebPageTest
- **Error Tracking**: Sentry, LogRocket
- **Analytics**: Plausible, Fathom (privacy-friendly)
- **Uptime**: UptimeRobot, Pingdom

### Lighthouse Audit
```bash
# Install Lighthouse
npm i -g lighthouse

# Run audit
lighthouse https://your-app.com --view
```

---

## 🐛 Troubleshooting

### Build Fails
```bash
# Clear cache and rebuild
npm run clean
npm install
npm run build:prod
```

### Routing Issues (404 on refresh)
- Ensure SPA fallback is configured
- Vercel: automatic
- Netlify: use `_redirects` or `netlify.toml`
- Nginx: configure try_files

### Service Worker Issues
```bash
# Clear service worker cache
# In browser console:
navigator.serviceWorker.getRegistrations().then(registrations => {
  registrations.forEach(registration => registration.unregister())
})
```

---

## 📞 Support

For deployment issues:
1. Check build logs
2. Verify environment variables
3. Test locally with `npm run preview`
4. Check platform-specific documentation

---

## 🎉 Post-Deployment

### Verify Deployment
- [ ] App loads on production URL
- [ ] HTTPS is working
- [ ] PWA install prompt appears
- [ ] All features work correctly
- [ ] Mobile responsive
- [ ] Fast load times
- [ ] No console errors

### Share Your App
- Update README with live URL
- Share on social media
- Submit to PWA directories
- Get feedback from users

---

**Congratulations! Your FairSplit app is now live! 🚀**
