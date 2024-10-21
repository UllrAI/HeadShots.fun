"use client";

import { useEffect, useState } from 'react';
import { format } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { getPredictions, deletePrediction } from "./actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

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

export default function PredictionsPage() {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    fetchPredictions(currentPage, pageSize, statusFilter);
  }, [currentPage, pageSize, statusFilter]);

  const fetchPredictions = async (page: number, size: number, status: string | null) => {
    const { predictions, totalPages } = await getPredictions(page, size, status);
    setPredictions(predictions);
    setTotalPages(totalPages);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this prediction?')) {
      await deletePrediction(id);
      fetchPredictions(currentPage, pageSize, statusFilter);
    }
  };

  return (
    <>
      <DashboardHeader
        heading="Predictions Admin Panel"
        text="Manage predictions across all studios."
      />
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700">
            <tr>
              <th className="hidden px-6 py-3">ID</th>
              <th className="px-6 py-3">pID</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Style</th>
              <th className="px-6 py-3">Studio</th>
              <th className="hidden px-6 py-3">User</th>
              <th className="px-6 py-3">Created At</th>
              <th className="px-6 py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {predictions.map((prediction) => (
              <tr key={prediction.id} className="border-b bg-white">
                <td className="hidden px-6 py-4"><TruncateText text={prediction.id} /></td>
                <td className="px-6 py-4"><TruncateText text={prediction.pId || 'N/A'} /></td>
                <td className="px-6 py-4">
                  <Badge className={`${prediction.status === 'completed' ? 'bg-green-300' : prediction.status === 'failed' ? 'bg-red-300' : 'bg-gray-300'} capitalize`} variant="outline">
                    {prediction.status}
                  </Badge>
                </td>
                <td className="px-6 py-4">{prediction.style || 'N/A'}</td>
                <td className="px-6 py-4"><TruncateText text={prediction.studio?.name || 'N/A'} /></td>
                <td className="hidden px-6 py-4"><TruncateText text={prediction.userEmail} /></td>
                <td className="px-6 py-4">{format(new Date(prediction.createdAt), 'yyyy-MM-dd HH:mm:ss')}</td>
                <td className="px-6 py-4">
                  <Button
                    onClick={() => handleDelete(prediction.id)}
                    variant="destructive"
                    size="sm"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-between">

        <Select
          value={statusFilter || undefined}
          onValueChange={(value) => setStatusFilter(value === "all" ? null : value)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="processing">Processing</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={String(pageSize)}
          onValueChange={(value) => setPageSize(Number(value))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select page size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="10">10 per page</SelectItem>
            <SelectItem value="20">20 per page</SelectItem>
            <SelectItem value="50">50 per page</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-4">
          <Button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            variant="outline"
          >
            Previous
          </Button>
          <span className="text-xs text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
