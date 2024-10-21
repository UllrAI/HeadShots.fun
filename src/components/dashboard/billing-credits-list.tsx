"use client";

import { useEffect, useState } from 'react';
import { CreditTransaction } from '@/lib/credits';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CreditsDisplay } from "@/components/layout/credits";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useTranslations } from "next-intl";

export function CreditTransactionHistory() {
  const t = useTranslations("Credits");
  const [transactions, setTransactions] = useState<CreditTransaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch(`/api/user/credits/transactions?page=${currentPage}&pageSize=${pageSize}`);
        if (!response.ok) {
          throw new Error('Failed to fetch transactions');
        }
        const data = await response.json();
        setTransactions(data.transactions);
        setTotal(data.total);
        setTotalPages(Math.ceil(data.total / pageSize));
      } catch (error) {
        console.error("Failed to fetch transactions:", error);
      }
    };

    const fetchChartData = async () => {
      try {
        const response = await fetch('/api/user/credits/daily?days=30');
        if (!response.ok) {
          throw new Error('Failed to fetch chart data');
        }
        const data = await response.json();
        setChartData(data);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
      }
    };

    fetchTransactions();
    fetchChartData();
  }, [currentPage, pageSize]);

  const handlePageSizeChange = (value: string) => {
    setPageSize(Number(value));
    setCurrentPage(1); // Reset to first page when changing page size
  };

  const getChartColors = () => ({
    added: "hsl(var(--chart-1))",
    used: "hsl(var(--chart-2))",
  });

  return (
    <>
      <Card className="mb-4">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-md font-semibold">{t("credits_activity")}</span>
            <CreditsDisplay showCredits={true} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
              <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 text-xs shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex items-center">
                            <div className="mr-1 size-1.5 rounded-full" style={{ backgroundColor: getChartColors().added }}></div>
                            <span className="font-medium">Added: {payload[0].value}</span>
                          </div>
                          <div className="flex items-center">
                            <div className="mr-1 size-1.5 rounded-full" style={{ backgroundColor: getChartColors().used }}></div>
                            <span className="font-medium">Used: {payload[1].value}</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="added" fill={getChartColors().added} radius={[3, 3, 0, 0]} />
              <Bar dataKey="used" fill={getChartColors().used} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
        <CardFooter className="flex-col gap-2 text-pretty text-center text-sm">
          <div className="leading-none text-muted-foreground">
            {t("30_day_credit_activity_summary")}
          </div>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>{t("credits_history")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("date")}</TableHead>
                <TableHead>{t("type")}</TableHead>
                <TableHead>{t("amount")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>
                    {new Date(transaction.createdAt).toLocaleString('zh-US', {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                      hour12: false
                    })}
                  </TableCell>
                  <TableCell>{transaction.type}</TableCell>
                  <TableCell className={transaction.type === 'USAGE' ? 'text-destructive' : 'text-green-500'}>
                    {transaction.type === 'USAGE' ? '-' : '+'}{transaction.amount}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 flex items-center justify-between">
            <Select onValueChange={handlePageSizeChange} value={pageSize.toString()}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t("select_page_size")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">{t("10_per_page")}</SelectItem>
                <SelectItem value="20">{t("20_per_page")}</SelectItem>
                <SelectItem value="50">{t("50_per_page")}</SelectItem>
              </SelectContent>
            </Select>
            {total > pageSize && (
              <Pagination>
                <PaginationContent>
                  <PaginationPrevious 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  />
                  {/* Add page numbers here if needed */}
                  <PaginationNext 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  />
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
}