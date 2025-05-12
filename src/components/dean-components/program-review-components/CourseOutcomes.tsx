import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CourseOutcome {
  id: number;
  name: string;
  statement: string;
  abcd: {
    audience: string;
    behavior: string;
    condition: string;
    degree: string;
  };
  cpa: string; // Changed from object to string
  po_mappings: Array<{
    po_id: number;
    po_name: string;
    po_statement: string;
    ied: string; // Changed from string array to string
  }>;
  tla_tasks: Array<{
    id: number;
    at_code: string;
    at_name: string;
    at_tool: string;
    weight: string; // Changed from number to string
  }>;
  tla_assessment_method: {
    teaching_methods: string[];
    learning_resources: string[];
  };
}

interface CourseOutcomesProps {
  outcomes: CourseOutcome[];
}

// Helper function to get full CPA domain name
const getCPADomainName = (cpa: string) => {
  switch (cpa) {
    case "C":
      return "Cognitive";
    case "P":
      return "Psychomotor";
    case "A":
      return "Affective";
    default:
      return cpa;
  }
};

// Helper function to get IED level name
const getIEDLevelName = (ied: string) => {
  switch (ied) {
    case "I":
      return "Introductory";
    case "E":
      return "Enabling";
    case "D":
      return "Demonstrative";
    default:
      return ied;
  }
};

// Helper function to get badge color for CPA domain
const getCPABadgeColor = (cpa: string) => {
  switch (cpa) {
    case "C":
      return "bg-blue-100 text-blue-800";
    case "P":
      return "bg-green-100 text-green-800";
    case "A":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Helper function to get badge color for IED level
const getIEDBadgeColor = (ied: string) => {
  switch (ied) {
    case "I":
      return "bg-blue-100 text-blue-800";
    case "E":
      return "bg-green-100 text-green-800";
    case "D":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

export function CourseOutcomes({ outcomes }: CourseOutcomesProps) {
  if (!outcomes || outcomes.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">No course outcomes available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {outcomes.map((outcome) => (
        <Card key={outcome.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{outcome.name}</CardTitle>
              <Badge className={getCPABadgeColor(outcome.cpa)}>
                {getCPADomainName(outcome.cpa)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">
                Statement
              </h4>
              <p>{outcome.statement}</p>
            </div>

            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-2">
                ABCD Components
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-md">
                  <span className="text-xs font-medium uppercase text-muted-foreground">
                    Audience
                  </span>
                  <p className="mt-1">{outcome.abcd.audience}</p>
                </div>
                <div className="p-3 bg-muted rounded-md">
                  <span className="text-xs font-medium uppercase text-muted-foreground">
                    Behavior
                  </span>
                  <p className="mt-1">{outcome.abcd.behavior}</p>
                </div>
                <div className="p-3 bg-muted rounded-md">
                  <span className="text-xs font-medium uppercase text-muted-foreground">
                    Condition
                  </span>
                  <p className="mt-1">{outcome.abcd.condition}</p>
                </div>
                <div className="p-3 bg-muted rounded-md">
                  <span className="text-xs font-medium uppercase text-muted-foreground">
                    Degree
                  </span>
                  <p className="mt-1">{outcome.abcd.degree}</p>
                </div>
              </div>
            </div>

            {outcome.po_mappings && outcome.po_mappings.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">
                  PO Mappings
                </h4>
                <div className="space-y-3">
                  {outcome.po_mappings.map((mapping) => (
                    <div key={mapping.po_id} className="p-3 border rounded-md">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{mapping.po_name}</span>
                        <Badge className={getIEDBadgeColor(mapping.ied)}>
                          {getIEDLevelName(mapping.ied)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {mapping.po_statement}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
