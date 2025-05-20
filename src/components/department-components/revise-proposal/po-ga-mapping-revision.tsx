import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Info, RotateCcw } from "lucide-react";
import { sampleGraduateAttributes } from "@/store/revision/sample-data/data";
import { useRevisionStore } from "@/store/revision/revision-store";

export function POGAMappingRevision() {
  const { pos, po_ga_mappings, togglePOGAMapping, resetSection, isModified } =
    useRevisionStore();
  const [expandedPO, setExpandedPO] = useState<number | null>(null);

  // Function to toggle a mapping between a PO and a GA
  const handleToggleMapping = (po_id: number, ga_id: number) => {
    togglePOGAMapping(po_id, ga_id);
  };

  // Function to check if a mapping exists
  const isMapped = (po_id: number, ga_id: number) => {
    return po_ga_mappings.some(
      (mapping) => mapping.po_id === po_id && mapping.ga_id === ga_id
    );
  };

  // Function to toggle expanded state for a PO
  const toggleExpanded = (po_id: number) => {
    setExpandedPO(expandedPO === po_id ? null : po_id);
  };

  // Function to reset changes
  const handleReset = () => {
    resetSection("po_ga_mappings");
  };

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            Program Outcome to Graduate Attribute Mapping
          </h2>
          {isModified("po_ga_mappings") && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="flex items-center"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Changes
            </Button>
          )}
        </div>

        <div className="text-sm text-gray-500 mb-4">
          <p>
            Map each Program Outcome (PO) to the relevant Graduate Attributes
            (GAs) that it contributes to. This mapping helps ensure that all
            program outcomes are aligned with the university&apos;s graduate
            attributes.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2 text-left w-1/3">Program Outcome</th>
                {sampleGraduateAttributes.map((ga) => (
                  <th key={ga.id} className="border p-2 text-center">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex flex-col items-center cursor-help">
                          <span>GA {ga.ga_no}</span>
                          <Info className="h-4 w-4 text-gray-400 mt-1" />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="top" className="max-w-sm">
                        <p className="font-semibold">{ga.name}</p>
                        <p className="text-xs mt-1">{ga.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pos.map((po) => (
                <tr key={po.id} className="hover:bg-gray-50">
                  <td className="border p-2">
                    <div className="flex flex-col">
                      <button
                        onClick={() => toggleExpanded(po.id)}
                        className="text-left font-medium text-blue-600 hover:text-blue-800"
                      >
                        {po.name}
                      </button>
                      {expandedPO === po.id && (
                        <div className="mt-2 text-sm text-gray-600">
                          {po.statement}
                        </div>
                      )}
                    </div>
                  </td>
                  {sampleGraduateAttributes.map((ga) => (
                    <td key={ga.id} className="border p-2 text-center">
                      <Checkbox
                        checked={isMapped(po.id, ga.id)}
                        onCheckedChange={() =>
                          handleToggleMapping(po.id, ga.id)
                        }
                        className="mx-auto"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Card className="mt-6">
          <CardContent className="pt-6">
            <h3 className="text-lg font-medium mb-2">
              Graduate Attributes Legend
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sampleGraduateAttributes.map((ga) => (
                <div key={ga.id} className="flex items-start">
                  <div className="bg-gray-100 rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">
                    {ga.ga_no}
                  </div>
                  <div>
                    <p className="font-medium">{ga.name}</p>
                    <p className="text-sm text-gray-600">{ga.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}
