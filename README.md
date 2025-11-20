# FairSplit - Fair Bill Splitting App

A modern, mobile-first web application for splitting bills fairly based on actual consumption rather than equal splits.

## 🌟 Features

### Core Functionality
- **Fair Consumption-Based Splitting**: Pay only for what you consume
- **Multi-Participant Support**: Add unlimited participants
- **Flexible Item Assignment**: Items can be shared by all, specific people, or individuals
- **Cross-Payment Handling**: Someone can pay for items others consume
- **Optimal Debt Settlement**: Minimizes number of transactions needed
- **Real-time Calculations**: Instant updates as you add items and participants

### User Experience
- **Mobile-First Design**: Optimized for smartphones and tablets
- **Progressive Web App (PWA)**: Install on home screen, works offline
- **Tabbed Mobile Interface**: Easy navigation on small screens
- **Desktop Grid Layout**: Efficient use of larger screens
- **Auto-Save**: Automatically saves your progress locally
- **Export & Share**: Download bill data or share via native sharing

### Production Features
- **Error Boundaries**: Graceful error handling
- **Input Validation**: Comprehensive data validation
- **Accessibility**: WCAG compliant with proper focus management
- **Performance Optimized**: Fast loading and smooth interactions
- **Offline Support**: Works without internet connection
- **Data Persistence**: Local storage with automatic backup

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd fairsplit

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Setup
Create a `.env` file in the root directory:
```env
VITE_APP_NAME=FairSplit
VITE_APP_VERSION=1.0.0
```

## 📱 Usage

### Adding Participants
1. Navigate to the "People" tab (mobile) or use the left panel (desktop)
2. Enter participant names (minimum 2 characters)
3. Participants appear as removable badges

### Adding Items
1. Go to the "Items" tab or use the add item form
2. Enter item name and price in INR (₹)
3. Select who paid for the item
4. Choose sharing options:
   - **Shared by everyone**: Split equally among all participants
   - **Specific people**: Select who consumed the item

### Viewing Settlement
1. Check the "Split" tab or settlement summary panel
2. See individual breakdowns showing:
   - What each person consumed
   - What each person paid
   - Net balance (owed or owes)
3. Follow payment instructions for optimal settlement

### Export & Share
- **Export**: Download bill data as JSON file
- **Share**: Use native sharing to send bill summary
- **Clear**: Reset all data to start fresh

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives
- **State Management**: React hooks with local storage
- **Build Tool**: Vite
- **PWA**: Service Worker with caching

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Base UI components (buttons, inputs, etc.)
│   ├── BillHeader.tsx  # Participant management
│   ├── AddItemForm.tsx # Item creation form
│   ├── ItemList.tsx    # Bill items display
│   └── SettlementSummary.tsx # Payment calculations
├── pages/              # Route components
├── utils/              # Utility functions
│   ├── validation.ts   # Input validation
│   └── serviceWorker.ts # PWA functionality
└── lib/                # Shared libraries
```

### Key Algorithms

#### Fair Split Calculation
1. **Consumption Tracking**: Each item is divided among assigned participants
2. **Payment Tracking**: Records who actually paid for each item
3. **Net Balance**: Calculates `paid - consumed` for each person
4. **Debt Settlement**: Uses greedy algorithm to minimize transactions

#### Optimal Payment Settlement
```typescript
// Simplified algorithm
const debtors = people.filter(p => p.balance < 0);
const creditors = people.filter(p => p.balance > 0);

// Match debtors with creditors to minimize transactions
while (debtors.length && creditors.length) {
  const payment = Math.min(debtor.debt, creditor.credit);
  createPayment(debtor, creditor, payment);
  updateBalances(debtor, creditor, payment);
}
```

## 🔧 Configuration

### Customization
- **Currency**: Currently supports INR (₹), easily extensible
- **Validation Rules**: Configurable in `src/utils/validation.ts`
- **UI Theme**: Tailwind CSS custom properties in `src/index.css`

### Performance Optimization
- **Code Splitting**: Automatic route-based splitting
- **Lazy Loading**: Components loaded on demand
- **Caching**: Service worker caches static assets
- **Bundle Analysis**: Use `npm run build -- --analyze`

## 🧪 Testing

### Manual Testing Scenarios
1. **Basic Split**: 3 people, 1 shared item
2. **Multi-Payer**: Different people paying for different items
3. **Partial Sharing**: Items consumed by subset of participants
4. **Complex Mixed**: Combination of shared and individual items
5. **Edge Cases**: Single person, zero amounts, large numbers

### Validation Testing
- Invalid participant names
- Invalid prices (negative, non-numeric, too many decimals)
- Empty forms and missing required fields
- Duplicate participants

## 🔍 SEO Optimization

FairSplit is fully optimized for search engines with:

### SEO Features
- **Structured Data**: JSON-LD schema for WebApplication and FAQPage
- **Meta Tags**: Comprehensive meta tags for all search engines
- **Open Graph**: Full social media card support (Facebook, Twitter, LinkedIn)
- **Sitemap**: XML sitemap with image extensions
- **Robots.txt**: Optimized for all major search engines
- **Semantic HTML**: Proper heading hierarchy and semantic elements
- **Mobile-First**: Responsive design for better mobile rankings
- **Performance**: Fast loading times for better Core Web Vitals

### Post-Deployment SEO Setup
After deploying, follow these steps:

1. **Submit to Search Engines**
   - Google Search Console: Submit sitemap at `/sitemap.xml`
   - Bing Webmaster Tools: Submit sitemap
   - Verify structured data with Google's Rich Results Test

2. **Create Social Media Image**
   - Create 1200x630px image as `public/og-image.png`
   - Include FairSplit branding and tagline

3. **Monitor Performance**
   - Set up Google Analytics 4
   - Track keyword rankings
   - Monitor Core Web Vitals

For detailed SEO setup instructions, see [SEO_SETUP_GUIDE.md](SEO_SETUP_GUIDE.md)

## 🚀 Deployment

### Production Build
```bash
npm run build
```

### Deployment Options
- **Vercel**: Zero-config deployment
- **Netlify**: Drag-and-drop or Git integration
- **GitHub Pages**: Static hosting
- **Docker**: Containerized deployment

### Environment Variables
```env
# Production
VITE_APP_ENV=production
VITE_API_URL=https://api.fairsplit.app
```

## 🔒 Security & Privacy

### Data Handling
- **Local Storage Only**: No data sent to external servers
- **Input Sanitization**: All user inputs are validated and sanitized
- **XSS Protection**: React's built-in protection + additional sanitization
- **No Tracking**: No analytics or tracking scripts

### Privacy Features
- **Offline First**: Works completely offline
- **No Registration**: No accounts or personal data required
- **Local Data**: All calculations happen in browser
- **Export Control**: Users control their data export

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Make changes and test thoroughly
4. Commit: `git commit -m 'Add amazing feature'`
5. Push: `git push origin feature/amazing-feature`
6. Open Pull Request

### Code Standards
- **TypeScript**: Strict mode enabled
- **ESLint**: Airbnb configuration
- **Prettier**: Automatic code formatting
- **Conventional Commits**: Standardized commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide Icons**: Beautiful icon library
- **Vite**: Fast build tool and dev server

## 📞 Support

For support, feature requests, or bug reports:
- Create an issue on GitHub
- Check existing documentation
- Review the FAQ section

---

**FairSplit** - Making bill splitting transparent and fair for everyone! 🎯