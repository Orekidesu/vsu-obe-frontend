import { MappingTable } from "@/components/commons/program-details/mapping-table";

interface POGAMappingProps {
  pos: Array<{
    name: string; // Changed from "code"
    statement: string;
  }>;
  graduateAttributes: Array<{
    id: number;
    ga_no: number;
    name: string;
  }>;
  mappings: Array<{
    po_index: number; // Changed from "po_id"
    ga_id: number;
  }>;
}

export function POGAMapping({
  pos,
  graduateAttributes,
  mappings,
}: POGAMappingProps) {
  // Get unique graduate attributes and sort by ga_no
  const uniqueGAs = graduateAttributes
    .filter(
      (ga, index, self) => self.findIndex((g) => g.ga_no === ga.ga_no) === index
    )
    .sort((a, b) => a.ga_no - b.ga_no);

  // Format data for the MappingTable component
  const rowHeaders = pos.map((po, index) => ({
    id: index, // Use index as id since actual id is missing
    label: po.name, // Use name instead of code
    tooltip: po.statement,
  }));

  const columnHeaders = uniqueGAs.map((ga) => ({
    id: ga.ga_no,
    label: `GA${ga.ga_no}`,
    tooltip: ga.name,
  }));

  const formattedMappings = mappings.map((mapping) => ({
    rowId: mapping.po_index, // Use po_index instead of po_id
    colId: mapping.ga_id,
  }));

  return (
    <MappingTable
      title="Program Outcomes to Graduate Attributes Mapping"
      rowHeaders={rowHeaders}
      columnHeaders={columnHeaders}
      mappings={formattedMappings}
    />
  );
}
