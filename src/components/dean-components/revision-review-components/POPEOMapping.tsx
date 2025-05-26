import { MappingTable } from "@/components/commons/program-details/mapping-table";

interface POPEOMappingProps {
  pos: Array<{
    name: string; // Changed from "code"
    statement: string;
  }>;
  peos: Array<{ statement: string }>;
  mappings: Array<{
    po_index: number; // Changed from "po_id"
    peo_index: number;
  }>;
}

export function POPEOMapping({ pos, peos, mappings }: POPEOMappingProps) {
  // Format data for the MappingTable component
  const rowHeaders = pos.map((po, index) => ({
    id: index, // Use index as id since actual id is missing
    label: po.name, // Use name instead of code
    tooltip: po.statement,
  }));

  const columnHeaders = peos.map((peo, index) => ({
    id: index,
    label: `PEO${index + 1}`,
    tooltip: peo.statement,
  }));

  const formattedMappings = mappings.map((mapping) => ({
    rowId: mapping.po_index, // Use po_index instead of po_id
    colId: mapping.peo_index,
  }));

  return (
    <MappingTable
      title="Program Outcomes to PEO Mapping"
      rowHeaders={rowHeaders}
      columnHeaders={columnHeaders}
      mappings={formattedMappings}
    />
  );
}
