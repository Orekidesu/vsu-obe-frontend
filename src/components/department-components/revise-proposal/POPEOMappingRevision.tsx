import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Info, RotateCcw } from "lucide-react";

import { useRevisionStore } from "@/store/revision/revision-store";

export function POPEOMappingRevision() {
  const {
    pos,
    peos,
    po_peo_mappings,
    togglePOPEOMapping,
    resetSection,
    isModified,
  } = useRevisionStore();
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  // Check if a PO is mapped to a PEO
  const isMapped = (po_id: number, peo_id: number | string) => {
    return po_peo_mappings.some(
      (mapping) => mapping.po_id === po_id && mapping.peo_id === peo_id
    );
  };

  // Handle mapping toggle
  const handleToggleMapping = (po_id: number, peo_id: number | string) => {
    togglePOPEOMapping(po_id, peo_id);
  };

  // Handle reset
  const handleReset = () => {
    resetSection("po_peo_mappings");
    setResetDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          Program Outcome to PEO Mapping
        </h2>
        <AlertDialog open={resetDialogOpen} onOpenChange={setResetDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              className="flex items-center gap-1"
              disabled={!isModified("po_peo_mappings")}
            >
              <RotateCcw className="h-4 w-4" />
              Reset Changes
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will reset all PO to PEO mapping changes to their original
                state. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleReset}>Reset</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <div className="border rounded-lg overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="sticky left-0 bg-gray-50 px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[200px]">
                Program Outcomes
              </th>
              {peos.map((peo, index) => (
                <th
                  key={peo.id}
                  className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider min-w-[120px]"
                >
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="cursor-help flex items-center justify-center">
                        PEO {index + 1}
                        <Info className="h-3 w-3 ml-1 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs p-2">
                        <p className="text-sm">{peo.statement}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pos.map((po) => (
              <tr key={po.id} className="hover:bg-gray-50">
                <td className="sticky left-0 bg-white hover:bg-gray-50 px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 border-r">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger className="cursor-help text-left flex items-start">
                        <span className="truncate max-w-[180px]">
                          {po.name}
                        </span>
                        <Info className="h-3 w-3 ml-1 text-gray-400 mt-1 flex-shrink-0" />
                      </TooltipTrigger>
                      <TooltipContent className="max-w-xs p-2">
                        <p className="text-sm font-medium mb-1">{po.name}</p>
                        <p className="text-xs">{po.statement}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </td>
                {peos.map((peo) => (
                  <td
                    key={`${po.id}-${peo.id}`}
                    className="px-6 py-4 whitespace-nowrap text-sm text-center"
                  >
                    <div className="flex justify-center">
                      <Checkbox
                        id={`po-${po.id}-peo-${peo.id}`}
                        checked={isMapped(po.id, peo.id)}
                        onCheckedChange={() =>
                          handleToggleMapping(po.id, peo.id)
                        }
                      />
                    </div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Program Outcomes (POs)</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[300px] overflow-y-auto">
            <ul className="space-y-4">
              {pos.map((po) => (
                <li
                  key={po.id}
                  className="border-b pb-3 last:border-b-0 last:pb-0"
                >
                  <p className="font-medium">
                    PO {po.id}: {po.name}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">{po.statement}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              Program Educational Objectives (PEOs)
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[300px] overflow-y-auto">
            <ul className="space-y-4">
              {peos.map((peo) => (
                <li
                  key={peo.id}
                  className="border-b pb-3 last:border-b-0 last:pb-0"
                >
                  <p className="font-medium">PEO {peo.id}</p>
                  <p className="text-sm text-gray-600 mt-1">{peo.statement}</p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
