import React, { useState, useEffect, useCallback } from "react";
import { Search, MoreVertical, Plus, Pencil, Trash2 } from "lucide-react";
import { Button, Input } from "@/components/ui";

import CustomSelect from "@/components/select/CustomSelect";
import CustomDropdown from "@/components/dropdown/CustomDropdown";

interface Section {
  id: number;
  name: string;
  abbreviation?: string;
}

interface SectionProps {
  title: string;
  sections: Section[];
  fetchSections: () => void;
}

const CustomSection: React.FC<SectionProps> = ({
  title,
  sections,
  fetchSections,
}) => {
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);

  useEffect(() => {
    fetchSections();
  }, []);

  return (
    <div className="space-y-4 flex flex-col">
      <h2 className="text-lg font-medium">{title}</h2>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder={`Search ${title}`} className="pl-8" />
        </div>

        <CustomSelect
          defaultValue="asc"
          options={[
            { value: "asc", label: "A - Z" },
            { value: "desc", label: "Z - A" },
          ]}
        />
      </div>

      <div className="border border-rounded-lg h-64 flex flex-col flex-1 ">
        <div className="flex-1 overflow-y-auto">
          {sections.map((section) => (
            <div
              key={section.id}
              className={`flex items-center justify-between p-3 hover:bg-muted/70 ${
                selectedSection?.id === section.id ? "bg-primary/10" : ""
              }`}
              onClick={() => setSelectedSection(section)}
            >
              <span>
                {section.name} ({section.abbreviation}){" "}
              </span>

              {selectedSection === section && (
                <CustomDropdown
                  actions={[
                    {
                      label: "Edit",
                      icon: <Pencil className="h-4 w-4 mr-2" />,
                      onClick: () => console.log("Edit button got clicked"),
                    },
                    {
                      label: "Delete",
                      icon: <Trash2 className="h-4 w-4 mr-2 text-red-500" />,
                      onClick: () => console.log("Delete button got clicked"),
                    },
                  ]}
                />
              )}
            </div>
          ))}
        </div>
        <Button
          variant="ghost"
          size="sm"
          className=" px-2 py-2 border-t rounded-md hover:bg-primary/80 hover:text-primary-foreground"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add {title}
        </Button>
      </div>
    </div>
  );
};

export default CustomSection;
