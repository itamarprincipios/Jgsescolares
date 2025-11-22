"use client";

import { deleteModality } from "@/app/actions/modalities";
import DeleteButton from "@/components/delete-button";

interface DeleteModalityButtonProps {
    modalityId: string;
    modalityName: string;
}

export default function DeleteModalityButton({ modalityId, modalityName }: DeleteModalityButtonProps) {
    const handleDelete = async () => {
        await deleteModality(modalityId);
    };

    return <DeleteButton onDelete={handleDelete} itemName={modalityName} />;
}
