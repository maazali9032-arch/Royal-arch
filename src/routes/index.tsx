import { createFileRoute } from "@tanstack/react-router";
import { InvitationState } from "@/components/InvitationState";

const title = "Invitation not found — ZAR";
const description = "Open the unique link provided with your wedding invitation.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: () => <InvitationState kind="not_found" />,
});