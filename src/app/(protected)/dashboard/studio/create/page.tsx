"use client";

import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/shared/icons";
import { toast } from "sonner";
import { useDropzone } from 'react-dropzone';
import { X, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { resizeImage } from '@/lib/imageUtils';

export default function CreateStudioPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [images, setImages] = useState<Array<{ file: File; preview: string }>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages = acceptedFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    setImages(prev => [...prev, ...newImages].slice(0, 5));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 5,
  });

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    setImages(prev => {
      const newImages = [...prev];
      const [removed] = newImages.splice(index, 1);
      newImages.splice(direction === 'up' ? index - 1 : index + 1, 0, removed);
      return newImages;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // Prevent submission if already loading
    
    if (!name.trim()) {
      toast.error("Please enter a studio name.");
      return;
    }
    if (!type) {
      toast.error("Please select a studio type.");
      return;
    }
    if (images.length === 0) {
      toast.error("Please upload at least one image.");
      return;
    }
    if (images.length > 5) {
      toast.error("You can upload a maximum of 5 images.");
      return;
    }

    setIsLoading(true);
    try {
      const uploadedImages = await Promise.all(images.map(async (img) => {
        const resizedImage = await resizeImage(img.file, 1024, 1024);
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
      }));

      const response = await fetch('/api/studio/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          type,
          images: uploadedImages,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create studio');
      }

      const studio = await response.json();
      toast.success("Studio created successfully!");
      // Add redirection logic here if needed
      router.push(`/dashboard/studio/${studio.id}`);
    } catch (error) {
      toast.error(`Failed to create studio. Please try again. ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <TooltipProvider>
      <div className="flex-1 space-y-4">
        <div className="mb-4 flex justify-start space-x-4">
          <Link href="/dashboard">
            <Button variant="outline" size="icon" className="mt-1 size-7">
              <ArrowLeft className="size-4" />
              <span className="sr-only">Back to Dashboard</span>
            </Button>
          </Link>
          <DashboardHeader
            heading="Create Your Studio"
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="lg:col-span-5">
            <CardHeader>
              {/* <CardTitle>Studio Details</CardTitle> */}
              <CardDescription>Enter the basic information for your studio</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base font-semibold">Studio Name</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                    placeholder="Your studio name" 
                    className="p-2 text-sm"
                  />
                  <p className="text-sm text-muted-foreground">This is the name that will be displayed for your studio.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-base font-semibold">Studio Type</Label>
                  <Select value={type} onValueChange={setType} required>
                    <SelectTrigger className="w-full p-2">
                      <SelectValue placeholder="Select studio type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="kid">Kid</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">Select the type of studio you want to create.</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-semibold">Upload Sample Photos</Label>
                  <p className="text-sm text-muted-foreground">Please upload 1-5 clear, front-facing photos that meet the sample photo requirements.</p>
                  <div {...getRootProps()} className={`mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5 ${isDragActive ? 'border-gray-500' : ''}`}>
                    <div className="space-y-1 text-center">
                      <span className="flex items-center justify-center p-1">
                        <Icons.imageuplus className='size-10 text-gray-400' />
                      </span>
                      <div className="flex text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-medium focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2">
                          <span>Upload a file</span>
                          <input {...getInputProps()} id="file-upload" name="file-upload" type="file" className="sr-only" />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-5 gap-6">
                  {images.map((image, index) => (
                    <div key={index} className="group relative">
                      <div className="aspect-square overflow-hidden rounded-lg">
                        <img 
                          src={image.preview} 
                          alt={`preview ${index}`} 
                          className="size-full object-cover"
                        />
                      </div>
                      <button 
                        type="button" 
                        onClick={() => removeImage(index)} 
                        className="absolute right-1 top-1 rounded-full bg-destructive p-1 text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Icons.spinner className="mr-2 size-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Create Studio'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Sample Photo Requirements</CardTitle>
              <CardDescription>Make sure your sample photos meet these standards:</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { requirement: 'Front & Clear', image: 'https://s.headshots.fun/create-studio/front-clear-photo.jpg', type: 'positive' },
                  { requirement: 'Multiple People', image: 'https://s.headshots.fun/create-studio/no-multiple-people.jpg', type: 'negative' },
                  { requirement: 'Side Shots', image: 'https://s.headshots.fun/create-studio/avoid-side-shots.jpg', type: 'negative' },
                  { requirement: 'Blurry Photos', image: 'https://s.headshots.fun/create-studio/no-blurry-photos.jpg', type: 'negative' },
                  { requirement: 'Obstructing', image: 'https://s.headshots.fun/create-studio/no-objects-obstructing.jpg', type: 'negative' }
                ].map(({ requirement, image, type }, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <div className="flex items-center space-x-2">
                        <div className="size-16 overflow-hidden rounded-sm bg-muted">
                          <img src={image} alt={requirement} className="size-full object-cover" />
                        </div>
                        <span className={`text-md pl-1 ${type === 'positive' ? 'text-green-600' : 'text-destructive'}`}>
                          {type === 'positive' ? '✓' : '✗'}
                        </span>
                        <span className="font-mono text-sm">
                          {' '}{requirement}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Detailed explanation for {requirement}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}