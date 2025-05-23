import React from "react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Option {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: Option[];
  defaultValue?: string;
  onChange?: (value: string) => void;
  contentHeight?: string;
  isDisabled?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options = [],
  defaultValue,
  onChange,
  contentHeight = "h-20",
  isDisabled,
}) => {
  return (
    <Select
      defaultValue={defaultValue}
      onValueChange={onChange}
      disabled={isDisabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select" />
      </SelectTrigger>
      <SelectContent className={contentHeight}>
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default CustomSelect;
