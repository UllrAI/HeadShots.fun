"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { ArrowLeft, Edit, Trash2, Image as ImageIcon, MoreVertical, Plus, ArrowUp, ArrowDown } from "lucide-react";
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
import { useDropzone } from 'react-dropzone';
import { resizeImage } from '@/lib/imageUtils';
import { Star } from 'lucide-react';
import { Confetti } from '@/components/shared/success-confetti';
import { useTranslations } from 'next-intl';

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
    const t = useTranslations('StudioPage');
    const [isDeleting, setIsDeleting] = useState(false);
    const [studio, setStudio] = useState<Studio | null>(null);
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editedName, setEditedName] = useState("");
    const [editedType, setEditedType] = useState("");
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [predictions, setPredictions] = useState<Prediction[]>([]);
    const [isPolling, setIsPolling] = useState(false);
    const [editedImages, setEditedImages] = useState<string[]>([]);
    const [showConfetti, setShowConfetti] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const fetchStudio = useCallback(async () => {
        try {
            const response = await fetch(`/api/studio/${params.id}`);
            if (response.ok) {
                const data = await response.json();
                setStudio(data);
                setEditedName(data.name);
                setEditedType(data.type);
                setEditedImages(data.images);
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
        if (searchParams.get('successNew') === 'true') {
            setShowConfetti(true);
            const newUrl = window.location.pathname;
            window.history.replaceState({}, '', newUrl);
        }
    }, [fetchStudio, searchParams]);

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
                toast.success(t("studio_deleted_successfully"));
                router.push("/dashboard");
            } else {
                throw new Error(t("failed_to_delete_studio_please_try_again"));
            }
        } catch (error) {
            console.error("Error deleting studio:", error);
            toast.error(t("failed_to_delete_studio_please_try_again"));
        } finally {
            setIsDeleting(false);
            setIsDeleteDialogOpen(false);
        }
    };

    const onDrop = useCallback((acceptedFiles: File[]) => {
        Promise.all(acceptedFiles.map(async (file) => {
            const resizedImage = await resizeImage(file, 1024, 1024);
            const formData = new FormData();
            formData.append('file', resizedImage);

            const uploadResponse = await fetch('/api/studio/upload', {
                method: 'POST',
                body: formData,
            });

            if (!uploadResponse.ok) {
                throw new Error('Failed to upload image');
            }

            const { url } = await uploadResponse.json();
            return url;
        })).then((newImages) => {
            setEditedImages(prev => [...prev, ...newImages]);
        }).catch((error) => {
            console.error("Error uploading images:", error);
            toast.error("Failed to upload images. Please try again.");
        });
    }, []);

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxFiles: 5 - editedImages.length,
    });

    const setAsMainFace = (index: number) => {
        setEditedImages(prev => {
            const newImages = [...prev];
            const [mainImage] = newImages.splice(index, 1);
            return [mainImage, ...newImages];
        });
    };

    const removeImage = (index: number) => {
        if (editedImages.length > 1) {
            setEditedImages(prev => prev.filter((_, i) => i !== index));
        } else {
            toast.error("You must have at least one image.");
        }
    };

    const handleEdit = async () => {
        try {
            const response = await fetch(`/api/studio/${studio?.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: editedName, type: editedType, images: editedImages }),
            });

            if (response.ok) {
                const updatedStudio = await response.json();
                setStudio(updatedStudio);
                setIsEditDialogOpen(false);
                toast.success(t("studio_updated_successfully"));
            } else {
                throw new Error(t("failed_to_update_studio_please_try_again"));
            }
        } catch (error) {
            console.error("Error updating studio:", error);
            toast.error(t("failed_to_update_studio_please_try_again"));
        }
    };

    if (!studio) {
        return <div className="flex min-h-[80vh] items-center justify-center">
            <Loader2 className="size-8 animate-spin" />
        </div>;
    }

    return (
        <div className="container mx-auto">
            {showConfetti && <Confetti />}
            <div className="mb-4 flex justify-between space-x-4">
                <div className="flex items-center space-x-4">
                    <Link href="/dashboard">
                        <Button variant="outline" size="icon" className="size-7">
                            <ArrowLeft className="size-4" />
                            <span className="sr-only">{t("back_to_dashboard")}</span>
                        </Button>
                    </Link>
                    <DashboardHeader heading={studio.name} />
                    <Badge variant="outline" className="hidden capitalize md:block">
                        {t(`${studio.type}`)}
                    </Badge>
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
                                {t("edit_studio")}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                                onClick={() => setIsDeleteDialogOpen(true)} 
                                className="cursor-pointer text-destructive hover:text-destructive/90"
                            >
                                <Trash2 className="mr-2 size-4" />
                                {t("delete_studio")}
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
                        <AlertDialogTitle>{t("are_you_sure_you_want_to_delete_this_studio")}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t("this_action_cannot_be_undone")} {t("this_will_permanently_delete_the_studio_and_all_associated_data")}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} disabled={isDeleting} className="bg-destructive/90 hover:bg-destructive">
                            {isDeleting ? t("deleting") : t("delete")}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>{t("edit_studio")}</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="space-y-2">
                                <Label htmlFor="name">{t("name")}</Label>
                                <Input
                                    id="name"
                                    value={editedName}
                                    onChange={(e) => setEditedName(e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">{t("type")}</Label>
                                <Select value={editedType} onValueChange={setEditedType}>
                                    <SelectTrigger>
                                        <SelectValue placeholder={t("select_studio_type")} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="male">{t("male")}</SelectItem>
                                        <SelectItem value="female">{t("female")}</SelectItem>
                                        <SelectItem value="kid">{t("kid")}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div>
                            <Label>{t("images")}</Label>
                            <div className="mt-2 grid grid-cols-2 gap-2 md:grid-cols-5">
                                {editedImages.map((image, index) => (
                                    <div key={index} className="group relative">
                                        <img src={image} alt={`Studio image ${index + 1}`} className="aspect-square rounded-md object-cover" />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                                            <Button 
                                                variant="destructive" 
                                                size="icon" 
                                                onClick={() => removeImage(index)} 
                                                className="absolute right-1 top-1 size-6"
                                            >
                                                <Trash2 className="size-4" />
                                            </Button>
                                            {index !== 0 && (
                                                <Button 
                                                    variant="secondary" 
                                                    size="sm" 
                                                    onClick={() => setAsMainFace(index)}
                                                    className="absolute bottom-1 left-1 text-xs"
                                                >
                                                    <Star className="mr-1 size-3" />
                                                    {t("set_as_main")}
                                                </Button>
                                            )}
                                        </div>
                                        {index === 0 && (
                                            <Badge className="absolute left-2 top-2 text-xs opacity-80" variant="secondary">
                                                <Star className="mr-1 size-3" />
                                                {t("main")}
                                            </Badge> 
                                        )}
                                    </div>
                                ))}
                                {editedImages.length < 5 && (
                                    <div {...getRootProps()} className="flex aspect-square cursor-pointer items-center justify-center rounded-md border-2 border-dashed">
                                        <input {...getInputProps()} />
                                        <Plus className="size-6 text-gray-400" />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button onClick={handleEdit}>{t("save_changes")}</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}