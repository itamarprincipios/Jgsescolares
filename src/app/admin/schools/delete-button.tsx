"use client";

import { deleteSchool } from "@/app/actions/schools";
import DeleteButton from "@/components/delete-button";

interface DeleteSchoolButtonProps {
    schoolId: string;
    schoolName: string;
}

export default function DeleteSchoolButton({ schoolId, schoolName }: DeleteSchoolButtonProps) {
    const handleDelete = async () => {
        await deleteSchool(schoolId);
    };

    return <DeleteButton onDelete={handleDelete} itemName={schoolName} />;
}
