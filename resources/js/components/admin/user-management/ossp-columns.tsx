import { Button } from "@/components/ui/button";
import { DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { User } from "@/types";
import { Link } from "@inertiajs/react";
import { CellContext, ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, SquarePen, Trash2 } from "lucide-react";
import { route } from "ziggy-js";   

// Helper to format date as MM/DD/YYYY - HH:MM
const formatDateTime = (dateString: string) => {
    const d = new Date(dateString);
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    const yyyy = d.getFullYear();

    let hh = d.getHours();
    const min = String(d.getMinutes()).padStart(2, '0');
    const ampm = hh >= 12 ? 'PM' : 'AM';
    hh = hh % 12;
    hh = hh === 0 ? 12 : hh; // convert 0 to 12 for midnight
    const hourStr = String(hh).padStart(2, '0');

    return `${mm}/${dd}/${yyyy} - ${hourStr}:${min} ${ampm}`;
};

export function getColumns(onDelete: (user: User) => void): ColumnDef<User>[] {
    return [
        {
            id: "employee_number",
            accessorKey: "employee_number",
            header: "Employee No.",
        },
        {
            id: "first_name",
            accessorKey: "first_name",
            header: "First Name",
        },
        {
            id: "middle_name",
            accessorKey: "middle_name",
            header: "Middle Name",
        },
        {
            id: "last_name",
            accessorKey: "last_name",
            header: "Last Name",
        },
        {
            id: "email",
            accessorKey: "email",
            header: "Email",
        },
        {
            id: "role",
            header: "Role",
            cell: ({ row }) => row.original.role?.name ?? "N/A",
        },
                {
            id: "section",
            header: "Section",
            cell: ({ row }) => row.original.section?.sections_name ?? "N/A",
        },
        {
            id: "created_at",
            accessorKey: "created_at",
            header: "Created At",
            cell: (ctx: CellContext<User, any>) =>
            formatDateTime(ctx.row.original.created_at),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const user = row.original;

                return (

                      <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end">

                        <DropdownMenuItem asChild>
                            <Link
                                href={route('admin-panel.users.edit', user.id)}
                                className="flex items-center gap-2"
                            >
                                <SquarePen className="h-4 w-4" />
                                Edit
                            </Link>
                        </DropdownMenuItem>

                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            className="text-red-600 focus:text-red-600"
                            onClick={() => onDelete(user)}
                        >
                            <Trash2 className="mr-2 h-4 w-4 text-red-600 focus:text-red-600" />
                            Delete
                        </DropdownMenuItem>
                        
                    </DropdownMenuContent>
                </DropdownMenu>
                
                );
            },
        },
    ];
}
