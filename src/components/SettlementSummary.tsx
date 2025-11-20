import { Card } from "@/components/ui/card";
import { BillItem } from "./ItemList";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, DollarSign, Calculator, Users, TrendingUp, CheckCircle, Eye, EyeOff } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { divideAmount, sumAmounts, toCents, fromCents } from "@/utils/currency";

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

export const SettlementSummary = ({ items, participants, currency, formatCurrency }: SettlementSummaryProps) => {
  const [showDetailedView, setShowDetailedView] = useState(false);

  // Helper function for precise monetary calculations using cents
  const roundToTwo = (num: number): number => {
    return fromCents(toCents(num));
  };

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
      <Card className="p-4 sm:p-6 bg-white border-2 border-gray-200 shadow-sm opacity-60">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 bg-gray-400 rounded-lg flex items-center justify-center shadow-md">
            <Calculator className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Settlement Summary</h2>
            <p className="text-xs text-gray-600">Calculate fair splits</p>
          </div>
        </div>
        
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
          <Calculator className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 font-medium">Ready to calculate</p>
          <p className="text-sm text-gray-400">Add participants and items to see the settlement breakdown</p>
        </div>
      </Card>
    );
  }

  const hasPayments = paymentAdjustments.length > 0;

  return (
    <Card className={`p-4 sm:p-6 bg-white border-2 shadow-sm transition-all duration-300 ${
      isActive 
        ? 'border-emerald-400/40 ring-2 ring-emerald-400/10 shadow-lg' 
        : 'border-gray-200 hover:border-gray-300'
    }`}>
      <div className="flex items-center gap-2.5 mb-5">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-md transition-all duration-300 ${
          isActive 
            ? 'bg-gradient-to-br from-emerald-500 to-teal-600' 
            : 'bg-gray-400'
        }`}>
          <Calculator className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1">
          <h2 className={`text-base font-bold transition-colors duration-300 ${
            isActive ? 'text-emerald-600' : 'text-gray-900'
          }`}>Settlement Summary</h2>
          <p className="text-xs text-gray-600">
            {hasPayments ? `${paymentAdjustments.length} payments needed` : "All settled!"}
          </p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowDetailedView(!showDetailedView)}
          className="flex items-center gap-2"
        >
          {showDetailedView ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {showDetailedView ? "Simple" : "Details"}
        </Button>
      </div>
      
      <div className="space-y-4">
        <div className="bg-primary/10 p-4 rounded-lg border border-primary/20">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 flex items-center justify-center bg-primary/10 rounded text-primary font-bold text-sm">
                {currency.symbol}
              </div>
              <span className="font-medium text-gray-900">Total Bill</span>
            </div>
            <span className="text-2xl font-bold text-primary">{formatCurrency(billTotal)}</span>
          </div>
        </div>

        {hasPayments ? (
          <div>
            <h3 className="font-medium mb-3 text-gray-900">Payment Instructions</h3>
            <div className="space-y-2">
              {paymentAdjustments.map((adjustment, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-violet-50/80 to-purple-50/80 rounded-lg border border-violet-200/60 hover:border-violet-300/60 transition-colors">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="bg-white/90 text-violet-700 border border-violet-200/50 shadow-sm">
                      {adjustment.from}
                    </Badge>
                    <ArrowRight className="h-4 w-4 text-violet-500" />
                    <Badge variant="secondary" className="bg-white/90 text-violet-700 border border-violet-200/50 shadow-sm">
                      {adjustment.to}
                    </Badge>
                  </div>
                  <span className="font-bold text-violet-700 bg-white/60 px-3 py-1 rounded-full">
                    {formatCurrency(adjustment.amount)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-r from-emerald-50/80 to-teal-50/80 p-4 rounded-lg text-center border border-emerald-200/60">
            <CheckCircle className="h-6 w-6 text-emerald-600 mx-auto mb-2" />
            <p className="font-medium text-emerald-800">All Settled!</p>
            <p className="text-sm text-emerald-600">Everyone paid exactly what they consumed</p>
          </div>
        )}

        {showDetailedView && (
          <div>
            <h3 className="font-medium mb-3 text-gray-900 flex items-center gap-2">
              <Users className="h-4 w-4" />
              Individual Breakdown
            </h3>
          <div className="space-y-2">
            {shares.map((share) => {
              const EPSILON = 0.005; // 0.5 cents tolerance
              const isCreditor = share.netBalance > EPSILON;
              const isDebtor = share.netBalance < -EPSILON;
              const isEven = Math.abs(share.netBalance) <= EPSILON;
              
              return (
                <div key={share.name} className={`border rounded-lg p-4 transition-all hover:shadow-sm ${
                  isCreditor ? 'bg-gradient-to-r from-emerald-50/60 to-teal-50/60 border-emerald-200/50' : 
                  isDebtor ? 'bg-gradient-to-r from-rose-50/60 to-pink-50/60 border-rose-200/50' : 
                  'bg-gradient-to-r from-violet-50/60 to-purple-50/60 border-violet-200/50'
                }`}>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge variant={isCreditor ? "default" : "secondary"} 
                             className={
                               isCreditor ? "bg-emerald-600 text-white shadow-sm" : 
                               isDebtor ? "bg-white/90 text-rose-700 border border-rose-200/50" :
                               "bg-white/90 text-violet-700 border border-violet-200/50"
                             }>
                        {share.name}
                      </Badge>
                      {isCreditor && share.netBalance > EPSILON && (
                        <Badge variant="outline" className="text-xs border-emerald-500/50 text-emerald-700 bg-emerald-50/80">
                          OWED {formatCurrency(share.netBalance)}
                        </Badge>
                      )}
                      {isDebtor && (
                        <Badge variant="outline" className="text-xs border-rose-500/50 text-rose-700 bg-rose-50/80">
                          OWES {formatCurrency(-share.netBalance)}
                        </Badge>
                      )}
                      {isEven && (
                        <Badge variant="outline" className="text-xs border-violet-500/50 text-violet-700 bg-violet-50/80">
                          SETTLED
                        </Badge>
                      )}
                    </div>
                    <span className="font-bold text-gray-900 bg-white/60 px-3 py-1 rounded-full">{formatCurrency(share.total)}</span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-2">
                    <div className="flex justify-between items-center p-2 bg-white/50 rounded-md">
                      <span>Consumed:</span>
                      <span className="font-medium">{formatCurrency(share.consumed)}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-white/50 rounded-md">
                      <span>Paid for items:</span>
                      <span className="font-medium">{formatCurrency(share.paid)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        )}
      </div>
    </Card>
  );
};