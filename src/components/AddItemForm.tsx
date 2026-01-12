import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, ShoppingCart, Users, User, AlertCircle } from "lucide-react";
import { BillItem } from "./ItemList";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { parseCurrency, formatCurrency as formatCurrencyUtil, divideAmount } from "@/utils/currency";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import { cn } from "@/lib/utils";

// Helper function that matches the currency utility parsing
const parseCurrencyValue = (val: string) => parseCurrency(val);

const formSchema = z.object({
  itemName: z.string().min(2, "Item name must be at least 2 characters").max(50),
  itemPrice: z.string().refine((val) => {
    const parsed = parseCurrencyValue(val);
    return parsed > 0;
  }, "Price must be greater than 0"),
  paidBy: z.string().min(1, "Please select who paid"),
  isSharedByAll: z.boolean().default(true),
  selectedParticipants: z.array(z.string()).default([]),
}).refine((data) => {
  if (!data.isSharedByAll && data.selectedParticipants.length === 0) {
    return false;
  }
  return true;
}, {
  message: "Select at least one participant",
  path: ["selectedParticipants"],
});

type FormValues = z.infer<typeof formSchema>;

interface AddItemFormProps {
  participants: string[];
  onAddItem: (item: Omit<BillItem, "id">) => void;
  currency: { code: string; symbol: string; name: string };
}

export const AddItemForm = ({ participants, onAddItem, currency }: AddItemFormProps) => {
  // We keep a separate state for split preview to avoid expensive re-renders or complex form logic
  // for just a visual hint. But accessing form values is better.
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      itemName: "",
      itemPrice: "",
      paidBy: "",
      isSharedByAll: true,
      selectedParticipants: [],
    },
  });

  // Watch values for calculation previews
  const watchedPrice = form.watch("itemPrice");
  const watchedIsSharedByAll = form.watch("isSharedByAll");
  const watchedSelectedParticipants = form.watch("selectedParticipants");

  const onSubmit = (values: FormValues) => {
    const price = parseCurrencyValue(values.itemPrice);

    // Double-check: ensure price is properly rounded before adding
    const sanitizedPrice = Math.round((price + Number.EPSILON) * 100) / 100;

    onAddItem({
      name: values.itemName.trim(),
      price: sanitizedPrice,
      assignedTo: values.isSharedByAll ? [] : values.selectedParticipants,
      paidBy: values.paidBy,
      participantsAtTime: [...participants],
    });

    // Reset form but keep some logical defaults if needed, or full reset
    form.reset({
      itemName: "",
      itemPrice: "",
      paidBy: "", // Maybe keep the same payer? Standard UX to clear though.
      isSharedByAll: true,
      selectedParticipants: [],
    });
  };

  const toggleParticipant = (participant: string, currentSelected: string[], onChange: (val: string[]) => void) => {
    if (currentSelected.includes(participant)) {
      onChange(currentSelected.filter((p) => p !== participant));
    } else {
      onChange([...currentSelected, participant]);
    }
  };

  const isActive = participants.length > 0;

  if (participants.length === 0) {
    return (
      <div className="p-8 text-center bg-white rounded-xl border border-dashed border-border/60">
        <ShoppingCart className="h-8 w-8 text-neutral-300 mx-auto mb-3" />
        <h3 className="text-sm font-semibold text-neutral-900">Add Items</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-[200px] mx-auto">
          Start by adding participants above, then you can add items here.
        </p>
      </div>
    );
  }

  // Calculate split preview
  const splitCount = watchedIsSharedByAll ? participants.length : watchedSelectedParticipants.length;
  const priceValue = parseCurrencyValue(watchedPrice);
  const splitAmount = splitCount > 0 && priceValue > 0
    ? divideAmount(priceValue, splitCount)[0]
    : 0;

  return (
    <div className="p-6 bg-white animate-fade-in">
      <div className="mb-6">
        <h2 className="text-sm font-semibold tracking-wide uppercase text-muted-foreground mb-1">Add New Item</h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-4">
            <FormField
              control={form.control}
              name="itemName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Item name (e.g. Pizza)"
                      {...field}
                      className="h-12 text-lg bg-transparent border-0 border-b border-border/60 rounded-none px-0 focus-visible:ring-0 focus-visible:border-primary placeholder:text-muted-foreground/50 transition-colors"
                      autoComplete="off"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="itemPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-muted-foreground">Price ({currency.symbol})</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        inputMode="decimal"
                        placeholder="0.00"
                        {...field}
                        className="h-10 font-mono text-base bg-neutral-50 border-transparent focus:bg-white focus:border-border transition-colors"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="paidBy"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs text-muted-foreground">Paid by</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="h-10 bg-neutral-50 border-transparent focus:bg-white focus:border-border transition-colors">
                          <SelectValue placeholder="Select..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {participants.map((participant) => (
                          <SelectItem key={participant} value={participant}>
                            {participant}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="pt-2">
            <FormField
              control={form.control}
              name="isSharedByAll"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel className="text-xs text-muted-foreground block">Applies to</FormLabel>
                  <div className="grid grid-cols-2 gap-3">
                    <div
                      className={cn(
                        "cursor-pointer rounded-lg border p-3 flex items-center justify-center gap-2 transition-all text-sm font-medium",
                        field.value
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-white border-border/60 text-muted-foreground hover:bg-neutral-50 hover:border-border"
                      )}
                      onClick={() => field.onChange(true)}
                    >
                      <Users className="h-4 w-4" />
                      <span>Everyone</span>
                    </div>

                    <div
                      className={cn(
                        "cursor-pointer rounded-lg border p-3 flex items-center justify-center gap-2 transition-all text-sm font-medium",
                        !field.value
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-white border-border/60 text-muted-foreground hover:bg-neutral-50 hover:border-border"
                      )}
                      onClick={() => field.onChange(false)}
                    >
                      <User className="h-4 w-4" />
                      <span>Specific</span>
                    </div>
                  </div>
                </FormItem>
              )}
            />

            {!watchedIsSharedByAll && (
              <div className="animate-in fade-in slide-in-from-top-1 px-1 py-3">
                <FormField
                  control={form.control}
                  name="selectedParticipants"
                  render={() => (
                    <FormItem>
                      <div className="flex flex-wrap gap-2">
                        {participants.map((participant) => (
                          <FormField
                            key={participant}
                            control={form.control}
                            name="selectedParticipants"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={participant}
                                  className="space-y-0"
                                >
                                  <FormControl>
                                    <div
                                      className={cn(
                                        "px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-all border select-none",
                                        field.value?.includes(participant)
                                          ? "bg-neutral-900 text-white border-neutral-900"
                                          : "bg-white text-muted-foreground border-border hover:border-neutral-400"
                                      )}
                                      onClick={() => {
                                        if (field.value?.includes(participant)) {
                                          field.onChange(field.value?.filter((value) => value !== participant));
                                        } else {
                                          field.onChange([...(field.value || []), participant]);
                                        }
                                      }}
                                    >
                                      {participant}
                                    </div>
                                  </FormControl>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full h-12 text-base bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 rounded-lg"
          >
            Add Item
          </Button>
        </form>
      </Form>
    </div>
  );
};
