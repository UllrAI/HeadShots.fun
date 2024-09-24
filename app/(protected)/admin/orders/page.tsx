"use client";

import { useEffect, useState } from 'react';
import { format } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { handleCheck, getTransactions } from "./actions";
import { toast } from "sonner";

function TruncateText({ text, maxLength = 15 }: { text: string; maxLength?: number }) {
  if (!text) return <span>N/A</span>;
  if (text.length <= maxLength) return <span>{text}</span>;
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>{text.slice(0, maxLength)}...</TooltipTrigger>
        <TooltipContent>{text}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default function OrdersPage() {
  const [transactions, setTransactions] = useState<any[]>([]);

  useEffect(() => {
    getTransactions().then(setTransactions);
  }, []);

  const onCheck = async (stripeSessionId: string) => {
    const newStatus = await handleCheck(stripeSessionId);
    if (newStatus) {
      setTransactions(prevTransactions =>
        prevTransactions.map(t =>
          t.stripeSessionId === stripeSessionId ? { ...t, status: newStatus } : t
        )
      );
      toast.success(`Transaction status updated to ${newStatus}`);
    } else {
      toast.error("Failed to update transaction status");
    }
  };

  return (
    <>
      <DashboardHeader
        heading="Orders"
        text="Check and manage your latest orders."
      />
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700">
            <tr>
              <th className="px-6 py-3">Session ID</th>
              <th className="px-6 py-3">Payment Intent ID</th>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="border-b bg-white">
                <td className="px-6 py-4">
                  <TruncateText text={transaction.stripeSessionId} />
                </td>
                <td className="px-6 py-4">
                  <TruncateText text={transaction.stripePaymentIntentId} />
                </td>
                <td className="px-6 py-4">
                  <TruncateText text={transaction.user.name || transaction.user.email} />
                </td>
                <td className="px-6 py-4">${(transaction.amount / 100).toFixed(2)}</td>
                <td className="px-6 py-4">{transaction.status}</td>
                <td className="px-6 py-4">{format(new Date(transaction.createdAt), 'yyyy-MM-dd HH:mm:ss')}</td>
                <td className="flex gap-1 px-6 py-4">
                  <Button 
                    onClick={() => window.open(`https://dashboard.stripe.com/payments/${transaction.stripePaymentIntentId}`, '_blank')} 
                    className="mr-2"
                    disabled={!transaction.stripePaymentIntentId}
                  >
                    View
                  </Button>
                  {transaction.status !== "completed" && (
                    <Button onClick={() => onCheck(transaction.stripeSessionId)}>
                      Check
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
