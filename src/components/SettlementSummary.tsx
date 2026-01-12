import { Card } from "@/components/ui/card";
import { BillItem } from "./ItemList";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, DollarSign, Calculator, Users, TrendingUp, CheckCircle, Eye, EyeOff } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useState, memo } from "react";
import { divideAmount, sumAmounts, toCents, fromCents } from "@/utils/currency";
import { cn } from "@/lib/utils";

interface SettlementSummaryProps {
  items: BillItem[];
  participants: string[];
  currency: { code: string; symbol: string; name: string };
  formatCurrency: (amount: number) => string;
}

interface PersonShare {
  name: string;
  consumed: number; // What they ate/drank
  paid: number; // What they paid for
  total: number; // consumed amount
  netBalance: number; // paid - total (positive = owed, negative = owes)
}

export const SettlementSummary = memo(({ items, participants, currency, formatCurrency }: SettlementSummaryProps) => {
  const [showDetailedView, setShowDetailedView] = useState(false);

  // Helper function for precise monetary calculations using cents
  const roundToTwo = (num: number): number => {
    return fromCents(toCents(num));
  };
  // ... rest of component same as before, just closing the memo
  // I'll be safer and just return the component wrapped.

  // Calculate each person's share
  const calculateShares = (): PersonShare[] => {
    const shares: { [key: string]: PersonShare } = {};

    // Initialize shares for each participant
    participants.forEach((participant) => {
      shares[participant] = {
        name: participant,
        consumed: 0,
        paid: 0,
        total: 0,
        netBalance: 0,
      };
    });

    // Calculate what each person consumed using precise division
    items.forEach((item) => {
      // Use participantsAtTime if assignedTo is empty (shared by everyone at that time)
      const assignedTo = item.assignedTo.length === 0 ? item.participantsAtTime : item.assignedTo;

      // Use precise division to avoid floating-point errors
      const dividedAmounts = divideAmount(item.price, assignedTo.length);

      assignedTo.forEach((participant, index) => {
        if (shares[participant]) {
          shares[participant].consumed += dividedAmounts[index] || 0;
        }
      });

      // Track what each person paid
      if (shares[item.paidBy]) {
        shares[item.paidBy].paid += item.price;
      }
    });

    // Round all values at the end to avoid accumulating rounding errors
    participants.forEach((participant) => {
      shares[participant].consumed = roundToTwo(shares[participant].consumed);
      shares[participant].paid = roundToTwo(shares[participant].paid);
      shares[participant].total = shares[participant].consumed;
      shares[participant].netBalance = roundToTwo(shares[participant].paid - shares[participant].total);
    });

    return Object.values(shares);
  };

  const shares = calculateShares();
  // Calculate bill total with proper precision
  const billTotal = sumAmounts(items.map(item => item.price));

  // Calculate payment adjustments
  const calculatePaymentAdjustments = () => {
    const adjustments: { from: string; to: string; amount: number }[] = [];

    // Use a small epsilon for comparison to handle floating point precision
    const EPSILON = 0.005; // 0.5 cents tolerance

    const debtors = shares.filter(s => s.netBalance < -EPSILON).map(s => ({
      name: s.name,
      amount: roundToTwo(-s.netBalance)
    }));
    const creditors = shares.filter(s => s.netBalance > EPSILON).map(s => ({
      name: s.name,
      amount: roundToTwo(s.netBalance)
    }));

    const workingDebtors = [...debtors];
    const workingCreditors = [...creditors];

    let debtorIndex = 0;
    let creditorIndex = 0;

    while (debtorIndex < workingDebtors.length && creditorIndex < workingCreditors.length) {
      const debtor = workingDebtors[debtorIndex];
      const creditor = workingCreditors[creditorIndex];

      const paymentAmount = roundToTwo(Math.min(debtor.amount, creditor.amount));

      if (paymentAmount > EPSILON) {
        adjustments.push({
          from: debtor.name,
          to: creditor.name,
          amount: paymentAmount
        });
      }

      debtor.amount = roundToTwo(debtor.amount - paymentAmount);
      creditor.amount = roundToTwo(creditor.amount - paymentAmount);

      if (debtor.amount < EPSILON) debtorIndex++;
      if (creditor.amount < EPSILON) creditorIndex++;
    }

    return adjustments;
  };

  const paymentAdjustments = calculatePaymentAdjustments();

  const isActive = participants.length > 0 && items.length > 0;

  if (participants.length === 0 || items.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-border/60 shadow-sm p-8 text-center">
        <Calculator className="h-8 w-8 text-neutral-300 mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-neutral-900">Settlement</h3>
        <p className="text-xs text-muted-foreground mt-1">Calculations will appear here</p>
      </div>
    );
  }

  const hasPayments = paymentAdjustments.length > 0;

  return (
    <div className="bg-white rounded-xl shadow-xl shadow-neutral-200/50 border border-border/60 overflow-hidden animate-fade-in">
      <div className="p-6 pb-0">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-base font-bold text-primary">Settlement</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowDetailedView(!showDetailedView)}
            className="text-xs text-muted-foreground hover:text-primary"
          >
            {showDetailedView ? "Hide Details" : "Show Details"}
          </Button>
        </div>

        <div className="mb-8">
          <p className="text-sm text-muted-foreground font-medium mb-1">Total Bill</p>
          <div className="text-4xl font-bold tracking-tight text-primary font-display flex items-baseline gap-1">
            <span className="text-2xl text-muted-foreground font-medium self-start mt-1">{currency.symbol}</span>
            {formatCurrency(billTotal).replace(/[^0-9.,]/g, '')}
          </div>
        </div>
      </div>

      <div className="bg-neutral-50/50 p-6 border-t border-border/50">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Payments Required</h3>

        {hasPayments ? (
          <ul className="space-y-3">
            {paymentAdjustments.map((adjustment, index) => (
              <li key={index} className="flex items-center justify-between bg-white p-3 rounded-lg border border-border/40 shadow-sm">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-sm text-neutral-900">{adjustment.from}</span>
                  <ArrowRight className="h-3 w-3 text-muted-foreground/50" />
                  <span className="font-medium text-sm text-neutral-900">{adjustment.to}</span>
                </div>
                <span className="font-mono font-bold text-sm text-primary">
                  {formatCurrency(adjustment.amount)}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <div className="flex items-center justify-center p-4 bg-emerald-50/50 border border-emerald-100 rounded-lg text-emerald-700 text-sm font-medium">
            <CheckCircle className="h-4 w-4 mr-2" />
            All settled up!
          </div>
        )}
      </div>

      {showDetailedView && (
        <div className="p-6 border-t border-border/50 animate-in slide-in-from-top-2">
          <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-4">Breakdown</h3>
          <div className="space-y-3">
            {shares.map((share) => {
              const EPSILON = 0.005;
              const isCreditor = share.netBalance > EPSILON;
              const isDebtor = share.netBalance < -EPSILON;

              return (
                <div key={share.name} className="flex items-center justify-between text-sm py-2 border-b border-border/40 last:border-0">
                  <div className="flex flex-col">
                    <span className="font-medium text-neutral-900">{share.name}</span>
                    <span className="text-xs text-muted-foreground">Consumed: {formatCurrency(share.consumed)}</span>
                  </div>
                  <div className="text-right">
                    <span className={cn(
                      "font-mono font-medium block",
                      isCreditor ? "text-emerald-600" : isDebtor ? "text-red-600" : "text-muted-foreground"
                    )}>
                      {isCreditor ? "+" : ""}{formatCurrency(share.netBalance)}
                    </span>
                    <span className="text-xs text-muted-foreground block">
                      Paid: {formatCurrency(share.paid)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  );
});