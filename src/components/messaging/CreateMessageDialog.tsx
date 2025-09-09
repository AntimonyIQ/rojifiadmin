"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  title: z.string().min(1, "Subject is required"),
  body: z.string().min(1, "Body is required"),
  imageUrl: z.string().optional(),
  variables: z.array(z.string()).optional(),
  sendViaEmail: z.boolean(),
  sendViaPush: z.boolean(),
});

interface CreateMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateMessageDialog({
  open,
  onOpenChange,
}: CreateMessageDialogProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      body: "",
      imageUrl: "",
      variables: [],
      sendViaEmail: true,
      sendViaPush: false,
    },
  });

  const [highlightedSubject, setHighlightedSubject] = useState("");
  const [highlightedBody, setHighlightedBody] = useState("");

  const bodyRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);

  const highlightTemplateVars = (text: string) => {
    const allowed = ["firstname", "lastname", "fullname"];
    return text.replace(/{{(.*?)}}/g, (match, p1) => {
      if (allowed.includes(p1.trim())) {
        return `<mark class="bg-yellow-200 text-black rounded px-1">${match}</mark>`;
      }
      return match;
    });
  };

  // Sync subject & body highlights
  useEffect(() => {
    const sub = form.watch("title");
    const msg = form.watch("body");

    setHighlightedSubject(highlightTemplateVars(sub));
    setHighlightedBody(highlightTemplateVars(msg));
  }, [form.watch("title"), form.watch("body")]);

  const handleRichInput = (
    event: React.FormEvent<HTMLDivElement>,
    fieldName: "title" | "body"
  ) => {
    const text = (event.target as HTMLDivElement).innerText;
    form.setValue(fieldName, text);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {

  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Send Bulk Message</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Subject (rich) */}
            <FormItem>
              <FormLabel>Subject</FormLabel>
              <div className="relative">
                <div
                  className="absolute inset-0 z-0 pointer-events-none text-sm whitespace-pre-wrap break-words p-2 text-transparent"
                  aria-hidden
                >
                  <div
                    className="min-h-[40px]"
                    dangerouslySetInnerHTML={{ __html: highlightedSubject }}
                  />
                </div>
                <div
                  contentEditable
                  ref={titleRef}
                  onInput={(e) => handleRichInput(e, "title")}
                  className={cn(
                    "relative z-10 bg-transparent border rounded px-3 py-2 min-h-[40px]",
                    "text-sm text-black caret-primary focus:outline-none"
                  )}
                />
              </div>
              <input type="hidden" {...form.register("title")} />
            </FormItem>

            {/* Message Body (rich) */}
            <FormItem>
              <FormLabel>Body</FormLabel>
              <div className="relative">
                <div
                  className="absolute inset-0 z-0 pointer-events-none text-sm whitespace-pre-wrap break-words p-2 text-transparent"
                  aria-hidden
                >
                  <div
                    className="min-h-[100px]"
                    dangerouslySetInnerHTML={{ __html: highlightedBody }}
                  />
                </div>
                <div
                  contentEditable
                  ref={bodyRef}
                  onInput={(e) => handleRichInput(e, "body")}
                  className={cn(
                    "relative z-10 bg-transparent border rounded px-3 py-2 min-h-[100px]",
                    "text-sm text-black caret-primary focus:outline-none"
                  )}
                />
              </div>
              <input type="hidden" {...form.register("body")} />
            </FormItem>

            {/* Optional image URL */}
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Image URL (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Send via */}
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
                      <FormLabel className="font-normal">
                        Push Notification
                      </FormLabel>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={true}>
                {true ? "Sending..." : "Send"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
