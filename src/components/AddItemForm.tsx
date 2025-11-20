import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, ShoppingCart, Users, User } from "lucide-react";
import { BillItem } from "./ItemList";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { parseCurrency, formatCurrency, divideAmount } from "@/utils/currency";

interface AddItemFormProps {
  participants: string[];
  onAddItem: (item: Omit<BillItem, "id">) => void;
  currency: { code: string; symbol: string; name: string };
}

export const AddItemForm = ({ participants, onAddItem, currency }: AddItemFormProps) => {
  const [itemName, setItemName] = useState("");
  const [itemPrice, setItemPrice] = useState("");
  const [selectedParticipants, setSelectedParticipants] = useState<string[]>([]);
  const [isSharedByAll, setIsSharedByAll] = useState(true);
  const [paidBy, setPaidBy] = useState("");

  const handleAdd = () => {
    const trimmedName = itemName.trim();
    const price = parseCurrency(itemPrice);
    // Use precise currency parsing to avoid floating point precision issues
    // This ensures consistent currency handling throughout the app
    
    if (trimmedName && price > 0 && paidBy) {
      // Double-check: ensure price is properly rounded before adding
      const sanitizedPrice = Math.round((price + Number.EPSILON) * 100) / 100;
      
      onAddItem({
        name: trimmedName,
        price: sanitizedPrice,
        assignedTo: isSharedByAll ? [] : selectedParticipants,
        paidBy: paidBy,
        participantsAtTime: [...participants], // Store current participants
      });
      setItemName("");
      setItemPrice("");
      setSelectedParticipants([]);
      setIsSharedByAll(true);
      setPaidBy("");
    }
  };

  const toggleParticipant = (participant: string) => {
    setSelectedParticipants((prev) =>
      prev.includes(participant)
        ? prev.filter((p) => p !== participant)
        : [...prev, participant]
    );
  };

  const isValidItem = itemName.trim().length > 0 && 
                     parseCurrency(itemPrice) > 0 && 
                     paidBy && 
                     (isSharedByAll || selectedParticipants.length > 0);

  const isActive = participants.length > 0;

  if (participants.length === 0) {
    return (
      <Card className="p-4 sm:p-6 bg-white border-2 border-gray-200 shadow-sm opacity-60">
        <div className="flex items-center gap-2.5 mb-5">
          <div className="w-8 h-8 bg-gray-400 rounded-lg flex items-center justify-center shadow-md">
            <ShoppingCart className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Add Item</h2>
            <p className="text-xs text-gray-600">Add participants first</p>
          </div>
        </div>
        
        <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50">
          <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-500 font-medium">Add participants first</p>
          <p className="text-sm text-gray-400">You need people to split items with</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-4 sm:p-6 bg-white border-2 shadow-sm transition-all duration-300 ${
      isActive 
        ? 'border-purple-400/40 ring-2 ring-purple-400/10 shadow-lg' 
        : 'border-gray-200 hover:border-gray-300'
    }`}>
      <div className="flex items-center gap-2.5 mb-5">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-md transition-all duration-300 ${
          isActive 
            ? 'bg-gradient-to-br from-purple-500 to-pink-600' 
            : 'bg-gray-400'
        }`}>
          <ShoppingCart className="h-4 w-4 text-white" />
        </div>
        <div>
          <h2 className={`text-base font-bold transition-colors duration-300 ${
            isActive ? 'text-purple-600' : 'text-gray-900'
          }`}>Add Item</h2>
          <p className="text-xs text-gray-600">Add items to split</p>
        </div>
        {isActive && (
          <span className="ml-auto text-[10px] bg-purple-600/10 text-purple-600 px-2 py-0.5 rounded-full font-semibold border border-purple-600/20">
            Next step
          </span>
        )}
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="itemName" className="text-sm font-medium text-gray-700">Item Name</Label>
          <Input
            id="itemName"
            placeholder="e.g., Pizza, Drinks..."
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="mt-1 w-full"
          />
        </div>

        <div>
          <Label htmlFor="itemPrice" className="text-sm font-medium text-gray-700">Price ({currency.symbol})</Label>
          <Input
            id="itemPrice"
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={itemPrice}
            onChange={(e) => {
              const value = e.target.value;
              // Allow empty or valid decimal numbers only
              if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
                setItemPrice(value);
              }
            }}
            onBlur={(e) => {
              // On blur, sanitize the value
              const value = e.target.value;
              if (value && !isNaN(parseFloat(value))) {
                const sanitized = parseCurrency(value);
                setItemPrice(sanitized.toString());
              }
            }}
            className="mt-1 w-full"
          />
        </div>

        <div>
          <Label htmlFor="paidBy" className="text-sm font-medium text-gray-700">Who paid for this item?</Label>
          <Select value={paidBy} onValueChange={setPaidBy}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select who paid..." />
            </SelectTrigger>
            <SelectContent>
              {participants.map((participant) => (
                <SelectItem key={participant} value={participant}>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    {participant}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="text-sm font-medium text-gray-700 mb-3 block">Who consumed this item?</Label>
          
          {/* Two clear options side by side */}
          <div className="grid grid-cols-1 gap-3 mb-3">
            <div 
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                isSharedByAll 
                  ? 'border-primary bg-primary/5 shadow-sm' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => {
                setIsSharedByAll(true);
                setSelectedParticipants([]);
              }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  isSharedByAll ? 'border-primary bg-primary' : 'border-gray-300'
                }`}>
                  {isSharedByAll && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">Everyone</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Split equally among all {participants.length} people
                  </p>
                </div>
              </div>
            </div>

            <div 
              className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                !isSharedByAll 
                  ? 'border-primary bg-primary/5 shadow-sm' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => {
                setIsSharedByAll(false);
                if (selectedParticipants.length === 0) {
                  setSelectedParticipants([...participants]);
                }
              }}
            >
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  !isSharedByAll ? 'border-primary bg-primary' : 'border-gray-300'
                }`}>
                  {!isSharedByAll && <div className="w-2 h-2 bg-white rounded-full" />}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span className="font-medium">Specific People</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Choose who consumed this item
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Individual selection - always visible but disabled when "everyone" is selected */}
          <div className={`space-y-2 p-3 rounded-lg border transition-all ${
            isSharedByAll 
              ? 'bg-gray-50 border-gray-200 opacity-60' 
              : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-center justify-between mb-2">
              <Label className={`text-sm font-medium ${
                isSharedByAll ? 'text-gray-400' : 'text-gray-700'
              }`}>
                {isSharedByAll ? 'All participants selected:' : 'Select participants:'}
              </Label>
              {!isSharedByAll && (
                <div className="flex gap-1">
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="sm" 
                    className="text-xs h-6 px-2"
                    onClick={() => setSelectedParticipants([...participants])}
                  >
                    All
                  </Button>
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="sm" 
                    className="text-xs h-6 px-2"
                    onClick={() => setSelectedParticipants([])}
                  >
                    None
                  </Button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              {participants.map((participant) => (
                <div key={participant} className="flex items-center space-x-2">
                  <Checkbox
                    id={`participant-${participant}`}
                    checked={isSharedByAll || selectedParticipants.includes(participant)}
                    disabled={isSharedByAll}
                    onCheckedChange={() => !isSharedByAll && toggleParticipant(participant)}
                  />
                  <Label 
                    htmlFor={`participant-${participant}`} 
                    className={`text-sm ${isSharedByAll ? 'text-gray-400' : 'text-gray-700'}`}
                  >
                    {participant}
                  </Label>
                </div>
              ))}
            </div>
            
            {!isSharedByAll && selectedParticipants.length > 0 && (
              <div className="mt-2 p-2 bg-white rounded border border-blue-200">
                <p className="text-xs text-blue-700">
                  <strong>Split:</strong> {itemPrice ? 
                    divideAmount(parseCurrency(itemPrice), selectedParticipants.length)
                      .map(amount => formatCurrency(amount, currency))
                      .join(', ') 
                    : formatCurrency(0, currency)} per person
                  ({selectedParticipants.length} people)
                </p>
              </div>
            )}
          </div>
        </div>

        <Button 
          onClick={handleAdd} 
          disabled={!isValidItem} 
          className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 py-6"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Item
        </Button>
      </div>
    </Card>
  );
};
