"use client";
import { formatNotificationTime } from "@/lib/formatNotificationTime";
import {
  GetNotificationParams,
  useGetNotificationQuery,
} from "@/services/notification.api";


export default function NotificationsPage() {
  const { data, isLoading, error } = useGetNotificationQuery({
    page: 1,
    limit: 10,
  } as GetNotificationParams);

  const notifications = data?.data?.items || [];
  console.log("notifications", notifications);


  return (
    <div className="space-y-1">
      {notifications?.map((notification) => (
        <div
          key={notification?.id}
          className="rounded-2xl border border-[#DFE1E7] bg-[#F8FAFB] p-5 cursor-pointer"
        >
          <div className="flex items-center justify-between">
            <span className="">
              <p className="text-base xl:text-lg text-[#1D1F2C]">
                {notification?.title}
              </p>
              <p className="text-base xl:text-lg text-[#1D1F2C]">
                {notification?.body}
              </p>
            </span>
            <span className="text-sm xl:text-base text-[#1B1B1B]">
              {formatNotificationTime(notification?.created_at)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
