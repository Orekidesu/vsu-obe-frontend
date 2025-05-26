import { MappingTable } from "@/components/commons/program-details/mapping-table";

interface Mission {
  id: number;
  statement: string;
}

interface PEO {
  statement: string;
}

interface PEOMissionMappingProps {
  peos: PEO[];
  missions: Mission[];
  mappings: Array<{
    peo_index: number;
    mission_id: number;
  }>;
}

export function PEOMissionMapping({
  peos,
  missions,
  mappings,
}: PEOMissionMappingProps) {
  // Sort missions by ID for consistent display
  const sortedMissions = [...missions].sort((a, b) => a.id - b.id);

  // Format data for the MappingTable component
  const rowHeaders = peos.map((peo, index) => ({
    id: index,
    label: `PEO${index + 1}`,
    tooltip: peo.statement,
  }));

  const columnHeaders = sortedMissions.map((mission) => ({
    id: mission.id,
    label: `M${mission.id}`,
    tooltip: mission.statement,
  }));

  const formattedMappings = mappings.map((mapping) => ({
    rowId: mapping.peo_index,
    colId: mapping.mission_id,
  }));

  return (
    <MappingTable
      title="PEO to Mission Mapping"
      rowHeaders={rowHeaders}
      columnHeaders={columnHeaders}
      mappings={formattedMappings}
    />
  );
}
