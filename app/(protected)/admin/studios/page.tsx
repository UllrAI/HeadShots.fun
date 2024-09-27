"use client";

import { useEffect, useState } from 'react';
import { format } from "date-fns";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { getStudios, getPredictions } from "./actions";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

function PredictionsDialog({ studioId, studioName }: { studioId: string, studioName: string }) {
  const [predictions, setPredictions] = useState<any[]>([]);

  useEffect(() => {
    const fetchPredictions = async () => {
      const fetchedPredictions = await getPredictions(studioId);
      setPredictions(fetchedPredictions);
    };
    fetchPredictions();
  }, [studioId]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link">{predictions.length}</Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Predictions for {studioName}</DialogTitle>
        </DialogHeader>
        <div className="max-h-[60vh] overflow-y-auto">
          <table className="w-full text-left text-sm text-gray-500">
            <thead className="bg-gray-50 text-xs uppercase text-gray-700">
              <tr>
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Style</th>
                <th className="px-4 py-2">Created At</th>
              </tr>
            </thead>
            <tbody>
              {predictions.map((prediction) => (
                <tr key={prediction.id} className="border-b bg-white">
                  <td className="px-4 py-2"><TruncateText text={prediction.id} /></td>
                  <td className="px-4 py-2">{prediction.status}</td>
                  <td className="px-4 py-2">{prediction.style || 'N/A'}</td>
                  <td className="px-4 py-2">{format(new Date(prediction.createdAt), 'yyyy-MM-dd HH:mm:ss')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function StudiosPage() {
  const [studios, setStudios] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchStudios(currentPage);
  }, [currentPage]);

  const fetchStudios = async (page: number) => {
    const { studios, totalPages } = await getStudios(page);
    setStudios(studios);
    setTotalPages(totalPages);
  };

  return (
    <>
      <DashboardHeader
        heading="Studios Admin Panel"
        text="Manage your studios and their predictions."
      />
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">User</th>
              <th className="px-6 py-3">Predictions</th>
              <th className="px-6 py-3">Created At</th>
            </tr>
          </thead>
          <tbody>
            {studios.map((studio) => (
              <tr key={studio.id} className="border-b bg-white">
                <td className="px-6 py-4">
                  <TruncateText text={studio.name} />
                </td>
                <td className="px-6 py-4">{studio.type}</td>
                <td className="px-6 py-4">
                  <TruncateText text={studio.user.name || studio.user.email} />
                </td>
                <td className="px-6 py-4">
                  <PredictionsDialog studioId={studio.id} studioName={studio.name} />
                </td>
                <td className="px-6 py-4">{format(new Date(studio.createdAt), 'yyyy-MM-dd HH:mm:ss')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex items-center justify-between">
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
