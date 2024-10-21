import { Button } from "@/components/ui/button";
import MaxWidthWrapper from "@/components/shared/max-width-wrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslations } from "next-intl";

export default function CTA() {
    const t = useTranslations("CTA");

    return (
        <section className="py-16 text-muted-foreground">
            <MaxWidthWrapper>
                <Card className="rounded-xl border border-secondary bg-secondary">
                    <CardHeader>
                        <CardTitle className="text-center text-3xl font-semibold text-secondary-foreground">
                            {t("title")}
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="mx-auto mb-6 max-w-3xl text-muted-foreground">
                            {t("description")}
                        </p>
                        <Button size="lg" variant="default" className="transition-all hover:rotate-2 hover:scale-110">
                            {t("button")}
                        </Button>
                    </CardContent>
                </Card>
            </MaxWidthWrapper>
        </section>
    );
}
