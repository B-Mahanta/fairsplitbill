# Mobile Testing Guide for FairSplit

## 📱 Device Testing Matrix

### iOS Devices
- [ ] iPhone 15 Pro Max (iOS 17+)
- [ ] iPhone 14 Pro (iOS 16+)
- [ ] iPhone 13 (iOS 15+)
- [ ] iPhone SE (2022)
- [ ] iPad Pro 12.9" (iPadOS 17+)
- [ ] iPad Air (iPadOS 16+)
- [ ] iPad Mini

### Android Devices
- [ ] Samsung Galaxy S24 Ultra
- [ ] Samsung Galaxy S23
- [ ] Google Pixel 8 Pro
- [ ] Google Pixel 7
- [ ] OnePlus 11
- [ ] Xiaomi 13 Pro
- [ ] Samsung Galaxy Tab S9

### Screen Sizes to Test
- [ ] Small phones (320px - 375px width)
- [ ] Standard phones (375px - 414px width)
- [ ] Large phones (414px - 480px width)
- [ ] Tablets (768px - 1024px width)
- [ ] Landscape orientation
- [ ] Portrait orientation

---

## 🧪 Testing Checklist

### Visual & Layout
- [ ] All text is readable (minimum 16px font size)
- [ ] Buttons are tap-friendly (minimum 44x44px)
- [ ] No horizontal scrolling
- [ ] Content fits within viewport
- [ ] Images scale properly
- [ ] Forms are easy to fill
- [ ] Modals/dialogs work correctly
- [ ] Navigation is accessible
- [ ] Safe area insets respected (notches, home indicators)

### Touch Interactions
- [ ] All buttons respond to touch
- [ ] Swipe gestures work (if applicable)
- [ ] Long press works (if applicable)
- [ ] Pinch to zoom disabled (or works correctly)
- [ ] Touch targets don't overlap
- [ ] Hover states work on touch
- [ ] No accidental taps

### Performance
- [ ] Page loads in < 3 seconds on 3G
- [ ] Smooth scrolling (60fps)
- [ ] No layout shifts
- [ ] Images load progressively
- [ ] Animations are smooth
- [ ] No janky interactions
- [ ] App remains responsive under load

### Functionality
- [ ] Add participants works
- [ ] Add items works
- [ ] Edit items works
- [ ] Delete items works
- [ ] Currency selector works
- [ ] Export functions work
- [ ] Share functionality works
- [ ] Clear all works
- [ ] Data persists on refresh
- [ ] Calculations are accurate

### PWA Features
- [ ] "Add to Home Screen" prompt appears
- [ ] App installs correctly
- [ ] App icon displays correctly
- [ ] Splash screen shows
- [ ] Works offline
- [ ] Service worker caches assets
- [ ] Updates notify user

### Browser Compatibility
- [ ] Safari (iOS)
- [ ] Chrome (iOS)
- [ ] Firefox (iOS)
- [ ] Chrome (Android)
- [ ] Firefox (Android)
- [ ] Samsung Internet
- [ ] Edge (Android)

### Network Conditions
- [ ] Works on WiFi
- [ ] Works on 4G/LTE
- [ ] Works on 3G
- [ ] Works on slow 2G
- [ ] Handles offline gracefully
- [ ] Syncs when back online

### Accessibility
- [ ] Screen reader compatible
- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Color contrast sufficient
- [ ] Text can be resized
- [ ] Works with assistive technologies

---

## 🔧 Testing Tools

### Browser DevTools
```bash
# Chrome DevTools
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select device or custom dimensions
4. Test responsive behavior
5. Throttle network (3G, Slow 3G)
6. Check Lighthouse scores
```

### Remote Debugging

#### iOS Safari
1. Enable Web Inspector on iPhone (Settings > Safari > Advanced)
2. Connect iPhone to Mac via USB
3. Open Safari > Develop > [Your iPhone] > [Your Page]

#### Android Chrome
1. Enable USB Debugging on Android
2. Connect to computer via USB
3. Open Chrome > chrome://inspect
4. Click "Inspect" on your device

### Testing URLs
```bash
# Local network testing
# Find your local IP
ipconfig getifaddr en0  # Mac
ip addr show           # Linux
ipconfig              # Windows

# Access from mobile
http://YOUR_LOCAL_IP:8080
```

### Lighthouse Audit
```bash
# Run Lighthouse
npm run build:prod
npm run preview

# In Chrome DevTools
1. Open DevTools
2. Go to Lighthouse tab
3. Select "Mobile"
4. Click "Analyze page load"
```

### BrowserStack / LambdaTest
- Test on real devices remotely
- Automated screenshot testing
- Cross-browser compatibility

---

## 🐛 Common Mobile Issues & Fixes

### Issue: Text too small
**Fix:** Ensure minimum 16px font size
```css
body {
  font-size: 16px;
}
```

### Issue: Buttons too small
**Fix:** Minimum 44x44px tap targets
```css
button {
  min-height: 44px;
  min-width: 44px;
}
```

### Issue: Horizontal scrolling
**Fix:** Ensure content fits viewport
```css
* {
  max-width: 100%;
  box-sizing: border-box;
}
```

### Issue: Viewport not scaling
**Fix:** Correct viewport meta tag
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5.0">
```

### Issue: Inputs zoom on focus (iOS)
**Fix:** Use 16px font size for inputs
```css
input, select, textarea {
  font-size: 16px;
}
```

### Issue: Safe area not respected
**Fix:** Use safe-area-inset
```css
.header {
  padding-top: env(safe-area-inset-top);
}
```

### Issue: Slow performance
**Fix:** Optimize images, lazy load, code split
```javascript
// Lazy load images
<img loading="lazy" src="..." />

// Code splitting
const Component = lazy(() => import('./Component'));
```

---

## 📊 Performance Benchmarks

### Target Metrics (Mobile)
- **First Contentful Paint (FCP):** < 1.8s
- **Largest Contentful Paint (LCP):** < 2.5s
- **First Input Delay (FID):** < 100ms
- **Cumulative Layout Shift (CLS):** < 0.1
- **Time to Interactive (TTI):** < 3.8s
- **Total Blocking Time (TBT):** < 300ms

### Lighthouse Scores
- **Performance:** > 90
- **Accessibility:** > 95
- **Best Practices:** > 95
- **SEO:** > 95
- **PWA:** > 90

---

## 🎯 Test Scenarios

### Scenario 1: New User Flow
1. Open app on mobile
2. Add 3 participants
3. Add 5 items with different prices
4. Assign items to different people
5. View settlement summary
6. Export as text
7. Share via native share

### Scenario 2: Offline Usage
1. Open app online
2. Add data
3. Turn off network
4. Verify data persists
5. Try to use app offline
6. Turn network back on
7. Verify sync

### Scenario 3: PWA Installation
1. Open app in mobile browser
2. Look for install prompt
3. Install to home screen
4. Open from home screen
5. Verify standalone mode
6. Test offline functionality

### Scenario 4: Landscape Mode
1. Rotate device to landscape
2. Verify layout adapts
3. Test all functionality
4. Check for overflow
5. Verify readability

### Scenario 5: Slow Network
1. Throttle to Slow 3G
2. Load app
3. Verify progressive loading
4. Test interactions
5. Check for timeouts

---

## 📝 Bug Report Template

```markdown
### Bug Description
[Clear description of the issue]

### Device & Browser
- Device: [e.g., iPhone 14 Pro]
- OS: [e.g., iOS 17.1]
- Browser: [e.g., Safari 17]
- Screen Size: [e.g., 393x852]

### Steps to Reproduce
1. [First step]
2. [Second step]
3. [Third step]

### Expected Behavior
[What should happen]

### Actual Behavior
[What actually happens]

### Screenshots
[Attach screenshots if applicable]

### Additional Context
[Any other relevant information]
```

---

## ✅ Sign-Off Checklist

Before deploying to production:

- [ ] Tested on at least 3 different iOS devices
- [ ] Tested on at least 3 different Android devices
- [ ] Tested on tablets (iPad, Android tablet)
- [ ] All Lighthouse scores > 90
- [ ] No console errors
- [ ] PWA installs correctly
- [ ] Works offline
- [ ] All features functional
- [ ] Performance acceptable on 3G
- [ ] Accessibility verified
- [ ] Cross-browser tested
- [ ] Safe area insets working
- [ ] Touch targets adequate
- [ ] No layout issues

---

**Ready for mobile users! 📱✨**
