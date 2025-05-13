
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  body: z.string().min(1, "Message body is required"),
  imageUrl: z.string().optional(),
  variables: z.array(z.string()),
  sendViaEmail: z.boolean(),
  sendViaPush: z.boolean(),
});

interface CreateMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const variables = [
  { id: "firstName", label: "$FirstName" },
  { id: "lastName", label: "$LastName" },
];

export default function CreateMessageDialog({ open, onOpenChange }: CreateMessageDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      body: "",
      imageUrl: "",
      variables: [],
      sendViaEmail: false,
      sendViaPush: false,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Handle form submission
    console.log(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Message</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter message title" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message Body</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter message content"
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL (Optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter image URL" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="variables"
              render={() => (
                <FormItem>
                  <FormLabel>Variables</FormLabel>
                  <div className="flex flex-wrap gap-4">
                    {variables.map((variable) => (
                      <FormField
                        key={variable.id}
                        control={form.control}
                        name="variables"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(variable.id)}
                                onCheckedChange={(checked) => {
                                  const newValue = checked
                                    ? [...field.value, variable.id]
                                    : field.value?.filter((val) => val !== variable.id);
                                  field.onChange(newValue);
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {variable.label}
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Send Via</FormLabel>
              <div className="flex space-x-4">
                <FormField
                  control={form.control}
                  name="sendViaEmail"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Email</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sendViaPush"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="font-normal">Push Notification</FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Send Message</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
