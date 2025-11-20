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
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center gap-1"
        >
          <Edit2 className="h-4 w-4" />
          <span className="text-xs hidden sm:inline">Edit</span>
        </Button>
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

export const ItemList = ({ items, participants, onRemoveItem, onEditItem, currency, formatCurrency }: ItemListProps) => {
  // Calculate total using precise sum
  const totalAmount = sumAmounts(items.map(item => item.price));
  const [showEditHint, setShowEditHint] = useState(() => {
    // Show hint if user has items but hasn't seen the hint before
    return items.length > 0 && !localStorage.getItem('fairsplit-edit-hint-seen');
  });

  const isActive = items.length > 0;

  return (
    <Card className={`p-4 sm:p-6 bg-white border-2 shadow-sm transition-all duration-300 ${
      isActive 
        ? 'border-gray-200 hover:border-gray-300' 
        : 'border-gray-200 opacity-60'
    }`}>
      <div className="flex items-center gap-2.5 mb-5">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-md transition-all duration-300 ${
          isActive 
            ? 'bg-gradient-to-br from-primary to-purple-600' 
            : 'bg-gray-400'
        }`}>
          <Receipt className="h-4 w-4 text-white" />
        </div>
        <div className="flex-1">
          <h2 className={`text-base font-bold transition-colors duration-300 ${
            isActive ? 'text-primary' : 'text-gray-900'
          }`}>Bill Items</h2>
          <p className="text-xs text-gray-600">
            {items.length === 0 ? "No items added yet" : `${items.length} items • Total: ${formatCurrency(totalAmount)}`}
          </p>
          {items.length > 0 && (
            <div className="flex items-center gap-2 mt-1">
              <Info className="h-3 w-3 text-blue-500" />
              <p className="text-xs text-blue-600">
                💡 Click the edit icon to change who consumed each item
              </p>
            </div>
          )}
        </div>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
          <ShoppingCart className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 font-medium">No items added yet</p>
          <p className="text-sm text-gray-400">Start adding items to split the bill fairly</p>
        </div>
      ) : (
        <div className="space-y-3">
          {/* First-time user hint */}
          {showEditHint && items.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Edit2 className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-blue-900 mb-1">💡 Pro Tip: Edit Items</h4>
                  <p className="text-sm text-blue-700 mb-2">
                    Click the "Edit" button on any item to change who consumed it. Perfect for when someone joins late or didn't have certain items!
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setShowEditHint(false);
                      localStorage.setItem('fairsplit-edit-hint-seen', 'true');
                    }}
                    className="text-blue-600 hover:text-blue-700 text-xs p-0 h-auto"
                  >
                    Got it, don't show again
                  </Button>
                </div>
              </div>
            </div>
          )}
          
          {items.map((item, index) => {
            // Use participantsAtTime for correct count when shared by everyone
            const assignedTo = item.assignedTo.length === 0 ? item.participantsAtTime : item.assignedTo;
            const assignedCount = assignedTo.length;
            // Calculate share per person using precise division
            const dividedAmounts = assignedCount > 0 ? divideAmount(item.price, assignedCount) : [0];
            const sharePerPerson = dividedAmounts.length > 0 ? dividedAmounts[0] : 0;
            const isFirstItem = index === 0;

            return (
              <div key={item.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-gray-900">{item.name}</h3>
                      <span className="text-lg font-bold text-primary">
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <User className="h-3 w-3" />
                        <span>Paid by: {item.paidBy}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.assignedTo.length === 0 || item.assignedTo.length > 1 ? (
                          <Users className="h-3 w-3" />
                        ) : (
                          <User className="h-3 w-3" />
                        )}
                        <span>
                          Shared with: {item.assignedTo.length === 0 ? `Everyone (${item.participantsAtTime.join(", ")})` : item.assignedTo.join(", ")}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-3 w-3" />
                        <span>Per person: {formatCurrency(sharePerPerson)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className={isFirstItem && showEditHint ? "animate-pulse" : ""}>
                          <EditItemDialog
                            item={item}
                            participants={participants}
                            onSave={(updatedItem) => onEditItem(item.id, updatedItem)}
                            currency={currency}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Change who consumed this item</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveItem(item.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Delete this item</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
