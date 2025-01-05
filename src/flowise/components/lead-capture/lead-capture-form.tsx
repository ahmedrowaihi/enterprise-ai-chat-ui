import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LeadConfig } from "@/flowise/core/types";
import { toast } from "@/hooks/use-toast";
import { memo, useState } from "react";

interface LeadCaptureFormProps {
  config: LeadConfig;
  onSubmit: (data: {
    name?: string;
    email?: string;
    phone?: string;
  }) => Promise<void>;
}

export const LeadCaptureForm = memo(function LeadCaptureForm({
  config,
  onSubmit,
}: LeadCaptureFormProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      await onSubmit({
        ...(config.name && { name }),
        ...(config.email && { email }),
        ...(config.phone && { phone }),
      });
    } catch (error) {
      toast({
        title: "Failed to save contact information",
        description:
          error instanceof Error ? error.message : "Please try again",
        variant: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      className="ui-flex ui-flex-col ui-gap-4 ui-p-4 ui-bg-card ui-rounded-lg ui-border"
      onSubmit={handleSubmit}
    >
      <div className="ui-text-sm ui-font-medium ui-whitespace-pre-line">
        {config.title || "Let us know how to reach you:"}
      </div>

      <div className="ui-flex ui-flex-col ui-gap-3">
        {config.name && (
          <Input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        {config.email && (
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        )}
        {config.phone && (
          <Input
            type="tel"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        )}
      </div>

      <Button type="submit" className="ui-w-full" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save"}
      </Button>
    </form>
  );
});
