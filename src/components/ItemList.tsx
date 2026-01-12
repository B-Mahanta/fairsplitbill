import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2, Users, User, Receipt, DollarSign, ShoppingCart, Edit2, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useState } from "react";
import { divideAmount, sumAmounts, formatCurrency as formatCurrencyUtil } from "@/utils/currency";

export interface BillItem {
  id: string;
  name: string;
  price: number;
  assignedTo: string[]; // Empty array means all participants AT THE TIME OF CREATION
  paidBy: string; // Who paid for this item
  participantsAtTime: string[]; // Participants who existed when this item was added
}

interface ItemListProps {
  items: BillItem[];
  participants: string[];
  onRemoveItem: (id: string) => void;
  onEditItem: (id: string, updatedItem: Partial<BillItem>) => void;
  currency: { code: string; symbol: string; name: string };
  formatCurrency: (amount: number) => string;
}

const EditItemDialog = ({ item, participants, onSave, currency }: {
  item: BillItem;
  participants: string[];
  onSave: (updatedItem: Partial<BillItem>) => void;
  currency: { code: string; symbol: string; name: string };
}) => {
  const [isSharedByAll, setIsSharedByAll] = useState(item.assignedTo.length === 0);
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>(
    item.assignedTo.length === 0 ? item.participantsAtTime : item.assignedTo
  );
  const [open, setOpen] = useState(false);

  const toggleParticipant = (participant: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(participant)
        ? prev.filter((p) => p !== participant)
        : [...prev, participant]
    );
  };

  const handleSave = () => {
    const updatedAssignedTo = isSharedByAll ? [] : selectedParticipants;
    const updatedParticipantsAtTime = isSharedByAll ? selectedParticipants : item.participantsAtTime;

    onSave({
      assignedTo: updatedAssignedTo,
      participantsAtTime: updatedParticipantsAtTime,
    });
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="inline-flex"> {/* Wrapper for TooltipTrigger to work with non-button child if needed, but Button is fine. Actually DialogTrigger expects a child. We need to be careful with nesting. */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center gap-1"
              >
                <Edit2 className="h-4 w-4" />
                <span className="text-xs">Edit</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent align="end">
              <p>Change participants & split</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Item: {item.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Price:</strong> {currency.symbol}{item.price} • <strong>Paid by:</strong> {item.paidBy}
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium text-gray-700">Who consumed this item?</Label>
            <div className="mt-2 space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="edit-shared-all"
                  checked={isSharedByAll}
                  onCheckedChange={(checked) => {
                    setIsSharedByAll(!!checked);
                    if (checked) {
                      setSelectedParticipants([...participants]);
                    }
                  }}
                />
                <Label htmlFor="edit-shared-all" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Shared by selected people
                </Label>
              </div>

              <div className="space-y-2 p-3 bg-gray-50 rounded-lg max-h-40 overflow-y-auto">
                <Label className="text-sm font-medium text-gray-600">Select participants:</Label>
                <div className="grid grid-cols-2 gap-2">
                  {participants.map((participant) => (
                    <div key={participant} className="flex items-center space-x-2">
                      <Checkbox
                        id={`edit-participant-${participant}`}
                        checked={selectedParticipants.includes(participant)}
                        onCheckedChange={() => toggleParticipant(participant)}
                      />
                      <Label htmlFor={`edit-participant-${participant}`} className="text-sm">
                        {participant}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {selectedParticipants.length > 0 && (
                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                  <strong>New split:</strong> {divideAmount(item.price, selectedParticipants.length).map(amount => formatCurrencyUtil(amount, currency)).join(', ')} per person
                  <br />
                  <strong>Participants:</strong> {selectedParticipants.join(", ")}
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} disabled={selectedParticipants.length === 0} className="flex-1">
              Save Changes
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};


import { memo } from "react";

// ... (other imports remain the same, I will use replace_file_content carefully or just rewrite the export line)

export const ItemList = memo(({ items, participants, onRemoveItem, onEditItem, currency, formatCurrency }: ItemListProps) => {
  // Calculate total using precise sum
  const totalAmount = sumAmounts(items.map(item => item.price));

  // ... rest of component
  return (
    // ... JSX
    <div className="bg-white rounded-xl border border-border/50 shadow-sm overflow-hidden animate-fade-in" aria-label="Bill Items List">
      <div className="p-6 border-b border-border/50 flex justify-between items-center bg-neutral-50/30">
        <div>
          <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Items</h2>
        </div>
        <div>
          {items.length > 0 && <span className="text-sm font-medium text-muted-foreground">{items.length} items</span>}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-12 px-6">
          <Receipt className="h-8 w-8 text-neutral-300 mx-auto mb-3" />
          <p className="text-sm text-neutral-900 font-medium">No items yet</p>
          <p className="text-xs text-muted-foreground max-w-xs mx-auto mt-1">
            Added items will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-border/50">
          {items.map((item, index) => {
            const assignedTo = item.assignedTo.length === 0 ? item.participantsAtTime : item.assignedTo;
            const assignedCount = assignedTo.length;
            const dividedAmounts = assignedCount > 0 ? divideAmount(item.price, assignedCount) : [0];
            const sharePerPerson = dividedAmounts.length > 0 ? dividedAmounts[0] : 0;

            return (
              <div key={item.id} className="group p-4 hover:bg-neutral-50/50 transition-colors flex items-start gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-medium text-neutral-900 truncate pr-2">{item.name}</h3>
                    <span className="font-mono font-medium text-neutral-900">
                      {formatCurrency(item.price)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs uppercase tracking-wider text-muted-foreground/70">Paid by</span>
                      <span className="font-medium text-neutral-700">{item.paidBy}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs uppercase tracking-wider text-muted-foreground/70">For</span>
                      <span className="font-medium text-neutral-700">
                        {item.assignedTo.length === 0 ? "Everyone" : (
                          item.assignedTo.length > 3 ? `${item.assignedTo.length} people` : item.assignedTo.join(", ")
                        )}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 ml-auto sm:ml-0">
                      <span className="text-xs uppercase tracking-wider text-muted-foreground/70">Split</span>
                      <span className="font-mono text-neutral-700">{formatCurrency(sharePerPerson)}/ea</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-1 self-center">
                  <EditItemDialog
                    item={item}
                    participants={participants}
                    onSave={(updatedItem) => onEditItem(item.id, updatedItem)}
                    currency={currency}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveItem(item.id)}
                    className="h-8 w-8 text-neutral-400 hover:text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}

          <div className="p-4 bg-neutral-50/50 flex justify-between items-center">
            <span className="text-sm font-medium text-muted-foreground">Total</span>
            <span className="font-mono font-bold text-lg text-primary">{formatCurrency(totalAmount)}</span>
          </div>
        </div>
      )}
    </div >
  );
});
