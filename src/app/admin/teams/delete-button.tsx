"use client";

import { deleteTeam } from "@/app/actions/teams";
import DeleteButton from "@/components/delete-button";

interface DeleteTeamButtonProps {
    teamId: string;
    teamName: string;
}

export default function DeleteTeamButton({ teamId, teamName }: DeleteTeamButtonProps) {
    const handleDelete = async () => {
        await deleteTeam(teamId);
    };

    return <DeleteButton onDelete={handleDelete} itemName={teamName} />;
}
