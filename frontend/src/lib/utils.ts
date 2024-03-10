import { goto } from "$app/navigation";

export const formatAsPercentage = (num: number) =>
  new Intl.NumberFormat("default", {
    style: "percent",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);

export const logout = async () => {
  await fetch("/api/auth/logout");
  goto("/");
};
