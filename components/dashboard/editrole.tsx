"use client";

import { useEditRoleModal } from "@/components/modals/edit-role-modal";
import { Icons } from "@/components/shared/icons";
import { User } from "@prisma/client";

export function EditRoleSection({ user }: { user: User }) {
    const { setShowEditRoleModal, setSelectedUser, EditRoleModal } =
        useEditRoleModal();

    const handleEditRole = () => {
        setSelectedUser(user);
        setShowEditRoleModal(true);
    };

    return (
        <>
            <EditRoleModal />
            <a
                className="cursor-pointer pl-2 text-xs text-muted-foreground"
                onClick={handleEditRole}
            >
                <Icons.pencil className="size-3" />
            </a>
        </>
    );
}
