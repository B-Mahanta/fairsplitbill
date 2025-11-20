import { useState, useEffect } from "react";
import { BillHeader } from "@/components/BillHeader";
import { ItemList, BillItem } from "@/components/ItemList";
import { AddItemForm } from "@/components/AddItemForm";
import { SettlementSummary } from "@/components/SettlementSummary";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, FileText, Download, Archive, DollarSign, Users, ShoppingCart, Calculator } from "lucide-react";
import { formatCurrency, sanitizeMonetaryData, cleanStorageData, sumAmounts, divideAmount } from "@/utils/currency";
import { cleanAllStorageData, generatePrecisionReport } from "@/utils/storageCleanup";

// Currency configuration
export interface Currency {
  code: string;
  symbol: string;
  name: string;
  decimals?: number;
}

export const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Złoty' },
  { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna' },
  { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso' },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong' },
];

const Index = () => {
  const [participants, setParticipants] = useState<string[]>([]);
  const [items, setItems] = useState<BillItem[]>([]);
  const [currency, setCurrency] = useState<Currency>(CURRENCIES.find(c => c.code === 'INR') || CURRENCIES[0]);
  const { toast } = useToast();

  // Auto-save to localStorage with data sanitization
  useEffect(() => {
    // Clean any existing data first
    cleanStorageData('fairsplit-data');
    
    const savedData = localStorage.getItem('fairsplit-data');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        const { participants: savedParticipants, items: savedItems, currency: savedCurrency } = sanitizeMonetaryData(parsed);
        
        setParticipants(savedParticipants || []);
        
        // Restore currency
        if (savedCurrency) {
          const foundCurrency = CURRENCIES.find(c => c.code === savedCurrency.code);
          if (foundCurrency) {
            setCurrency(foundCurrency);
          }
        }
        
        // Add backward compatibility for items without participantsAtTime
        // Also ensure all prices are properly rounded
        const updatedItems = (savedItems || []).map((item: BillItem) => {
          // Triple sanitization to catch any edge cases
          let sanitizedPrice = item.price;
          
          // First pass: standard rounding
          sanitizedPrice = Math.round((sanitizedPrice + Number.EPSILON) * 100) / 100;
          
          // Second pass: check if it's very close to a whole number and round if so
          const nearestWhole = Math.round(sanitizedPrice);
          if (Math.abs(sanitizedPrice - nearestWhole) < 0.01) {
            sanitizedPrice = nearestWhole;
          }
          
          return {
            ...item,
            price: sanitizedPrice,
            participantsAtTime: item.participantsAtTime || savedParticipants || []
          };
        });
        
        setItems(updatedItems);
        
        if (savedParticipants?.length > 0 || savedItems?.length > 0) {
          toast({
            title: "Data restored",
            description: "Your previous session has been restored and cleaned.",
          });
        }
      } catch (error) {
        console.error('Failed to restore data:', error);
        // Clear corrupted data
        localStorage.removeItem('fairsplit-data');
      }
    }
  }, [toast]);

  useEffect(() => {
    if (participants.length > 0 || items.length > 0 || currency.code !== 'INR') {
      // Sanitize items before saving to localStorage
      const sanitizedItems = items.map(item => ({
        ...item,
        price: Math.round((item.price + Number.EPSILON) * 100) / 100
      }));
      
      localStorage.setItem('fairsplit-data', JSON.stringify({ 
        participants, 
        items: sanitizedItems, 
        currency 
      }));
    }
  }, [participants, items, currency]);

  // Currency formatter function using Intl.NumberFormat
  const formatCurrencyAmount = (amount: number) => {
    return formatCurrency(amount, currency);
  };

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    toast({
      title: "Currency changed",
      description: `Currency changed to ${newCurrency.name} (${newCurrency.symbol})`,
    });
  };

  const handleAddParticipant = (name: string) => {
    if (participants.includes(name)) {
      toast({
        title: "Duplicate participant",
        description: "This participant already exists.",
        variant: "destructive",
      });
      return;
    }
    setParticipants([...participants, name]);
    toast({
      title: "Participant added",
      description: `${name} has been added to the bill.`,
    });
  };

  const handleRemoveParticipant = (name: string) => {
    setParticipants(participants.filter((p) => p !== name));
    // Remove participant from items
    setItems(
      items.map((item) => ({
        ...item,
        assignedTo: item.assignedTo.filter((p) => p !== name),
      }))
    );
    toast({
      title: "Participant removed",
      description: `${name} has been removed from the bill.`,
    });
  };

  const handleAddItem = (item: Omit<BillItem, "id">) => {
    // Sanitize price before adding to state
    const sanitizedItem = {
      ...item,
      price: Math.round((item.price + Number.EPSILON) * 100) / 100,
      id: crypto.randomUUID()
    };
    
    setItems([...items, sanitizedItem]);
    toast({
      title: "Item added",
      description: `${sanitizedItem.name} (${formatCurrencyAmount(sanitizedItem.price)}) has been added.`,
    });
  };

  const handleRemoveItem = (id: string) => {
    const item = items.find(i => i.id === id);
    setItems(items.filter((item) => item.id !== id));
    if (item) {
      toast({
        title: "Item removed",
        description: `${item.name} has been removed.`,
      });
    }
  };

  const handleEditItem = (id: string, updatedItem: Partial<BillItem>) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, ...updatedItem } : item
    ));
    toast({
      title: "Item updated",
      description: "Item participants have been updated.",
    });
  };

  const handleClearAll = () => {
    setParticipants([]);
    setItems([]);
    localStorage.removeItem('fairsplit-data');
    toast({
      title: "All data cleared",
      description: "Started fresh with a new bill.",
    });
  };

  const handleCleanData = () => {
    // Apply aggressive rounding to current data
    const cleanedItems = items.map(item => {
      const originalPrice = item.price;
      
      // More aggressive rounding - handle common precision issues
      let roundedPrice = Math.round((originalPrice + Number.EPSILON) * 100) / 100;
      
      // Special handling for values that should be round numbers
      // If the value is very close to a round number, round it to that number
      const nearestHundred = Math.round(originalPrice / 100) * 100;
      const nearestTen = Math.round(originalPrice / 10) * 10;
      const nearestOne = Math.round(originalPrice);
      
      if (Math.abs(originalPrice - nearestHundred) < 0.02) {
        roundedPrice = nearestHundred;
      } else if (Math.abs(originalPrice - nearestTen) < 0.02) {
        roundedPrice = nearestTen;
      } else if (Math.abs(originalPrice - nearestOne) < 0.02) {
        roundedPrice = nearestOne;
      }
      
      // Debug logging
      console.log(`Item: ${item.name}`);
      console.log(`  Original: ${originalPrice}`);
      console.log(`  Standard rounded: ${Math.round((originalPrice + Number.EPSILON) * 100) / 100}`);
      console.log(`  Smart rounded: ${roundedPrice}`);
      
      return {
        ...item,
        price: roundedPrice
      };
    });
    
    // Save cleaned data
    const cleanedData = { participants, items: cleanedItems, currency };
    localStorage.setItem('fairsplit-data', JSON.stringify(cleanedData));
    
    // Also clear any backup data
    localStorage.removeItem('fairsplit-data-backup');
    cleanAllStorageData();
    
    // Update state with cleaned data
    setItems(cleanedItems);
    
    toast({
      title: "Prices fixed!",
      description: `Fixed ${cleanedItems.length} items. Refreshing page...`,
    });
    
    // Force page refresh to ensure UI updates
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  const handleExportData = (format: 'json' | 'summary') => {
    const billTotal = sumAmounts(items.map(item => item.price));
    const timestamp = new Date().toISOString().split('T')[0];
    
    if (format === 'json') {
      // JSON for backup/restore
      const data = { participants, items, currency, timestamp: new Date().toISOString() };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      downloadFile(blob, `fairsplit-backup-${timestamp}.json`);
      toast({
        title: "Backup exported",
        description: "Bill data backup downloaded as JSON file.",
      });
    } else if (format === 'summary') {
      // Human-readable summary with UTF-8 BOM for mobile compatibility
      const summaryContent = generateSummary();
      // Add UTF-8 BOM (Byte Order Mark) to ensure proper encoding on all devices
      const BOM = '\uFEFF';
      const blob = new Blob([BOM + summaryContent], { type: 'text/plain;charset=utf-8' });
      downloadFile(blob, `fairsplit-summary-${timestamp}.txt`);
      toast({
        title: "Summary exported",
        description: "Bill summary exported as text file.",
      });
    }
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const generateSummary = () => {
    const billTotal = sumAmounts(items.map(item => item.price));
    const date = new Date().toLocaleDateString();
    
    // Calculate shares
    const shares: { [key: string]: { consumed: number; paid: number; balance: number } } = {};
    participants.forEach(p => {
      shares[p] = { consumed: 0, paid: 0, balance: 0 };
    });

    items.forEach(item => {
      const assignedTo = item.assignedTo.length === 0 ? item.participantsAtTime : item.assignedTo;
      const dividedAmounts = divideAmount(item.price, assignedTo.length);
      
      assignedTo.forEach((participant, index) => {
        if (shares[participant]) {
          shares[participant].consumed += dividedAmounts[index] || 0;
        }
      });
      
      if (shares[item.paidBy]) {
        shares[item.paidBy].paid += item.price;
      }
    });

    Object.keys(shares).forEach(participant => {
      // Apply precision fix to avoid floating-point errors
      shares[participant].balance = Math.round((shares[participant].paid - shares[participant].consumed + Number.EPSILON) * 100) / 100;
    });

    let summary = `FAIRSPLIT BILL SUMMARY\n`;
    summary += `Date: ${date}\n`;
    summary += `Currency: ${currency.name} (${currency.symbol})\n`;
    summary += `Total Bill: ${formatCurrencyAmount(billTotal)}\n`;
    summary += `Participants: ${participants.join(', ')}\n\n`;
    
    summary += `ITEMS BREAKDOWN:\n`;
    summary += `${'='.repeat(50)}\n`;
    items.forEach(item => {
      const assignedTo = item.assignedTo.length === 0 ? item.participantsAtTime : item.assignedTo;
      const dividedAmounts = divideAmount(item.price, assignedTo.length);
      const perPersonAmounts = dividedAmounts.map(amount => formatCurrencyAmount(amount)).join(', ');
      summary += `${item.name}: ${formatCurrencyAmount(item.price)}\n`;
      summary += `  Paid by: ${item.paidBy}\n`;
      summary += `  Shared with: ${assignedTo.join(', ')}\n`;
      summary += `  Per person: ${perPersonAmounts}\n\n`;
    });
    
    summary += `SETTLEMENT SUMMARY:\n`;
    summary += `${'='.repeat(50)}\n`;
    Object.entries(shares).forEach(([name, share]) => {
      summary += `${name}:\n`;
      summary += `  Consumed: ${formatCurrencyAmount(share.consumed)}\n`;
      summary += `  Paid: ${formatCurrencyAmount(share.paid)}\n`;
      summary += `  Balance: ${share.balance >= 0 ? '+' : '-'}${formatCurrencyAmount(Math.abs(share.balance))}\n\n`;
    });

    // Payment instructions
    const debtors = Object.entries(shares).filter(([_, s]) => s.balance < 0);
    const creditors = Object.entries(shares).filter(([_, s]) => s.balance > 0);
    
    if (debtors.length > 0) {
      summary += `PAYMENT INSTRUCTIONS:\n`;
      summary += `${'='.repeat(50)}\n`;
      debtors.forEach(([debtor, debtorShare]) => {
        creditors.forEach(([creditor, creditorShare]) => {
          if (creditorShare.balance > 0 && debtorShare.balance < 0) {
            const payment = Math.min(Math.abs(debtorShare.balance), creditorShare.balance);
            if (payment > 0.01) {
              summary += `${debtor} pays ${creditor}: ${formatCurrencyAmount(payment)}\n`;
              debtorShare.balance += payment;
              creditorShare.balance -= payment;
            }
          }
        });
      });
    } else {
      summary += `All settled! No payments needed.\n`;
    }
    
    summary += `\nGenerated by FairSplit - Fair bill splitting made easy`;
    return summary;
  };

  return (
    <>
      <SEOHead />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 overflow-x-hidden">
        {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-gray-200 px-3 sm:px-4 py-4 sm:py-6 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-shrink">
              <div className="w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-lg hover:shadow-xl transition-shadow duration-300 flex-shrink-0">
                <span className="text-white font-bold text-base sm:text-lg">FS</span>
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent truncate">FairSplit</h1>
                <p className="text-xs text-gray-500 hidden sm:block" role="doc-subtitle">Fair bill splitting made easy</p>
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
              {/* Currency Selector */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="flex items-center gap-1 sm:gap-2 border-2 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 font-semibold px-2 sm:px-3">
                    <span className="font-mono text-sm sm:text-base">{currency.symbol}</span>
                    <span className="hidden sm:inline font-bold text-sm">{currency.code}</span>
                    <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 max-h-64 overflow-y-auto">
                  {CURRENCIES.map((curr) => (
                    <DropdownMenuItem 
                      key={curr.code} 
                      onClick={() => handleCurrencyChange(curr)}
                      className={`flex items-center justify-between ${currency.code === curr.code ? 'bg-primary/10' : ''}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm w-6">{curr.symbol}</span>
                        <span className="font-medium">{curr.code}</span>
                      </div>
                      <span className="text-xs text-gray-500 truncate">{curr.name}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {(participants.length > 0 || items.length > 0) && (
                <>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="px-2 sm:px-3">
                      <Download className="h-3 w-3 sm:h-4 sm:w-4 sm:mr-2" />
                      <span className="hidden sm:inline">Export</span>
                      <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 sm:ml-2" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleExportData('summary')}>
                      <FileText className="h-4 w-4 mr-2" />
                      Summary (TXT)
                      <span className="ml-auto text-xs text-gray-500">Readable</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleExportData('json')}>
                      <Archive className="h-4 w-4 mr-2" />
                      Backup (JSON)
                      <span className="ml-auto text-xs text-gray-500">Restore</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                  <Button onClick={handleClearAll} variant="outline" size="sm" className="px-2 sm:px-3 text-xs sm:text-sm">
                    <span className="hidden sm:inline">Clear All</span>
                    <span className="sm:hidden">Clear</span>
                  </Button>
                  {process.env.NODE_ENV === 'development' && (
                    <Button onClick={handleCleanData} variant="outline" size="sm" className="text-xs">
                      Clean Data
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 sm:py-6">
        {/* Hero Section - Only show when empty */}
        {(participants.length === 0 && items.length === 0) && (
          <div className="text-center mb-6 py-3">
            <div className="mb-4">
              <h2 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2 animate-in fade-in duration-700 leading-tight">
                Free Bill Splitting Calculator - Split Bills the Fair Way
              </h2>
              <div className="h-1 w-24 bg-gradient-to-r from-primary via-purple-600 to-pink-600 rounded-full mx-auto animate-in slide-in-from-bottom duration-700"></div>
            </div>
            <p className="text-gray-700 text-base max-w-2xl mx-auto mb-5 animate-in fade-in duration-700 delay-150 leading-relaxed">
              <strong>Free bill splitting calculator</strong> where everyone pays only for what they consume. <br />
              <span className="text-primary font-semibold">No more awkward math or unfair splits.</span>
            </p>
            
            {/* CTA Button */}
            <Button 
              size="default"
              className="mb-6 bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-semibold px-6 py-2 shadow-lg hover:shadow-xl transition-all duration-300 animate-in fade-in duration-700 delay-200"
              onClick={() => {
                const participantInput = document.querySelector('input[placeholder*="Enter name"]') as HTMLInputElement;
                participantInput?.focus();
              }}
            >
              Get Started
            </Button>
            
            {/* Quick Start Guide - More Compact */}
            <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-3 animate-in fade-in duration-700 delay-300">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200 hover:shadow-md hover:border-blue-300 transition-all duration-300 hover:-translate-y-0.5 cursor-default">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1 text-sm">1. Add People</h3>
                <p className="text-xs text-gray-600">Add everyone who shared the bill</p>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200 hover:shadow-md hover:border-purple-300 transition-all duration-300 hover:-translate-y-0.5 cursor-default">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
                  <ShoppingCart className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1 text-sm">2. Add Items</h3>
                <p className="text-xs text-gray-600">List items and who consumed them</p>
              </div>
              
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg p-4 border border-emerald-200 hover:shadow-md hover:border-emerald-300 transition-all duration-300 hover:-translate-y-0.5 cursor-default">
                <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-md">
                  <Calculator className="h-5 w-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1 text-sm">3. Get Results</h3>
                <p className="text-xs text-gray-600">See exactly who owes what</p>
              </div>
            </div>
          </div>
        )}


        {/* Three Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Participants */}
          <div className="space-y-6">
            <BillHeader
              participants={participants}
              onAddParticipant={handleAddParticipant}
              onRemoveParticipant={handleRemoveParticipant}
            />
            
            <AddItemForm participants={participants} onAddItem={handleAddItem} currency={currency} />
          </div>

          {/* Middle Column - Bill Items */}
          <div>
            <ItemList
              items={items}
              participants={participants}
              onRemoveItem={handleRemoveItem}
              onEditItem={handleEditItem}
              currency={currency}
              formatCurrency={formatCurrencyAmount}
            />
          </div>

          {/* Right Column - Settlement Summary */}
          <div>
            <SettlementSummary
              items={items}
              participants={participants}
              currency={currency}
              formatCurrency={formatCurrencyAmount}
            />
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-16 pt-8 pb-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl border border-gray-200 p-6 shadow-sm mb-6">
              <p className="text-gray-600 text-sm mb-2">
                Made with <span className="text-red-500">♥</span> for fair bill splitting
              </p>
              <p className="text-gray-400 text-xs mb-3">
                Everyone pays only for what they consume
              </p>
              <p className="text-gray-500 text-xs">
                Questions or feedback? Reach out at{' '}
                <a 
                  href="mailto:ritamf9@gmail.com" 
                  className="text-primary hover:text-primary/80 underline transition-colors"
                >
                  ritamf9@gmail.com
                </a>
              </p>
            </div>
            
            {/* SEO-friendly footer content */}
            <div className="text-left bg-white/40 backdrop-blur-sm rounded-xl border border-gray-200 p-6 text-sm text-gray-600">
              <h2 className="text-lg font-bold text-gray-900 mb-3">About FairSplit Bill Splitting Calculator</h2>
              <p className="mb-3">
                <strong>FairSplit</strong> is a free online bill splitting calculator designed to make group expense sharing fair and easy. 
                Unlike traditional bill splitters that divide everything equally, FairSplit calculates each person's share based on what they actually consumed.
              </p>
              <p className="mb-3">
                Perfect for <strong>restaurant bills</strong>, <strong>group dinners</strong>, <strong>shared groceries</strong>, and any situation where expenses need to be divided fairly. 
                Our calculator supports 30+ currencies and works completely offline as a Progressive Web App.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Key Features:</h3>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Fair bill splitting based on consumption</li>
                    <li>Multi-currency support (USD, EUR, GBP, INR, etc.)</li>
                    <li>Automatic settlement calculations</li>
                    <li>Export summaries as TXT or JSON</li>
                    <li>No signup or registration required</li>
                    <li>Works offline - PWA enabled</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">How It Works:</h3>
                  <ul className="list-disc list-inside space-y-1 text-xs">
                    <li>Add all participants to the bill</li>
                    <li>Enter items with prices and who consumed them</li>
                    <li>See instant calculations of who owes what</li>
                    <li>Get clear payment instructions</li>
                    <li>Export or share the final summary</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
    </>
  );
};

export default Index;
