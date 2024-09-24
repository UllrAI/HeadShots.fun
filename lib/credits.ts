export async function getUserCredits(): Promise<number> {
  const response = await fetch("/api/user/credits");
  if (!response.ok) {
    throw new Error("Failed to fetch user credits");
  }
  const data = await response.json();
  return data.credits;
}

export async function updateCredits(amount: number, type: 'PURCHASE' | 'USAGE' | 'REFUND', userId?: string): Promise<number> {
  const response = await fetch("/api/user/credits", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ amount, type, userId }),
  });

  if (!response.ok) {
    throw new Error("Failed to update credits");
  }

  const data = await response.json();
  return data.credits;
}

// 暂时将 buyCredits 函数留空，我们稍后再实现它
export async function buyCredits(amount: number): Promise<number> {
  // This is a placeholder. In a real application, you would integrate with a payment provider here.
  return await updateCredits(amount, 'PURCHASE');
}

// Rename useCredits to spendCredits
export async function spendCredits(amount: number): Promise<number> {
  return await updateCredits(amount, 'USAGE');
}

export async function getCreditTransactions(): Promise<CreditTransaction[]> {
  const response = await fetch("/api/user/credit-transactions");
  if (!response.ok) {
    throw new Error("Failed to fetch credit transactions");
  }
  const data = await response.json();
  return data.transactions;
}

// Add this interface
export interface CreditTransaction {
  id: string;
  amount: number;
  type: 'PURCHASE' | 'USAGE' | 'REFUND';
  createdAt: string;
}
