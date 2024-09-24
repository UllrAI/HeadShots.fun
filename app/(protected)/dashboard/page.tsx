"use client";

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { DashboardHeader } from "@/components/dashboard/header";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Icons } from "@/components/shared/icons";
import { useRouter } from 'next/navigation';
import { Loader2 } from "lucide-react";

interface Studio {
  id: string;
  name: string;
  type: string;
  images: any[];
  createdAt: string;
  predictions: Prediction[];
}

interface Prediction {
  id: string;
  createdAt: string;
  imageUrl: string | null;
  status: string;
  style: string | null;
  pId: string | null;
}

export default function DashboardPage() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [studios, setStudios] = useState<Studio[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchStudios = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/studio/list');
      if (!response.ok) {
        throw new Error('Failed to fetch studios');
      }
      const data = await response.json();
      setStudios(data);
    } catch (error) {
      console.error("Error fetching studios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudios();
  }, [pathname, searchParams]);

  const handleRowClick = (studioId: string) => {
    router.push(`/dashboard/studio/${studioId}`);
  };

  return (
    <div className="container mx-auto">
      <DashboardHeader
        heading="Studios"
      >
        <Link href="/dashboard/studio/create">
          <Button>
            <Icons.add className="mr-2 size-4" />
            
            Create<span className="hidden sm:inline-flex">&nbsp;New Studio</span>
          </Button>
        </Link>
      </DashboardHeader>

      {loading ? (
        <div className="flex min-h-[80vh] items-center justify-center">
          <Loader2 className="size-8 animate-spin" />
        </div>
      ) : studios.length > 0 ? (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Your Studios</CardTitle>
            <CardDescription>A list of all your created studios.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">Type</TableHead>
                  <TableHead>HeadShots</TableHead>
                  <TableHead className="hidden md:table-cell">Created At</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                  {studios.map((studio) => (
                    <TableRow 
                      key={studio.id} 
                      className="cursor-pointer transition-colors hover:bg-muted/50"
                      onClick={() => handleRowClick(studio.id)}
                    >
                      <TableCell>
                        {studio.name}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center">
                          <Icons.type className="mr-2 size-4" />
                          <Badge variant="outline">{studio.type}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Icons.image className="mr-2 size-4" />
                          {studio.predictions.length}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        {new Date(studio.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <EmptyPlaceholder className="mt-6 min-h-[80vh]">
          <EmptyPlaceholder.Icon name="dashboard" />
          <EmptyPlaceholder.Title>No Studios created</EmptyPlaceholder.Title>
          <EmptyPlaceholder.Description>
            You don&apos;t have any Studios yet. Start creating Studios.
          </EmptyPlaceholder.Description>
          <Link href="/dashboard/studio/create">
            <Button>Create Studio</Button>
          </Link>
        </EmptyPlaceholder>
      )}
    </div>
  );
}
