import { HeaderSection } from "@/components/shared/header-section"
import MaxWidthWrapper from "@/components/shared/max-width-wrapper"
import { Icons } from "@/components/shared/icons";
import { useTranslations } from "next-intl";

export default function StepsSection() {
    const t = useTranslations("StepsSection");
    const steps = [
        {
            icon: Icons.camera,
            title: t("uploadYourSelfies"),
            description: t("uploadYourSelfiesDescription")
        },
        {
            icon: Icons.palette,
            title: t("personalizeYourStyle"),
            description: t("personalizeYourStyleDescription")
        },
        {
            icon: Icons.sparkles,
            title: t("instantAIMagic"),
            description: t("instantAIMagicDescription")
        }
    ]

    return (
        <section aria-labelledby="steps-section-title" className="px-2.5 py-12 lg:px-7">
            <MaxWidthWrapper>
                <HeaderSection
                    label={t("quickAndEasyProcess")}
                    title={t("createFunAndProHeadshotsIn3SimpleSteps")}
                    subtitle={t("experienceTheFastestAITechnologyAtHeadShotsFunForStunningPersonalizedHeadshotsPerfectForEveryOccasion")}
                />

                <div className="mt-16 grid gap-12 sm:grid-cols-2 lg:grid-cols-3">
                    {steps.map((step, index) => (
                        <div
                            className="group relative"
                            key={step.title}
                        >
                            <div className="mb-4 flex items-center">
                                <div className="flex size-10 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
                                    <step.icon className="size-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <span className="text-md ml-4 font-medium text-purple-600 dark:text-purple-400">{t("step")} {index + 1}</span>
                            </div>

                            <h3 className="mb-2 text-xl font-semibold tracking-tight text-foreground">
                                {step.title}
                            </h3>

                            <p className="text-sm text-muted-foreground">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </MaxWidthWrapper>
        </section>
    )
}