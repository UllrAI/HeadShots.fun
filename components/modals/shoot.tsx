import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Camera, Square, RectangleHorizontal, Coins } from "lucide-react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { categories, styles, domainPath } from "@/components/shared/styles";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getUserCredits, spendCredits } from "@/lib/credits";

interface ShootModalProps {
    studioId: string;
    onShootComplete?: () => void;
}

export function ShootModal({ studioId, onShootComplete }: ShootModalProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedStyle, setSelectedStyle] = useState("");
    const [customPrompt, setCustomPrompt] = useState("");
    const [aspectRatio, setAspectRatio] = useState("Portrait");
    const [showNegativePrompt, setShowNegativePrompt] = useState(false);
    const [customNegativePrompt, setCustomNegativePrompt] = useState("");
    const [isCustomPrompt, setIsCustomPrompt] = useState(false);
    const [isShooting, setIsShooting] = useState(false);
    const [userCredits, setUserCredits] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const fetchCredits = async () => {
            try {
                const credits = await getUserCredits();
                setUserCredits(credits);
            } catch (error) {
                console.error("Failed to fetch user credits:", error);
                toast.error("Failed to fetch user credits. Please try again.");
            }
        };
        fetchCredits();
    }, []);

    const filteredStyles = useMemo(() => {
        return selectedCategory === "all"
            ? styles
            : styles.filter(style => style.category === selectedCategory);
    }, [selectedCategory]);

    const handleShoot = async () => {
        setIsShooting(true);
        const selectedStyleData = styles.find(style => style.name === selectedStyle); 
        const prompt = isCustomPrompt ? customPrompt : selectedStyleData?.prompt;
        const negative_prompt = isCustomPrompt ? customNegativePrompt : selectedStyleData?.negative_prompt;
        const style = isCustomPrompt ? "Custom" : selectedStyleData?.name;

        if (userCredits <= 0) {
            toast.error("Insufficient credits. Please add more credits to continue.");
            setIsShooting(false);
            return;
        }

        try {
            const response = await fetch(`/api/studio/${studioId}/shoot`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    style: style,
                    prompt,
                    negative_prompt,
                    aspectRatio,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to start shoot');
            }

            const data = await response.json();
            console.log("Shoot started:", data);

            // Deduct 1 credit after successful shoot
            const newCredits = await spendCredits(1);
            setUserCredits(newCredits);

            toast.success("Shoot started successfully. 1 credit used.");
            router.refresh();
            setIsOpen(false);
            if (onShootComplete) {
                onShootComplete();
            }
        } catch (error) {
            console.error("Error starting shoot:", error);
            toast.error("Failed to start shoot. Please try again or contact support.");
        } finally {
            setIsShooting(false);
        }
    };

    return (
        <>
            <Button variant="default" onClick={() => setIsOpen(true)}>
                <Camera className="mr-2 size-4" />
                Shoot
            </Button>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="h-[90vh] max-w-6xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Select Style</DialogTitle>
                    </DialogHeader>
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                        {categories.map((category) => (
                            <Button
                                key={category.id}
                                onClick={() => {
                                    setSelectedCategory(category.id);
                                    setSelectedStyle("");
                                    setIsCustomPrompt(false);
                                }}
                                variant={selectedCategory === category.id && !isCustomPrompt ? "default" : "outline"}
                                className="rounded-full px-4 py-2"
                            >
                                {category.name}
                            </Button>
                        ))}
                        <Button
                            onClick={() => {
                                setIsCustomPrompt(true);
                                setSelectedCategory("");
                            }}
                            variant={isCustomPrompt ? "default" : "outline"}
                            className="rounded-full px-4 py-2"
                        >
                            Custom
                        </Button>
                    </div>
                    {isCustomPrompt ? (
                        <div className="mt-4 h-[54vh] gap-4 lg:h-[60vh]">
                            <div>
                                <Label htmlFor="customPrompt">Custom Prompt (required)</Label>
                                <Textarea
                                    id="customPrompt"
                                    value={customPrompt}
                                    onChange={(e) => setCustomPrompt(e.target.value)}
                                    placeholder="Enter your custom prompt here..."
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <Button
                                    onClick={() => setShowNegativePrompt(!showNegativePrompt)}
                                    variant="outline"
                                    size="sm"
                                    className="mt-4"
                                >
                                    {showNegativePrompt ? "Hide" : "Show"} Advanced Settings
                                </Button>
                                {showNegativePrompt && (
                                    <div className="mt-2">
                                        <Label htmlFor="customNegativePrompt">Custom Negative Prompt (optional)</Label>
                                        <Textarea
                                            id="customNegativePrompt"
                                            value={customNegativePrompt}
                                            onChange={(e) => setCustomNegativePrompt(e.target.value)}
                                            placeholder="Enter your custom negative prompt here..."
                                            className="mt-1"
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <RadioGroup
                            className="grid h-[54vh] grid-cols-3 gap-4 overflow-y-auto md:grid-cols-6 lg:h-[60vh]"
                            value={selectedStyle}
                            onValueChange={setSelectedStyle}
                        >
                            {filteredStyles.map((style, index) => (
                                <div key={index} className="relative">
                                    <RadioGroupItem
                                        value={style.name}
                                        id={`style-${index}`}
                                        className="peer sr-only"
                                    />
                                    <Label
                                        htmlFor={`style-${index}`}
                                        className="flex cursor-pointer flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
                                    >
                                        <div className="relative mb-2 aspect-square w-full">
                                            <img
                                                src={`${domainPath}/${style.img}`}
                                                alt={style.name}
                                                className="size-full rounded-md object-cover"
                                            />
                                            {style.hot && (
                                                <span className="absolute right-1 top-1 rounded-xl bg-yellow-400 px-2 py-1 text-xs font-bold text-yellow-900">HOT</span>
                                            )}
                                            {style.isNew && (
                                                <span className="absolute right-1 top-1 rounded-xl bg-destructive px-2 py-1 text-xs font-bold text-white">NEW</span>
                                            )}
                                        </div>
                                        <span className="text-xs font-normal">{style.name}</span>
                                    </Label>
                                </div>
                            ))}
                        </RadioGroup>
                    )}
                    <DialogFooter className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-x-4 md:space-y-0">
                        <div className="flex w-full flex-wrap items-center justify-start space-x-2 space-y-4 md:space-x-4 md:space-y-0">
                            <Label htmlFor="aspect-ratio" className="mr-2 mt-4 lg:mt-0">
                                Aspect Ratio:
                            </Label>
                            <Button
                                variant={aspectRatio === "Portrait" ? "default" : "outline"}
                                onClick={() => setAspectRatio("Portrait")}
                                title="Portrait (3:4)"
                                className="gap-1"
                            >
                                <RectangleHorizontal className="size-4 rotate-90" />
                                <span className="hidden lg:inline">Portrait</span>
                            </Button>
                            <Button
                                variant={aspectRatio === "Landscape" ? "default" : "outline"}
                                onClick={() => setAspectRatio("Landscape")}
                                title="Landscape (4:3)"
                                className="gap-1"
                            >
                                <RectangleHorizontal className="size-4" />
                                <span className="hidden lg:inline">Landscape</span>
                            </Button>
                            <Button
                                variant={aspectRatio === "Square" ? "default" : "outline"}
                                onClick={() => setAspectRatio("Square")}
                                title="Square (1:1)"
                                className="gap-1"
                            >
                                <Square className="size-4" />
                                <span className="hidden lg:inline">Square</span>
                            </Button>
                        </div>
                        <div className="flex w-full flex-col items-center justify-between md:w-auto md:flex-row">
                            {userCredits <= 0 && (
                                <Button
                                    onClick={() => router.push('/pricing')}
                                    className="flex items-center whitespace-nowrap"
                                >
                                    <Coins className="mr-2 size-4" />
                                    Buy Credits
                                </Button>
                            )}
                            {userCredits > 0 && (
                                <Button
                                    onClick={handleShoot}
                                    disabled={(isCustomPrompt && !customPrompt.trim()) || (!isCustomPrompt && !selectedStyle) || isShooting || userCredits <= 0}
                                    className="flex items-center whitespace-nowrap"
                                >
                                    <Camera className="mr-2 size-4" />
                                    {isShooting ? "Shooting..." : "Shoot"}
                                </Button>
                            )}
                           
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}