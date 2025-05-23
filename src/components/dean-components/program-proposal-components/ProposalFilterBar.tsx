import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { LightbulbIcon, Search, FilterIcon } from "lucide-react";

type ProposalFilterBarProps = {
  proposalCount: number;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  selectedDepartment: string;
  onDepartmentChange: (department: string) => void;
  departments: string[];
  title?: string;
};

export function ProposalFilterBar({
  proposalCount,
  searchTerm,
  onSearchChange,
  selectedDepartment,
  onDepartmentChange,
  departments,
  title = "All Program Proposals",
}: ProposalFilterBarProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
      <div className="flex items-center gap-2">
        <LightbulbIcon className="h-6 w-6 text-amber-500" />
        <h1 className="text-xl font-bold">{title}</h1>
        <Badge variant="outline" className="ml-2">
          {proposalCount} Proposals
        </Badge>
      </div>

      <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search proposals..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        <div className="w-full md:w-48">
          <Select value={selectedDepartment} onValueChange={onDepartmentChange}>
            <SelectTrigger>
              <div className="flex items-center gap-2">
                <FilterIcon className="h-4 w-4" />
                <SelectValue placeholder="Filter by department" />
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>
                  {dept}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
