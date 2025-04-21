import { Card, CardContent } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface FormTypeStepProps {
  formType: string;
  setFormType: (type: string) => void;
}

export function FormTypeStep({ formType, setFormType }: FormTypeStepProps) {
  return (
    <>
      <h2 className="text-2xl font-semibold text-center mb-8">
        What would you like to do?
      </h2>

      <RadioGroup
        value={formType}
        onValueChange={setFormType}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <Card
          className={`cursor-pointer hover:border-green-500 transition-all ${formType === "new" ? "border-green-500 border-2" : ""}`}
        >
          <CardContent className="flex items-center p-6">
            <RadioGroupItem value="new" id="new" className="text-green-600" />
            <Label htmlFor="new" className="ml-4 text-lg cursor-pointer">
              Make a new program
            </Label>
          </CardContent>
        </Card>

        <Card
          className={`cursor-pointer hover:border-green-500 transition-all ${formType === "update" ? "border-green-500 border-2" : ""}`}
        >
          <CardContent className="flex items-center p-6">
            <RadioGroupItem
              value="update"
              id="update"
              className="text-green-600"
            />
            <Label htmlFor="update" className="ml-4 text-lg cursor-pointer">
              Update existing program
            </Label>
          </CardContent>
        </Card>
      </RadioGroup>
    </>
  );
}
