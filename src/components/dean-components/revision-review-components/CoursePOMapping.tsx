import { MappingTable } from "@/components/commons/program-details/mapping-table";

interface CoursePOMappingProps {
  courses: Array<{
    code: string;
    descriptive_title: string;
  }>;
  pos: Array<{
    name: string;
    statement: string;
  }>;
  mappings: Array<{
    course_code: string;
    po_code: string;
    ied: string[];
  }>;
}

export function CoursePOMapping({
  courses,
  pos,
  mappings,
}: CoursePOMappingProps) {
  // Format data for the MappingTable component
  const rowHeaders = courses.map((course) => ({
    id: course.code,
    label: course.code,
    tooltip: course.descriptive_title,
  }));

  const columnHeaders = pos.map((po) => ({
    id: po.name,
    label: po.name,
    tooltip: po.statement,
  }));

  // Transform mappings to match MappingTable format
  const formattedMappings = mappings.map((mapping) => ({
    rowId: mapping.course_code,
    colId: mapping.po_code,
  }));

  // Transform contribution levels for IED
  const contributionLevels = mappings.map((mapping) => ({
    rowId: mapping.course_code,
    colId: mapping.po_code,
    levels: mapping.ied,
  }));

  // Function to get badge color based on IED level
  const getLevelBadgeColor = (level: string) => {
    switch (level) {
      case "I":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100/80";
      case "E":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100/80";
      case "D":
        return "bg-green-100 text-green-800 hover:bg-green-100/80";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100/80";
    }
  };

  return (
    <MappingTable
      title="Course to Program Outcome Mapping"
      rowHeaders={rowHeaders}
      columnHeaders={columnHeaders}
      mappings={formattedMappings}
      contributionLevels={contributionLevels}
      getLevelBadgeColor={getLevelBadgeColor}
    />
  );
}
