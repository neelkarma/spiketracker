export const formatAsPercentage = (num: number) => new Intl.NumberFormat("default", {
    style: "percent",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
}).format(num);