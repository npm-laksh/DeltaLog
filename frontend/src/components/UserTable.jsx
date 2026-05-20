import React from "react";
import { Avatar, AvatarFallback } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Pencil, Trash2, Eye } from "lucide-react"; 

export default function UserTable({
  filteredUsers,
  openEditModal,
  openDeleteDialog,
  openLogsModal 
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

            <th className="px-6 py-3 text-left text-xs uppercase tracking-wider text-muted-foreground">
              Activity Metrics
            </th>

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
                      {user?.username
                        ? user.username.charAt(0).toUpperCase()
                        : "U"}
                    </AvatarFallback>
                  </Avatar>

                  <span className="font-medium">{user.username}</span>
                </div>
              </td>

              <td className="px-6 py-4 text-muted-foreground">{user.email}</td>

              <td className="px-6 py-4">
                <Badge variant="secondary">{user.role}</Badge>
              </td>

              <td className="px-6 py-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 gap-1.5 text-xs font-semibold"
                  onClick={() => openLogsModal(user)}
                >
                  <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                  View Logs
                </Button>
              </td>

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
