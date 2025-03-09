import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui";

const FormInput = ({ name, label, placeholder, form, error }: any) => (
  <FormField
    control={form.control}
    name={name}
    render={({ field }) => (
      <FormItem>
        <FormLabel>{label}</FormLabel>
        <FormControl>
          <Input placeholder={placeholder} {...field} />
        </FormControl>
        {error && <div className="text-red-500 text-[12.8px]">{error}</div>}
        <FormMessage />
      </FormItem>
    )}
  />
);

export default FormInput;
