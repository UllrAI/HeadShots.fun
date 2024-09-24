"use client";

import { useEditCreditsModal } from "@/components/modals/edit-credits-modal";
import { Icons } from "@/components/shared/icons";
import { User } from "@prisma/client";

interface EditCreditsSectionProps {
  user: User;
  onUpdate: (userId: string, newCredits: number) => void;
}

export function EditCreditsSection({ user, onUpdate }: EditCreditsSectionProps) {
    const { setShowEditCreditsModal, setSelectedUser, EditCreditsModal } =
        useEditCreditsModal();

    const handleEditCredits = () => {
        setSelectedUser(user);
        setShowEditCreditsModal(true);
    };

    const handleCreditsUpdate = (newCredits: number) => {
        onUpdate(user.id, newCredits);
    };

    return (
        <>
            <EditCreditsModal onUpdate={handleCreditsUpdate} />
            <a
                className="cursor-pointer pl-2 text-xs text-muted-foreground"
                onClick={handleEditCredits}
            >
                <Icons.pencil className="size-3" />
            </a>
        </>
    );
}
