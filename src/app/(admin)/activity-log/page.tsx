import { ActivityLogContent } from '@/components/pages/activity-log';

// ✅ ISR: Revalidate page every 60 seconds in the background
export const revalidate = 60;

export default function ActivityLogPage() {
  return <ActivityLogContent />;
}