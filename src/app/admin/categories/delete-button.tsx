"use client";

import { deleteCategory } from "@/app/actions/categories";
import DeleteButton from "@/components/delete-button";

interface DeleteCategoryButtonProps {
    categoryId: string;
    categoryName: string;
}

export default function DeleteCategoryButton({ categoryId, categoryName }: DeleteCategoryButtonProps) {
    const handleDelete = async () => {
        await deleteCategory(categoryId);
    };

    return <DeleteButton onDelete={handleDelete} itemName={categoryName} />;
}
