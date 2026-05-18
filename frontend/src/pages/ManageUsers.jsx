import React, { useState, useEffect } from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { toast, Toaster } from "sonner"; 
import Navbar from "../components/common/Navbar";
import UserTable from "../components/UserTable";
import CreateUserDialog from "../components/CreateUserDialog";
import EditUserDialog from "../components/EditUserDialog";
import DeleteUserDialog from "../components/DeleteUserDialog";
import { getAllUsers } from "../services/getallusers"
import { deleteuser } from "../services/deleteuser";
import { updateUser } from "../services/updateuser";

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);


  const username = localStorage.getItem('username');

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "USER",
    password: ""
  });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const data = await getAllUsers();
        setUsers(data || []);
      } catch (err) {
        toast.error("Error fetching users from server");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  // defensive filter logic to match user req DTO
  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    const username = user.username?.toLowerCase() || "";
    const email = user.email?.toLowerCase() || "";
    const role = user.role?.toLowerCase() || "";

    return username.includes(query) || email.includes(query) || role.includes(query);
  });

  const openEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      username: user.username,
      email: user.email,
      role: user.role,
      password: ""
    });
    setIsEditModalOpen(true);
  };

  const openDeleteDialog = (user) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleAddUser = () => {
    setIsAddModalOpen(false);
    toast.info("Registration logic is handled via /register-user");
  };

  const handleEditUser = async () => {
  if (!selectedUser) return;

  try {
    const updatedPayload = {
      id: selectedUser.id,
      username: formData.username,
      email: formData.email,
      role: formData.role,
      password: formData.password || "", // if empty string -> backend "don't change" pw
    };

    await updateUser(updatedPayload);

    // ui updated
    setUsers(
      users.map((u) =>
        u.id === selectedUser.id
          ? { ...u, username: formData.username, email: formData.email, role: formData.role }
          : u
      )
    );

    setIsEditModalOpen(false);
    setSelectedUser(null);
    toast.success("User configuration updated successfully");
  } catch (err) {
    toast.error(err.response?.data || "Failed to submit user updates");
  }
};

  const handleDeleteUser = async () => {

  if (!selectedUser) return;

  try {
    setIsDeleteDialogOpen(false);

    await deleteuser(selectedUser.username);
    
    setUsers(users.filter((user) => user.id !== selectedUser.id));

    toast.success(`User '${selectedUser.username}' deleted successfully`);
    setSelectedUser(null);
  } catch (err) {
    toast.error("Failed to delete user from server");
  }
};

  return (
    <div className="w-full min-h-screen bg-background">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              User Management
            </h1>
            <p className="text-muted-foreground">
              Monitor employee activity and manage system access.
            </p>
          </div>
          <Button onClick={() => setIsAddModalOpen(true)} className="rounded-full px-6">
            <Plus className="w-4 h-4 mr-2" />
            Add New User
          </Button>
        </div>

        <div className="bg-card rounded-xl shadow-sm border overflow-hidden">
          <div className="p-4 border-b bg-muted/20">
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background"
              />
            </div>
          </div>

          {loading ? (
            <div className="p-20 text-center text-muted-foreground animate-pulse">
              Fetching team members...
            </div>
          ) : (
            <UserTable
              filteredUsers={filteredUsers}
              openEditModal={openEditModal}
              openDeleteDialog={openDeleteDialog}
            />
          )}

          {!loading && filteredUsers.length === 0 && (
            <div className="p-20 text-center border-t">
              <p className="text-muted-foreground">No users found.</p>
            </div>
          )}
        </div>
      </div>

      {/* Dialogs */}
      <CreateUserDialog
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        formData={formData}
        setFormData={setFormData}
        handleAddUser={handleAddUser}
      />

      <EditUserDialog
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        formData={formData}
        setFormData={setFormData}
        handleEditUser={handleEditUser}
      />

      <DeleteUserDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        selectedUser={selectedUser}
        handleDeleteUser={handleDeleteUser}
      />

      <Toaster richColors position="top-center" />
    </div>
  );
}