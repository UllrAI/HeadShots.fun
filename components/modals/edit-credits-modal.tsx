import {
  useState,
} from "react";
import { toast } from "sonner";
import { User } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { updateCredits } from "@/lib/credits";


export function useEditCreditsModal() {
  const [showEditCreditsModal, setShowEditCreditsModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const EditCreditsModal = ({ onUpdate }: { onUpdate: (newCredits: number) => void }) => {
    const [newCredits, setNewCredits] = useState(selectedUser?.credits || 0);

    const handleUpdateCredits = async () => {
      if (selectedUser) {
        try {
          const updatedCredits = await updateCredits(
            newCredits - (selectedUser.credits || 0),
            newCredits > (selectedUser.credits || 0) ? 'PURCHASE' : 'USAGE',
            selectedUser.id
          );
          onUpdate(updatedCredits);
          setShowEditCreditsModal(false);
          toast.success("Credits updated successfully");
        } catch (error) {
          console.error("Failed to update credits:", error);
          toast.error("Failed to update credits");
        }
      }
    };

    return (
      <Modal showModal={showEditCreditsModal} setShowModal={setShowEditCreditsModal}>
        <div className="w-full overflow-hidden shadow-xl md:max-w-md md:rounded-2xl md:border md:border-border">
          <div className="flex flex-col items-center justify-center space-y-3 border-b border-border bg-background px-4 py-6 pt-8 text-center md:px-16">
            <h3 className="font-display text-2xl font-bold text-foreground">Edit Credits</h3>
            <p className="text-sm text-muted-foreground">
              Update credits for {selectedUser?.name}
            </p>
          </div>
          <div className="flex flex-col space-y-4 bg-muted px-4 py-8 md:px-16">
            <input
              type="number"
              value={newCredits}
              onChange={(e) => setNewCredits(Number(e.target.value))}
              className="rounded-md border border-input bg-background px-3 py-2 text-foreground"
            />
            <Button onClick={handleUpdateCredits}>Update Credits</Button>
          </div>
        </div>
      </Modal>
    );
  };

  return {
    setShowEditCreditsModal,
    setSelectedUser,
    EditCreditsModal,
  };
}
