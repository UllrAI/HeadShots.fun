"use client";

import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/shared/icons";
import { toast } from "sonner";
import { useDropzone } from 'react-dropzone';
import { useRouter } from 'next/navigation';
import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { resizeImage } from '@/lib/imageUtils';
import { Badge } from "@/components/ui/badge";
import { Trash2, Plus, Star, X, ArrowLeft, Camera } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function CreateStudioPage() {
  const t = useTranslations('StudioPage');
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

  const setAsMainFace = (index: number) => {
    setImages(prev => {
      const newImages = [...prev];
      const [mainImage] = newImages.splice(index, 1);
      return [mainImage, ...newImages];
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // Prevent submission if already loading
    
    if (!name.trim()) {
      toast.error(t("error_studio_name_required"));
      return;
    }
    if (!type) {
      toast.error(t("error_studio_type_required"));
      return;
    }
    if (images.length === 0) {
      toast.error(t("error_at_least_one_image"));
      return;
    }
    if (images.length > 5) {
      toast.error(t("error_max_5_images"));
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
          throw new Error(t("error_failed_to_upload_image"));
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
      toast.success(t("success_studio_created"));
      // Add redirection logic here if needed
      router.push(`/dashboard/studio/${studio.id}?successNew=true`);
    } catch (error) {
      toast.error(`${t("error_failed_to_create_studio")} ${error}`);
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
              <span className="sr-only">{t("back_to_dashboard")}</span>
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
              <CardDescription>{t("enter_basic_info_for_your_studio")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-base font-semibold">{t("studio_name")}</Label>
                  <Input 
                    id="name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                    placeholder={t("your_studio_name")} 
                    className="p-2 text-sm"
                  />
                  <p className="text-sm text-muted-foreground">{t("this_is_the_name_that_will_be_displayed_for_your_studio")}</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type" className="text-base font-semibold">{t("studio_type")}</Label>
                  <Select value={type} onValueChange={setType} required>
                    <SelectTrigger className="w-full p-2">
                      <SelectValue placeholder={t("select_studio_type")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">{t("male")}</SelectItem>
                      <SelectItem value="female">{t("female")}</SelectItem>
                      <SelectItem value="kid">{t("kid")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">{t("select_the_type_of_studio_you_want_to_create")}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-base font-semibold">{t("upload_sample_photos")}</Label>
                  <p className="text-sm text-muted-foreground">{t("please_upload_1_5_clear_front_facing_photos_that_meet_the_sample_photo_requirements")}</p>
                  <div className="mt-2">
                    {images.length > 0 ? (
                      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
                        {images.map((image, index) => (
                          <div key={index} className="group relative aspect-square">
                            <img src={image.preview} alt={`Studio image ${index + 1}`} className="size-full rounded-md object-cover" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Button 
                                variant="destructive" 
                                size="icon" 
                                onClick={() => removeImage(index)} 
                                className="absolute right-1 top-1 size-6 opacity-80 group-hover:opacity-80 md:opacity-0"
                              >
                                <Trash2 className="hidden size-4 md:block" />
                                <X className="block size-4 md:hidden" />
                              </Button>
                              {index !== 0 && (
                                <Button 
                                  variant="secondary" 
                                  size="sm" 
                                  onClick={() => setAsMainFace(index)}
                                  className="absolute bottom-1 left-1 text-xs opacity-0 transition-opacity group-hover:opacity-100"
                                >
                                  <Star className="mr-1 size-3" />
                                  <span>{t("set_as_main")}</span>
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
                        {images.length < 5 && (
                          <div {...getRootProps()} className="flex aspect-square cursor-pointer items-center justify-center rounded-md border-2 border-dashed">
                            <input {...getInputProps()} />
                            <Plus className="size-7 text-gray-400" />
                          </div>
                        )}
                      </div>
                    ) : (
                      <div {...getRootProps()} className={`mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pb-6 pt-5 ${isDragActive ? 'border-gray-500' : ''}`}>
                        <div className="flex flex-col items-center space-y-1 text-center">
                          <span className="flex items-center justify-center p-1">
                            <Camera className='size-10 text-gray-400' />
                          </span>
                          <div className="flex items-center text-sm text-gray-600">
                            <label htmlFor="file-upload" className="relative cursor-pointer rounded-md bg-white font-medium focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2">
                              <span>{t("upload_a_file")}</span>
                              <input {...getInputProps()} id="file-upload" name="file-upload" type="file" className="sr-only" />
                            </label>
                            <p>{t("or_drag_and_drop")}</p>
                          </div>
                          <p className="text-xs text-gray-500">{t("png_jpg_gif_up_to_10mb")}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Icons.spinner className="mr-2 size-4 animate-spin" />
                      {t("creating")}...
                    </>
                  ) : (
                    t("create_studio")
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>{t("sample_photo_requirements")}</CardTitle>
              <CardDescription>{t("make_sure_your_sample_photos_meet_these_standards")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { requirement: t("front_and_clear"), image: 'https://s.headshots.fun/create-studio/front-clear-photo.jpg', type: 'positive' },
                  { requirement: t("multiple_people"), image: 'https://s.headshots.fun/create-studio/no-multiple-people.jpg', type: 'negative' },
                  { requirement: t("side_shots"), image: 'https://s.headshots.fun/create-studio/avoid-side-shots.jpg', type: 'negative' },
                  { requirement: t("blurry_photos"), image: 'https://s.headshots.fun/create-studio/no-blurry-photos.jpg', type: 'negative' },
                  { requirement: t("obstructing"), image: 'https://s.headshots.fun/create-studio/no-objects-obstructing.jpg', type: 'negative' }
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
                      <p>{t("detailed_explanation_for")} {requirement}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
              <div className="pt-5 text-xs text-muted-foreground">
                {t("if_you_have_any_questions_about_the_photos")}
                <Link href="/privacy-policy"> {t("our_privacy_policy")} </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
}
