import { useState, useEffect, useCallback } from "react";
import { type BillItem } from "@/components/ItemList";
import {
    formatCurrency,
    sanitizeMonetaryData,
    cleanStorageData,
    sumAmounts,
    divideAmount,
    CURRENCIES,
    type Currency
} from "@/utils/currency";
import { cleanAllStorageData } from "@/utils/storageCleanup";
import { useToast } from "@/components/ui/use-toast";

export const useBillState = () => {
    const [participants, setParticipants] = useState<string[]>([]);
    const [items, setItems] = useState<BillItem[]>([]);
    const [currency, setCurrency] = useState<Currency>(CURRENCIES.find(c => c.code === 'INR') || CURRENCIES[0]);
    const { toast } = useToast();

    const formatCurrencyCallback = useCallback(
        (amount: number) => formatCurrency(amount, currency),
        [currency]
    );

    // Auto-save & Restore
    useEffect(() => {
        cleanStorageData('fairsplit-data');
        const savedData = localStorage.getItem('fairsplit-data');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                const sanitizedData = sanitizeMonetaryData(parsed) as {
                    participants?: string[];
                    items?: BillItem[];
                    currency?: { code: string; symbol: string; name: string };
                };
                const { participants: savedParticipants, items: savedItems, currency: savedCurrency } = sanitizedData;

                setParticipants(savedParticipants || []);
                if (savedCurrency) {
                    const foundCurrency = CURRENCIES.find(c => c.code === savedCurrency.code);
                    if (foundCurrency) setCurrency(foundCurrency);
                }

                const updatedItems = (savedItems || []).map((item: BillItem) => {
                    let sanitizedPrice = item.price;
                    sanitizedPrice = Math.round((sanitizedPrice + Number.EPSILON) * 100) / 100;
                    const nearestWhole = Math.round(sanitizedPrice);
                    if (Math.abs(sanitizedPrice - nearestWhole) < 0.01) sanitizedPrice = nearestWhole;

                    return {
                        ...item,
                        price: sanitizedPrice,
                        participantsAtTime: item.participantsAtTime || savedParticipants || []
                    };
                });

                setItems(updatedItems);
                if (savedParticipants?.length > 0 || savedItems?.length > 0) {
                    toast({ title: "Data restored", description: "Your previous session has been restored." });
                }
            } catch (error) {
                console.error('Failed to restore data:', error);
                localStorage.removeItem('fairsplit-data');
            }
        }
    }, [toast]);

    useEffect(() => {
        if (participants.length > 0 || items.length > 0 || currency.code !== 'INR') {
            const sanitizedItems = items.map(item => ({
                ...item,
                price: Math.round((item.price + Number.EPSILON) * 100) / 100
            }));
            localStorage.setItem('fairsplit-data', JSON.stringify({ participants, items: sanitizedItems, currency }));
        }
    }, [participants, items, currency]);

    // Actions
    const addParticipant = useCallback((name: string) => {
        if (participants.includes(name)) {
            toast({ title: "Duplicate participant", description: "This participant already exists.", variant: "destructive" });
            return;
        }
        setParticipants(prev => [...prev, name]);
        toast({ title: "Participant added", description: `${name} has been added.` });
    }, [participants, toast]);

    const removeParticipant = useCallback((name: string) => {
        setParticipants(prev => prev.filter((p) => p !== name));
        setItems(prev => prev.map((item) => ({
            ...item,
            assignedTo: item.assignedTo.filter((p) => p !== name),
        }))
        );
        toast({ title: "Participant removed", description: `${name} has been removed.` });
    }, [toast]);

    const addItem = useCallback((item: Omit<BillItem, "id">) => {
        const sanitizedItem = {
            ...item,
            price: Math.round((item.price + Number.EPSILON) * 100) / 100,
            id: crypto.randomUUID()
        };
        setItems(prev => [...prev, sanitizedItem]);
        toast({ title: "Item added", description: `${sanitizedItem.name} has been added.` });
    }, [toast]);

    const removeItem = useCallback((id: string) => {
        setItems(prev => {
            const itemToRemove = prev.find(i => i.id === id);
            if (itemToRemove) toast({ title: "Item removed", description: `${itemToRemove.name} has been removed.` });
            return prev.filter((item) => item.id !== id);
        });
    }, [toast]);

    const editItem = useCallback((id: string, updatedItem: Partial<BillItem>) => {
        setItems(prev => prev.map(item => item.id === id ? { ...item, ...updatedItem } : item));
        toast({ title: "Item updated", description: "Item details have been updated." });
    }, [toast]);

    const updateCurrency = useCallback((newCurrency: Currency) => {
        setCurrency(newCurrency);
        toast({ title: "Currency changed", description: `Currency changed to ${newCurrency.name} (${newCurrency.symbol})` });
    }, [toast]);

    const clearAll = useCallback(() => {
        setParticipants([]);
        setItems([]);
        localStorage.removeItem('fairsplit-data');
        toast({ title: "All data cleared", description: "Started fresh with a new bill." });
    }, [toast]);

    const fixPrecision = useCallback(() => {
        setItems(prev => {
            const cleanedItems = prev.map(item => {
                const originalPrice = item.price;
                let roundedPrice = Math.round((originalPrice + Number.EPSILON) * 100) / 100;
                const nearestHundred = Math.round(originalPrice / 100) * 100;
                const nearestTen = Math.round(originalPrice / 10) * 10;
                const nearestOne = Math.round(originalPrice);

                if (Math.abs(originalPrice - nearestHundred) < 0.02) roundedPrice = nearestHundred;
                else if (Math.abs(originalPrice - nearestTen) < 0.02) roundedPrice = nearestTen;
                else if (Math.abs(originalPrice - nearestOne) < 0.02) roundedPrice = nearestOne;

                return { ...item, price: roundedPrice };
            });

            const cleanedData = { participants, items: cleanedItems, currency };
            localStorage.setItem('fairsplit-data', JSON.stringify(cleanedData));
            localStorage.removeItem('fairsplit-data-backup');
            cleanAllStorageData();
            return cleanedItems;
        });
        toast({ title: "Prices fixed!", description: `Precision issues fixed. Reloading...` });
        setTimeout(() => window.location.reload(), 1000);
    }, [participants, currency, toast]);

    // Export Logic
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

    const generateSummary = useCallback(() => {
        const billTotal = sumAmounts(items.map(item => item.price));
        const date = new Date().toLocaleDateString();

        // Calculate shares logic similar to SettlementSummary or previous implementation
        const shares: { [key: string]: { consumed: number; paid: number; balance: number } } = {};
        participants.forEach(p => { shares[p] = { consumed: 0, paid: 0, balance: 0 }; });

        items.forEach(item => {
            const assignedTo = item.assignedTo.length === 0 ? item.participantsAtTime : item.assignedTo;
            const dividedAmounts = divideAmount(item.price, assignedTo.length);
            assignedTo.forEach((participant, index) => {
                if (shares[participant]) shares[participant].consumed += dividedAmounts[index] || 0;
            });
            if (shares[item.paidBy]) shares[item.paidBy].paid += item.price;
        });

        Object.keys(shares).forEach(participant => {
            shares[participant].balance = Math.round((shares[participant].paid - shares[participant].consumed + Number.EPSILON) * 100) / 100;
        });

        // Build String
        let summary = `FAIRSPLIT BILL SUMMARY\n`;
        summary += `Date: ${date}\n`;
        summary += `Currency: ${currency.name} (${currency.symbol})\n`;
        summary += `Total Bill: ${formatCurrencyCallback(billTotal)}\n`;
        summary += `Participants: ${participants.join(', ')}\n\n`;

        // Items
        summary += `ITEMS BREAKDOWN:\n${'='.repeat(50)}\n`;
        items.forEach(item => {
            const assignedTo = item.assignedTo.length === 0 ? item.participantsAtTime : item.assignedTo;
            const dividedAmounts = divideAmount(item.price, assignedTo.length);
            const perPerson = dividedAmounts.map(a => formatCurrencyCallback(a)).join(', ');
            summary += `${item.name}: ${formatCurrencyCallback(item.price)}\n`;
            summary += `  Paid by: ${item.paidBy}\n  Shared with: ${assignedTo.join(', ')}\n  Per person: ${perPerson}\n\n`;
        });

        // Settlement
        summary += `SETTLEMENT SUMMARY:\n${'='.repeat(50)}\n`;
        Object.entries(shares).forEach(([name, share]) => {
            summary += `${name}:\n  Consumed: ${formatCurrencyCallback(share.consumed)}\n  Paid: ${formatCurrencyCallback(share.paid)}\n` +
                `  Balance: ${share.balance >= 0 ? '+' : '-'}${formatCurrencyCallback(Math.abs(share.balance))}\n\n`;
        });

        // Instructions
        const debtors = Object.entries(shares).filter(([_, s]) => s.balance < 0);
        const creditors = Object.entries(shares).filter(([_, s]) => s.balance > 0);

        if (debtors.length > 0) {
            summary += `PAYMENT INSTRUCTIONS:\n${'='.repeat(50)}\n`;
            debtors.forEach(([debtor, debtorShare]) => {
                creditors.forEach(([creditor, creditorShare]) => {
                    if (creditorShare.balance > 0 && debtorShare.balance < 0) {
                        const payment = Math.min(Math.abs(debtorShare.balance), creditorShare.balance);
                        if (payment > 0.01) {
                            summary += `${debtor} pays ${creditor}: ${formatCurrencyCallback(payment)}\n`;
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
    }, [items, participants, currency, formatCurrencyCallback]);

    const exportData = useCallback((format: 'json' | 'summary') => {
        const timestamp = new Date().toISOString().split('T')[0];
        if (format === 'json') {
            const data = { participants, items, currency, timestamp: new Date().toISOString() };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            downloadFile(blob, `fairsplit-backup-${timestamp}.json`);
            toast({ title: "Backup exported", description: "Bill data backup downloaded as JSON file." });
        } else if (format === 'summary') {
            const summaryContent = generateSummary();
            const BOM = '\uFEFF';
            const blob = new Blob([BOM + summaryContent], { type: 'text/plain;charset=utf-8' });
            downloadFile(blob, `fairsplit-summary-${timestamp}.txt`);
            toast({ title: "Summary exported", description: "Bill summary exported as text file." });
        }
    }, [participants, items, currency, generateSummary, toast]);

    return {
        state: { participants, items, currency },
        actions: {
            addParticipant, removeParticipant,
            addItem, removeItem, editItem,
            setCurrency: updateCurrency,
            clearAll, fixPrecision, exportData
        },
        helpers: { formatCurrency: formatCurrencyCallback }
    };
};
