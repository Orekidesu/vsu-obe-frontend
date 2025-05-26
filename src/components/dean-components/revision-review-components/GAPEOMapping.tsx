import { MappingTable } from "@/components/commons/program-details/mapping-table";

interface GAPEOMappingProps {
  peos: Array<{ statement: string }>;
  graduateAttributes: Array<{
    id: number;
    ga_no: number;
    name: string;
  }>;
  mappings: Array<{
    peo_index: number;
    ga_id: number;
  }>;
}

export function GAPEOMapping({
  peos,
  graduateAttributes,
  mappings,
}: GAPEOMappingProps) {
  // Get unique graduate attributes and sort by ga_no
  const uniqueGAs = graduateAttributes
    .filter(
      (ga, index, self) => self.findIndex((g) => g.ga_no === ga.ga_no) === index
    )
    .sort((a, b) => a.ga_no - b.ga_no);

  // Format data for the MappingTable component
  const rowHeaders = uniqueGAs.map((ga) => ({
    id: ga.ga_no,
    label: `GA${ga.ga_no}`,
    tooltip: ga.name,
  }));

  const columnHeaders = peos.map((peo, index) => ({
    id: index,
    label: `PEO${index + 1}`,
    tooltip: peo.statement,
  }));

  const formattedMappings = mappings.map((mapping) => ({
    rowId: mapping.ga_id,
    colId: mapping.peo_index,
  }));

  return (
    <MappingTable
      title="Graduate Attributes to PEO Mapping"
      rowHeaders={rowHeaders}
      columnHeaders={columnHeaders}
      mappings={formattedMappings}
    />
  );
}
