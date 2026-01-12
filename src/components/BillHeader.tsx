import { useState, memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface BillHeaderProps {
  participants: string[];
  onAddParticipant: (name: string) => void;
  onRemoveParticipant: (name: string) => void;
}

export const BillHeader = memo(({ participants, onAddParticipant, onRemoveParticipant }: BillHeaderProps) => {
  const [newParticipant, setNewParticipant] = useState("");

  const handleAdd = () => {
    const trimmedName = newParticipant.trim();
    if (trimmedName && !participants.includes(trimmedName)) {
      onAddParticipant(trimmedName);
      setNewParticipant("");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground mb-4">Participants</h2>

        <div className="flex gap-2 mb-4">
          <Input
            placeholder="Add person..."
            value={newParticipant}
            onChange={(e) => setNewParticipant(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            className="h-10 bg-white border-border/60 focus:ring-primary/20 transition-all font-medium"
          />
          <Button
            onClick={handleAdd}
            disabled={!newParticipant.trim()}
            size="icon"
            className="h-10 w-10 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground shadow-sm transition-all"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </div>

        {participants.length === 0 ? (
          <div className="text-center py-6 border border-dashed border-border/60 rounded-lg bg-neutral-50/50">
            <p className="text-xs text-muted-foreground">Add people to start splitting</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-1">
            {participants.map((participant) => (
              <Badge
                key={participant}
                variant="secondary"
                className="pl-3 pr-1 py-1.5 h-8 gap-1 bg-white border border-border/50 hover:bg-neutral-50 hover:border-border text-foreground transition-all cursor-default group"
              >
                <span className="text-sm font-medium">{participant}</span>
                <button
                  onClick={() => onRemoveParticipant(participant)}
                  className="h-5 w-5 rounded-full flex items-center justify-center hover:bg-neutral-200 text-muted-foreground hover:text-foreground transition-colors ml-1"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    </div>
  );
});
