import { useEffect } from "react";
import { BillHeader } from "@/components/BillHeader";
import { ItemList } from "@/components/ItemList";
import { AddItemForm } from "@/components/AddItemForm";
import { SettlementSummary } from "@/components/SettlementSummary";
import { SEOHead } from "@/components/SEOHead";
import { SEOContent } from "@/components/SEOContent";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, FileText, Archive } from "lucide-react";
import { CURRENCIES, type Currency } from "@/utils/currency";
import { useBillState } from "@/hooks/useBillState";
import { logPerformanceMetrics, preloadCriticalResources, getDeviceInfo } from "@/utils/performance";

const Index = () => {
  const {
    state: { participants, items, currency },
    actions: {
      addParticipant, removeParticipant,
      addItem, removeItem, editItem,
      setCurrency, clearAll, exportData
    },
    helpers: { formatCurrency }
  } = useBillState();

  // Performance monitoring
  useEffect(() => {
    if (import.meta.env.DEV) {
      window.addEventListener('load', () => {
        setTimeout(() => {
          logPerformanceMetrics();
          const info = getDeviceInfo();
          console.log('Device Info:', info);
        }, 0);
      });
    }
  }, []);

  return (
    <>
      <SEOHead />
      <div className="min-h-screen bg-neutral-50/50 selection:bg-primary/10 selection:text-primary">
        {/* Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-border/40">
          <div className="max-w-5xl mx-auto px-4 md:px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-lg shadow-primary/20">
                <span className="text-white font-bold text-sm tracking-tighter">FS</span>
              </div>
              <div>
                <h1 className="text-sm font-bold tracking-tight text-primary">FairSplit</h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 gap-2 font-medium text-muted-foreground hover:text-primary">
                    <span className="font-mono text-xs">{currency.symbol}</span>
                    <span className="text-xs">{currency.code}</span>
                    <ChevronDown className="h-3 w-3 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 max-h-[300px]">
                  {CURRENCIES.map((curr) => (
                    <DropdownMenuItem
                      key={curr.code}
                      onClick={() => setCurrency(curr)}
                      className="justify-between"
                    >
                      <span className="flex items-center gap-2">
                        <span className="font-mono text-muted-foreground w-4 text-center">{curr.symbol}</span>
                        <span>{curr.code}</span>
                      </span>
                      {currency.code === curr.code && <div className="h-1.5 w-1.5 rounded-full bg-primary" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {(participants.length > 0 || items.length > 0) && (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="h-8 gap-2">
                        <span className="text-xs font-medium">Export</span>
                        <ChevronDown className="h-3 w-3 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => exportData('summary')}>
                        <FileText className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                        <span className="text-sm">Summary (TXT)</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => exportData('json')}>
                        <Archive className="h-3.5 w-3.5 mr-2 text-muted-foreground" />
                        <span className="text-sm">Backup (JSON)</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Button onClick={clearAll} variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-destructive hover:bg-destructive/5">
                    <span className="text-xs">Clear</span>
                  </Button>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-5xl mx-auto px-4 md:px-6 pt-24 pb-12 w-full">
          {/* Hero Section - Empty State */}
          {(participants.length === 0 && items.length === 0) && (
            <div className="max-w-lg mx-auto text-center py-20 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-primary mb-6">
                Split bills, <br />
                <span className="text-muted-foreground">fair and square.</span>
              </h2>
              <p className="text-lg text-muted-foreground mb-10 leading-relaxed max-w-sm mx-auto">
                The precision bill splitter for groups who value fairness over simplicity.
              </p>

              <div className="flex flex-col items-center gap-4">
                <Button
                  size="lg"
                  className="h-12 px-8 rounded-full shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all duration-300"
                  onClick={() => {
                    const participantInput = document.querySelector('input[placeholder*="Add person"]') as HTMLInputElement;
                    participantInput?.focus();
                  }}
                >
                  Start splitting
                </Button>
              </div>
            </div>
          )}

          {/* Core Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column - Input Configuration */}
            <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
              <BillHeader
                participants={participants}
                onAddParticipant={addParticipant}
                onRemoveParticipant={removeParticipant}
              />

              <div className="border border-border/50 rounded-xl bg-white shadow-sm overflow-hidden">
                <AddItemForm participants={participants} onAddItem={addItem} currency={currency} />
              </div>
            </div>

            {/* Right Column - Items & Summary */}
            <div className="lg:col-span-8 space-y-6">
              {(items.length > 0) && (
                <div className="rounded-xl border border-border/50 bg-white shadow-sm overflow-hidden min-h-[200px]">
                  <ItemList
                    items={items}
                    participants={participants}
                    onRemoveItem={removeItem}
                    onEditItem={editItem}
                    currency={currency}
                    formatCurrency={formatCurrency}
                  />
                </div>
              )}

              <section aria-label="Settlement Summary">
                <SettlementSummary
                  items={items}
                  participants={participants}
                  currency={currency}
                  formatCurrency={formatCurrency}
                />
              </section>
            </div>
          </div>

          <SEOContent />
        </main>

        <footer className="border-t border-border/40 bg-white/50 py-12">
          <div className="max-w-5xl mx-auto px-4 text-center">
            <p className="text-sm text-muted-foreground">
              FairSplit &copy; {new Date().getFullYear()} &middot; Crafted with precision.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
};

export default Index;
