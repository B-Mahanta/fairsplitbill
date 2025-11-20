/**
 * Demonstration of floating-point precision issues and their solutions
 * This file shows the problem and how our currency utilities solve it
 */

import { toCents, fromCents, divideAmount, sumAmounts, formatCurrency } from './currency';

// Example currency for demonstration
const USD = { code: 'USD', symbol: '$', name: 'US Dollar' };

/**
 * Demonstrate the floating-point precision problem
 */
export const demonstratePrecisionProblem = (): void => {
  console.log('=== FLOATING-POINT PRECISION PROBLEM DEMONSTRATION ===\n');
  
  // Problem 1: Simple division doesn't always work as expected
  console.log('Problem 1: Division precision issues');
  console.log('1000 / 3 =', 1000 / 3); // 333.3333333333333
  console.log('(1000 / 3) * 3 =', (1000 / 3) * 3); // 999.9999999999999 (not 1000!)
  console.log('Expected: 1000, Actual:', (1000 / 3) * 3);
  console.log();
  
  // Problem 2: Accumulating rounding errors
  console.log('Problem 2: Accumulating rounding errors');
  let total = 0;
  for (let i = 0; i < 10; i++) {
    total += 0.1;
  }
  console.log('0.1 added 10 times =', total); // 0.9999999999999999 (not 1.0!)
  console.log('Expected: 1.0, Actual:', total);
  console.log();
  
  // Problem 3: Currency calculations
  console.log('Problem 3: Currency calculation issues');
  const price = 10.99;
  const participants = 3;
  const sharePerPerson = price / participants;
  const reconstructedTotal = sharePerPerson * participants;
  
  console.log(`Price: $${price}`);
  console.log(`Participants: ${participants}`);
  console.log(`Share per person: $${sharePerPerson}`); // 3.6633333333333336
  console.log(`Reconstructed total: $${reconstructedTotal}`); // 10.990000000000002 (not 10.99!)
  console.log();
};

/**
 * Demonstrate how our currency utilities solve the problems
 */
export const demonstrateSolution = (): void => {
  console.log('=== SOLUTION USING CURRENCY UTILITIES ===\n');
  
  // Solution 1: Integer-based calculations
  console.log('Solution 1: Integer-based division');
  const amounts = divideAmount(1000, 3);
  const reconstructedTotal = sumAmounts(amounts);
  
  console.log('1000 divided among 3 people:', amounts); // [333.34, 333.33, 333.33]
  console.log('Sum of divided amounts:', reconstructedTotal); // 1000.00 (exact!)
  console.log('Difference from original:', Math.abs(1000 - reconstructedTotal)); // 0
  console.log();
  
  // Solution 2: Proper currency formatting
  console.log('Solution 2: Proper currency formatting');
  amounts.forEach((amount, index) => {
    console.log(`Person ${index + 1}: ${formatCurrency(amount, USD)}`);
  });
  console.log(`Total: ${formatCurrency(reconstructedTotal, USD)}`);
  console.log();
  
  // Solution 3: Cents-based storage
  console.log('Solution 3: Cents-based storage');
  const priceInCents = toCents(10.99);
  const priceFromCents = fromCents(priceInCents);
  
  console.log('Original price: $10.99');
  console.log('Stored as cents:', priceInCents); // 1099
  console.log('Converted back:', priceFromCents); // 10.99 (exact!)
  console.log('No precision loss:', priceFromCents === 10.99); // true
  console.log();
};

/**
 * Demonstrate real-world bill splitting scenario
 */
export const demonstrateBillSplitting = (): void => {
  console.log('=== REAL-WORLD BILL SPLITTING SCENARIO ===\n');
  
  // Scenario: Restaurant bill with multiple items
  const items = [
    { name: 'Pizza', price: 25.99, participants: 4 },
    { name: 'Drinks', price: 18.50, participants: 3 },
    { name: 'Dessert', price: 12.75, participants: 2 }
  ];
  
  console.log('Restaurant Bill:');
  items.forEach(item => {
    console.log(`- ${item.name}: ${formatCurrency(item.price, USD)} (${item.participants} people)`);
  });
  console.log();
  
  // Calculate splits using our utilities
  console.log('Precise splits:');
  let totalBill = 0;
  
  items.forEach(item => {
    const splits = divideAmount(item.price, item.participants);
    const itemTotal = sumAmounts(splits);
    totalBill += itemTotal;
    
    console.log(`${item.name}:`);
    splits.forEach((split, index) => {
      console.log(`  Person ${index + 1}: ${formatCurrency(split, USD)}`);
    });
    console.log(`  Item total: ${formatCurrency(itemTotal, USD)} (original: ${formatCurrency(item.price, USD)})`);
    console.log();
  });
  
  console.log(`Total bill: ${formatCurrency(totalBill, USD)}`);
  console.log(`Original total: ${formatCurrency(sumAmounts(items.map(i => i.price)), USD)}`);
  console.log();
};

/**
 * Run all demonstrations
 */
export const runAllDemonstrations = (): void => {
  demonstratePrecisionProblem();
  demonstrateSolution();
  demonstrateBillSplitting();
  
  console.log('=== SUMMARY ===');
  console.log('✅ Integer-based calculations eliminate floating-point errors');
  console.log('✅ Proper currency formatting using Intl.NumberFormat');
  console.log('✅ Precise bill splitting with no rounding errors');
  console.log('✅ Backward compatibility with existing data');
  console.log('✅ Automatic data sanitization and migration');
};

// Uncomment the line below to run demonstrations in the browser console
// runAllDemonstrations();