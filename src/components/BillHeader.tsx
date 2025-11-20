import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { X, UserPlus, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface BillHeaderProps {
  participants: string[];
  onAddParticipant: (name: string) => void;
  onRemoveParticipant: (name: string) => void;
}

export const BillHeader = ({ participants, onAddParticipant, onRemoveParticipant }: BillHeaderProps) => {
  const [newParticipant, setNewParticipant] = useState("");

  const handleAdd = () => {
    const trimmedName = newParticipant.trim();
    if (trimmedName && !participants.includes(trimmedName)) {
      onAddParticipant(trimmedName);
      setNewParticipant("");
    }
  };

  const isActive = participants.length === 0;

  return (
    <Card className={`p-4 sm:p-6 bg-white border-2 shadow-sm transition-all duration-300 ${
      isActive 
        ? 'border-primary/40 ring-2 ring-primary/10 shadow-lg' 
        : 'border-gray-200 hover:border-gray-300'
    }`}>
      <div className="flex items-center gap-2.5 mb-5">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-md transition-all duration-300 ${
          isActive 
            ? 'bg-gradient-to-br from-primary to-purple-600' 
            : 'bg-gray-400'
        }`}>
          <Users className="h-4 w-4 text-white" />
        </div>
        <div>
          <h2 className={`text-base font-bold transition-colors duration-300 ${
            isActive ? 'text-primary' : 'text-gray-900'
          }`}>Participants</h2>
          <p className="text-xs text-gray-600">Add people to split with</p>
        </div>
        {isActive && (
          <span className="ml-auto text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold border border-primary/20">
            Start here
          </span>
        )}
      </div>
      
      <div className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-gray-700 mb-2 block">Add Participant</Label>
          <div className="flex gap-2">
            <Input
              placeholder="Enter name (min 2 ch)"
              value={newParticipant}
              onChange={(e) => setNewParticipant(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              className="flex-1 min-w-0"
            />
            <Button 
              onClick={handleAdd} 
              disabled={!newParticipant.trim()}
              className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 text-white font-semibold shadow-md hover:shadow-lg transition-all duration-200 flex-shrink-0 px-3 sm:px-4"
            >
              <UserPlus className="h-4 w-4 sm:mr-1" />
              <span className="hidden sm:inline">Add</span>
            </Button>
          </div>
        </div>

        {participants.length === 0 ? (
          <div className="text-center py-8 border-2 border-dashed border-gray-200 rounded-lg">
            <Users className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500 font-medium">Welcome to FairSplit!</p>
            <p className="text-sm text-gray-400 mb-3">Start by adding people who shared the bill</p>
            <div className="text-xs text-gray-400 bg-gray-50 p-2 rounded">
              💡 Tip: Add everyone first, then add items they consumed
            </div>
          </div>
        ) : (
          <div>
            <Label className="text-sm font-medium text-gray-700 mb-2 block">
              Current Participants
            </Label>
            <div className="flex flex-wrap gap-2">
              {participants.map((participant) => (
                <Badge
                  key={participant}
                  variant="secondary"
                  className="px-3 py-1 cursor-pointer hover:bg-red-100 bg-gray-100 text-gray-700"
                  onClick={() => onRemoveParticipant(participant)}
                >
                  {participant}
                  <X className="h-3 w-3 ml-2" />
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};
