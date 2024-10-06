import {
  Dispatch,
  SetStateAction,
  useCallback,
  useMemo,
  useState,
} from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { UserRole } from "@prisma/client";
import { User } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { UserAvatar } from "@/components/shared/user-avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { updateUserRole } from "@/actions/update-user-role";

function EditRoleModal({
  showEditRoleModal,
  setShowEditRoleModal,
  selectedUser,
}: {
  showEditRoleModal: boolean;
  setShowEditRoleModal: Dispatch<SetStateAction<boolean>>;
  selectedUser: User;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>(selectedUser.role);
  const { data: session } = useSession();

  async function editRole() {
    setSubmitting(true);
    try {
      const result = await updateUserRole(selectedUser.id, { role: selectedRole });
      if (result.status === "error") {
        toast.error(result.message || "Failed to update role");
      } else {
        toast.success("Successfully updated role!");
        setShowEditRoleModal(false);
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal
      showModal={showEditRoleModal}
      setShowModal={setShowEditRoleModal}
    >
      <div className="flex flex-col items-center justify-center space-y-3 border-b p-4 pt-8 sm:px-16">
        <UserAvatar
          user={{
            name: selectedUser.name || null,
            image: selectedUser.image || null,
          }}
        />
        <h3 className="text-lg font-semibold">Edit Role for {selectedUser.name}</h3>
        <p className="text-center text-sm text-muted-foreground">
          <b>Warning:</b> This will edit user role !
        </p>

      </div>

      <div className="p-4 sm:px-16">
        <Select
          value={selectedRole}
          onValueChange={(value) => setSelectedRole(value as UserRole)}
          disabled={session?.user?.id === selectedUser.id} // Disable if editing own role
        >
          <SelectTrigger className={`w-full ${session?.user?.id === selectedUser.id ? 'cursor-not-allowed opacity-50' : ''}`}>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={UserRole.USER}>User</SelectItem>
            <SelectItem value={UserRole.ADMIN}>Admin</SelectItem>
          </SelectContent>
        </Select>
        <Button
          onClick={editRole}
          disabled={submitting || session?.user?.id === selectedUser.id}
          className={`my-4 w-full ${session?.user?.id === selectedUser.id ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          {submitting ? "Updating..." : "Update Role"}
        </Button>
      </div>
      {session?.user?.id === selectedUser.id && (
        <p className="mt-2 pb-4 text-center text-sm text-destructive">
          You cannot change your own role.
        </p>
      )}
    </Modal>
  );
}

export function useEditRoleModal() {
  const [showEditRoleModal, setShowEditRoleModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const EditRoleModalCallback = useCallback(() => {
    if (!selectedUser) return null;
    return (
      <EditRoleModal
        showEditRoleModal={showEditRoleModal}
        setShowEditRoleModal={setShowEditRoleModal}
        selectedUser={selectedUser}
      />
    );
  }, [showEditRoleModal, setShowEditRoleModal, selectedUser]);

  return useMemo(
    () => ({
      setShowEditRoleModal,
      setSelectedUser,
      EditRoleModal: EditRoleModalCallback,
    }),
    [setShowEditRoleModal, EditRoleModalCallback],
  );
}
