import { Pencil, Trash2 } from "lucide-react";

import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Avatar, AvatarFallback } from "../components/ui/avatar";

export default function UserTable({
  filteredUsers,
  openEditModal,
  openDeleteDialog,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-muted/50 border-b">
          <tr>
            <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground">
              Name
            </th>

            <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground">
              Email
            </th>

            <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground">
              Role
            </th>

            {/* <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground">
              Status
            </th> */}

            {/* <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground">
              Joined Date
            </th> */}

            <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y">
          {filteredUsers.map((user) => (
            <tr key={user.id} className="hover:bg-muted/50">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                    {/* fallback to U if username does not exist */}
                      {user?.username
                        ? user.username.charAt(0).toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>

                  <span>{user.name}</span>
                </div>
              </td>

              <td className="px-6 py-4 text-muted-foreground">{user.email}</td>

              <td className="px-6 py-4">
                <Badge variant="secondary">{user.role}</Badge>
              </td>
{/* 
              <td className="px-6 py-4">
                <Badge
                  variant={user.status === "active" ? "default" : "outline"}
                  className={
                    user.status === "active"
                      ? "bg-green-100 text-green-700 hover:bg-green-100 border-green-200"
                      : ""
                  }
                >
                  {user.status}
                </Badge>
              </td> */}

              {/* <td className="px-6 py-4 text-muted-foreground">
                {user.joinedDate}
              </td> */}

              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openEditModal(user)}
                  >
                    <Pencil className="w-4 h-4" />
                  </Button>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => openDeleteDialog(user)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
