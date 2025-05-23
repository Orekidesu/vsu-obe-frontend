import { Badge } from "@/components/ui/badge";

interface ContributionLegendProps {
  getLevelBadgeColor: (level: string) => string;
}

export function ContributionLegend({
  getLevelBadgeColor,
}: ContributionLegendProps) {
  return (
    <div className="flex flex-wrap gap-4 mb-4">
      <div className="flex items-center gap-2">
        <Badge className={getLevelBadgeColor("I")}>I</Badge>
        <span>Introductory</span>
      </div>
      <div className="flex items-center gap-2">
        <Badge className={getLevelBadgeColor("E")}>E</Badge>
        <span>Enabling</span>
      </div>
      <div className="flex items-center gap-2">
        <Badge className={getLevelBadgeColor("D")}>D</Badge>
        <span>Development</span>
      </div>
    </div>
  );
}
