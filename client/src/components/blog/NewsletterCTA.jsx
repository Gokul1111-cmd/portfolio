import { Mail } from "lucide-react";

export const NewsletterCTA = () => {
  return (
    <div className="my-16 md:my-20 p-8 md:p-10 border rounded-xl">
      <div className="max-w-xl mx-auto text-center space-y-4">
        <Mail size={32} className="mx-auto text-primary" />
        <h3 className="text-2xl font-bold">Love this content?</h3>
        <p className="text-muted-foreground">
          Get exclusive tutorials, behind-the-scenes insights, and early access to new posts delivered to your inbox.
        </p>
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-md border bg-background"
          />
          <button className="px-6 py-3 rounded-md bg-primary text-primary-foreground font-semibold">
            Subscribe
          </button>
        </div>
        <p className="text-xs text-muted-foreground">Join 500+ developers. Unsubscribe anytime.</p>
      </div>
    </div>
  );
};

export default NewsletterCTA;
