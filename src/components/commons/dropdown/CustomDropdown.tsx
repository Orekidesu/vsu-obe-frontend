import React from "react";
import { MoreVertical } from "lucide-react";
import { Button } from "@/components/ui";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DropdownAction {
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface CustomDropdownProps {
  actions: DropdownAction[];
  margin?: string; // Add margin prop
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({ actions, margin }) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-0">
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only"> Actions</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent style={{ margin: margin || "0" }}>
        {actions.map((action, index) => (
          <DropdownMenuItem key={index} onClick={action.onClick}>
            {action.icon}
            <span>{action.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CustomDropdown;
