"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowLeft, Edit, Trash2, Image as ImageIcon, MoreVertical } from "lucide-react";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { ShootModal } from "@/components/modals/shoot";
import { ShootingResults } from "@/components/dashboard/shooting-results";

interface Studio {
    id: string;
    name: string;
    type: string;
    createdAt: string;
    updatedAt: string;
    images: string[];
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

interface StudioPageProps {
    params: {
        id: string;
    };
}

export default function StudioPage({ params }: StudioPageProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [studio, setStudio] = useState<Studio | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editedName, setEditedName] = useState("");
    const [editedType, setEditedType] = useState("");
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [isPolling, setIsPolling] = useState(false);
    const router = useRouter();

    const fetchStudio = useCallback(async () => {
        try {
            const response = await fetch(`/api/studio/${params.id}`);
            if (response.ok) {
                const data = await response.json();
                setStudio(data);
                setEditedName(data.name);
                setEditedType(data.type);
                setPredictions(data.predictions || []);
                return data;
            } else {
                throw new Error("Failed to fetch studio");
            }
        } catch (error) {
            console.error("Error fetching studio:", error);
            router.push("/dashboard");
        }
    }, [params.id, router]);

    useEffect(() => {
        fetchStudio();
    }, [fetchStudio]);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        const pollPredictions = async () => {
            const fetchedStudio = await fetchStudio();
            if (fetchedStudio && fetchedStudio.predictions) {
                const hasPendingPredictions = fetchedStudio.predictions.some((p: Prediction) => p.status === "pending");
                if (hasPendingPredictions) {
                    timer = setTimeout(pollPredictions, 3000);
                } else {
                    setIsPolling(false);
                }
            } else {
                setIsPolling(false);
            }
        };

        const startPolling = () => {
            if (predictions.some(p => p.status === "pending") && !isPolling) {
                setIsPolling(true);
                pollPredictions();
            }
        };

        startPolling();

        return () => {
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [predictions, isPolling, fetchStudio]);

    const refreshData = useCallback(() => {
        fetchStudio();
    }, [fetchStudio]);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const response = await fetch("/api/studio/delete", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: studio?.id }),
            });

            if (response.ok) {
                router.push("/dashboard");
            } else {
                throw new Error("Failed to delete studio");
            }
        } catch (error) {
            console.error("Error deleting studio:", error);
            toast.error("Failed to delete studio. Please try again.");
        } finally {
            setIsDeleting(false);
            setIsDeleteDialogOpen(false);
        }
    };

    const handleEdit = async () => {
        try {
            const response = await fetch(`/api/studio/${studio?.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: editedName, type: editedType }),
            });

            if (response.ok) {
                const updatedStudio = await response.json();
                setStudio(updatedStudio);
                setIsEditDialogOpen(false);
                toast.success("Studio updated successfully");
            } else {
                throw new Error("Failed to update studio");
            }
        } catch (error) {
            console.error("Error updating studio:", error);
            alert("Failed to update studio. Please try again.");
        }
    };

    if (!studio) {
        return <div className="flex min-h-[80vh] items-center justify-center">
            <Loader2 className="size-8 animate-spin" />
        </div>;
    }

    return (
        <div className="container mx-auto">
            <div className="mb-4 flex justify-between space-x-4">
                <div className="flex items-center space-x-4">
                    <Link href="/dashboard">
                        <Button variant="outline" size="icon" className="size-7">
                            <ArrowLeft className="size-4" />
                            <span className="sr-only">Back to Dashboard</span>
                        </Button>
                    </Link>
                    <DashboardHeader heading={studio.name} />
                    <Badge variant="outline" className="hidden capitalize md:block">{studio.type}</Badge>
                </div>
                <div className="flex space-x-4">
                    <ShootModal studioId={params.id} onShootComplete={refreshData} />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                                <MoreVertical className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="space-y-2 py-2">
                            <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)} className="cursor-pointer">
                                <Edit className="mr-2 size-4" />
                                Edit Studio
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                onClick={() => setIsDeleteDialogOpen(true)} 
                                className="cursor-pointer text-destructive hover:text-destructive/90"
                            >
                                <Trash2 className="mr-2 size-4" />
                                Delete Studio
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="grid gap-6">
                <ShootingResults
                    predictions={predictions}
                    studioId={params.id}
                    onShootComplete={refreshData}
                />
            </div>

            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to delete this studio?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the studio and all associated data.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive/90 hover:bg-destructive">
                            {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Studio</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                value={editedName}
                                onChange={(e) => setEditedName(e.target.value)}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="type" className="text-right">
                                Type
                            </Label>
                            <Select value={editedType} onValueChange={setEditedType}>
                                <SelectTrigger className="col-span-2">
                                    <SelectValue placeholder="Select studio type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="kid">Kid</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleEdit}>Save changes</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
