import {
  differenceInMinutes,
  differenceInHours,
  differenceInDays,
  isYesterday,
} from "date-fns";

export const formatNotificationTime = (date: string) => {
  const notificationDate = new Date(date);
  const now = new Date();

  const minutes = differenceInMinutes(now, notificationDate);

  if (minutes < 60) {
    return `${minutes} min${minutes > 1 ? "s" : ""} ago`;
  }

  const hours = differenceInHours(now, notificationDate);

  if (hours < 24) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  }

  if (isYesterday(notificationDate)) {
    return "Yesterday";
  }

  const days = differenceInDays(now, notificationDate);

  return `${days} day${days > 1 ? "s" : ""} ago`;
};