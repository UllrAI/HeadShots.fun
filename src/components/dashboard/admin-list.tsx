"use client";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EditRoleSection } from "@/components/dashboard/editrole";
import { EditCreditsSection } from "@/components/dashboard/editcredits";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";


interface Studio {
  id: string;
  name: string;
  images: string[];
}

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  credits: number;
  studios: Studio[];
  createdAt: string;
  emailVerified?: Date | null;
  image?: string | null;
  updatedAt?: Date;
}

export default function UsersList() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchUsers = useCallback(async () => {
    const response = await fetch(`/api/users-list?page=${currentPage}&pageSize=${pageSize}`, { cache: 'no-store' });
    if (response.ok) {
      const data = await response.json();
      setUsers(data.users);
      setTotalPages(data.totalPages);
    } else {
      console.error('Failed to fetch users');
    }
  }, [currentPage, pageSize]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const updateUserCredits = (userId: string, newCredits: number) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId ? { ...user, credits: newCredits } : user
      )
    );
  };

  return (
    <Card className="xl:col-span-2">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="grid gap-2">
          <CardTitle>Users</CardTitle>
          <CardDescription className="text-balance">
            List and manage users
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Credits</TableHead>
              <TableHead>Studios</TableHead>
              <TableHead className="hidden md:table-cell">Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="font-medium">{user.name}</div>
                  <div className="text-sm text-muted-foreground md:hidden">
                    {user.email}
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {user.email}
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center">
                    <Badge className="text-xs" variant={user.role === "ADMIN" ? "default" : "outline"}>
                        {user.role}
                    </Badge>
                    <EditRoleSection user={user as any} />
                  </span>
                </TableCell>
                <TableCell>
                  <span className="inline-flex items-center">
                    {user.credits}
                    <EditCreditsSection user={user as any} onUpdate={updateUserCredits} />
                  </span>
                </TableCell>
                <TableCell>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="link" className="p-0">
                        {user.studios.length} {user.studios.length === 1 ? 'Studio' : 'Studios'}
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[80vh] max-w-4xl overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>{user.name} - Studios</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {user.studios.map((studio) => (
                          <Badge variant="outline" className="text-lg">{studio.name}
                            <span className="text-xs text-muted-foreground"> : {studio.images.length} sample images</span>
                          </Badge>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                    {new Date(user.createdAt).toLocaleDateString('zh-US', { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' })}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 flex items-center justify-between">
          <Select value={pageSize.toString()} onValueChange={(value) => setPageSize(parseInt(value))}>
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
          <span className="text-xs text-muted-foreground">Page {currentPage} of {totalPages}</span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
