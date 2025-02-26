import React, { useState, useEffect } from "react";
import { Search, MoreVertical, Plus, Pencil, Trash2 } from "lucide-react";
import { Button, Input } from "@/components/ui";
import CustomSelect from "@/components/select/CustomSelect";
import CustomDropdown from "@/components/dropdown/CustomDropdown";
import CustomDialog from "../Dialog/CustomDialog";

interface Section {
  id: number;
  name: string;
  abbreviation?: string;
}

interface SectionProps {
  title: string;
  sections: Section[];
  isLoading: boolean;
  error: any;
  formComponent: React.ReactElement<{ setIsOpen: (isOpen: boolean) => void }>;
}

const CustomSection: React.FC<SectionProps> = ({
  title,
  sections,
  isLoading,
  error,
  formComponent,
}) => {
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    if (sections.length > 0) {
      setSelectedSection(sections[0]);
    }
  }, [sections]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="space-y-4 flex flex-col h-[500px]">
      <div className=" flex flex-col border rounded-md gap-2 px-2 pb-2">
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
      </div>
      {/* this part should not overflow and be scrollable but why is it that it overflowed in the fixed height i set in the page which is 500px */}
      <div className="border rounded-md flex flex-col flex-1 overflow-auto">
        <div className="flex-1">
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
                      onClick: () => {},
                    },
                    {
                      label: "Delete",
                      icon: <Trash2 className="h-4 w-4 mr-2 text-red-500" />,
                      onClick: () => {},
                    },
                  ]}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <CustomDialog
        buttonTitle={`Add ${title}`}
        title={`Add ${title}`}
        description={`Add ${title}`}
        footerButtonTitle="Save"
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
      >
        {React.cloneElement(formComponent, {
          setIsOpen: setIsDialogOpen,
        })}
      </CustomDialog>
    </div>
  );
};

export default CustomSection;
