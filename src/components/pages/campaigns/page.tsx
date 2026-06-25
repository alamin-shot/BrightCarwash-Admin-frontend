// src/components/pages/campaigns/page.tsx - SERVER COMPONENT
import { CampaignsContent } from "./CampaignsContent";

export default function CampaignsRootPage() {
	// ✅ This is a server component - NO "use client"
	return <CampaignsContent />;
}