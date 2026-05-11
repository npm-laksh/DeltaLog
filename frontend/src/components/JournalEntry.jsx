import * as React from "react";
import { useState } from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Plus } from "lucide-react";

export default function JournalEntry() {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "To Do",
  });

  const handleAddTask = () => {
    if (!formData.title.trim()) return;

    const now = new Date();
    const newTask = {
      ...formData,
      id: Date.now(),
      createdAt: now.toLocaleString(),
      updatedAt: now.toLocaleString(),
    };

    setTasks((prev) => [newTask, ...prev]);
    setFormData({ title: "", description: "", status: "To Do" });
    setOpen(false);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Journal Entries</h2>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2" variant="outline">
              <Plus className="w-4 h-4" /> Add New Task
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-lg bg-white text-black border border-slate-200 shadow-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                Create Task
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Title
                </label>
                <Input
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  placeholder="What needs to be done?"
                  className="bg-white border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Description
                </label>
                <Textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Add some details..."
                  className="resize-none bg-white border-slate-200"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">
                  Status
                </label>
                <Select
                  value={formData.status}
                  onValueChange={(val) =>
                    setFormData({ ...formData, status: val })
                  }
                >
                  <SelectTrigger className="w-full bg-white border-slate-200">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>

                  <SelectContent
                    position="popper"
                    align="start"
                    sideOffset={4}
                    className="z-[110] w-[var(--radix-select-trigger-width)] bg-white text-black shadow-lg border border-slate-200"
                  >
                    <SelectItem value="To Do">To Do</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-center mt-2">
              <Button
                onClick={handleAddTask}
                variant="outline"
                className="px-8 hover:bg-slate-50"
              >
                Create Task
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Task List Section */}

      <div className="grid gap-4">
        {tasks.map((task) => (
          <Card key={task.id} className="bg-background border">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg text-foreground">
                  {task.title}
                </CardTitle>

                <span className="px-2 py-1 rounded text-xs font-semibold bg-muted text-muted-foreground border">
                  {task.status}
                </span>
              </div>
            </CardHeader>

            <CardContent>
              <p className="text-sm text-muted-foreground mb-2">
                {task.description}
              </p>

              <p className="text-[10px] text-muted-foreground">
                Created: {task.createdAt}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
