import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";

import { registeruser } from "../services/registeruser";
export default function CreateUserDialog({
  open,
  onOpenChange,
  formData,
  setFormData,
  handleAddUser,
}) {

  const handleCreateUser = async () => {
    try {
      const payload = {
        username: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      };

      const response = await registeruser(payload);

      const newCreatedUser = response.data || response;

      handleAddUser(newCreatedUser);
      setFormData({ username: "", email: "", role: "USER", password: "" });

      onOpenChange(false);

      // toast.success("User created successfully");

    } catch (err) {
      console.error(err);

      toast.error("Failed to create user");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New User</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label htmlFor="add-name">
              Name
            </Label>

            <Input
              id="add-name"
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  name: e.target.value,
                })
              }
              placeholder="Enter full name"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="add-email">
              Email
            </Label>

            <Input
              id="add-email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  email: e.target.value,
                })
              }
              placeholder="email@example.com"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="add-password">
              Password
            </Label>

            <Input
              id="add-password"
              type="password"
              value={formData.password || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  password: e.target.value,
                })
              }
              placeholder="Enter password"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="add-role">
              Role
            </Label>

            <Select
              value={formData.role}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  role: value,
                })
              }
            >
              <SelectTrigger
                id="add-role"
                className="mt-1.5"
              >
                <SelectValue />
              </SelectTrigger>

              <SelectContent>
                <SelectItem value="EMPLOYEE">
                  User
                </SelectItem>

                <SelectItem value="ADMIN">
                  Admin
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>

          <Button
            onClick={handleCreateUser}
            disabled={
              !formData.name ||
              !formData.email ||
              !formData.password
            }
          >
            Add User
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
