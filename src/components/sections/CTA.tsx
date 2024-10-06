import { Button } from "@/components/ui/button";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CTA() {
    return (
        <section className="py-16 text-muted-foreground">
            <MaxWidthWrapper>
                <Card className="rounded-xl border border-secondary bg-secondary">
                    <CardHeader>
                        <CardTitle className="text-center text-3xl font-semibold text-secondary-foreground">
                            Wanna look like a superstar? Let&apos;s do this!
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="mx-auto mb-6 max-w-3xl text-muted-foreground">
                            Sick of your same old selfies? Our AI photo booth is here to spice things up! We&apos;ve got you!<br />No fancy gear needed – just a few clicks and boom! You&apos;re ready to wow the world!
                        </p>
                        <Button size="lg" variant="default" className="transition-all hover:rotate-2 hover:scale-110">
                            Make Me Look Awesome!
                        </Button>
                    </CardContent>
                </Card>
            </MaxWidthWrapper>
        </section>
    );
}
