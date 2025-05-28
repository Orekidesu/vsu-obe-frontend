import { MappingTable } from "@/components/commons/program-details/mapping-table";

interface POGAMappingProps {
  pos: Array<{
    name: string;
    statement: string;
  }>;
  graduateAttributes: Array<{
    id: number;
    ga_no: number;
    name: string;
    description?: string; // Add description field
  }>;
  mappings: Array<{
    po_index: number;
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
    id: index,
    label: po.name,
    tooltip: po.statement,
  }));

  const columnHeaders = uniqueGAs.map((ga) => ({
    id: ga.ga_no,
    label: `GA${ga.ga_no}`,
    tooltip: ga.description || ga.name, // Use description if available, fallback to name
  }));

  const formattedMappings = mappings.map((mapping) => ({
    rowId: mapping.po_index,
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
