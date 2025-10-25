import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | bigint | string, currency = "USD") {
  let numAmount: number;
  if (typeof amount === "bigint") {
    numAmount = Number(amount) / 1000000;
  } else if (typeof amount === "string") {
    numAmount = Number(amount) / 1000000;
  } else {
    numAmount = amount;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numAmount);
}

export function formatNumber(num: number | bigint | string) {
  let number: number;
  if (typeof num === "bigint") {
    number = Number(num);
  } else if (typeof num === "string") {
    number = Number(num);
  } else {
    number = num;
  }
  return new Intl.NumberFormat("en-US").format(number);
}

export function formatPercentage(value: number, decimals = 2) {
  return `${value.toFixed(decimals)}%`;
}

export function formatDate(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(d);
}

export function formatDateTime(date: Date | string) {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("ru-RU", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

export function truncateAddress(address: string, length = 4) {
  if (address.length <= length * 2) return address;
  return `${address.slice(0, length)}...${address.slice(-length)}`;
}

export function calculateAPY(baseAPY: number, boostAPY: number) {
  return baseAPY + boostAPY;
}

export function calculateDailyReward(principal: bigint, apy: number) {
  return (principal * BigInt(Math.floor(apy * 100))) / BigInt(365 * 10000);
}

export function calculateLoanAmount(principal: bigint, ltv = 60) {
  return (principal * BigInt(ltv)) / BigInt(100);
}

export function calculateBoostValue(amount: bigint, price: bigint) {
  return (amount * price) / BigInt(1000000); // Assuming 6 decimals
}

export function calculateBoostAPY(principal: bigint, boostValue: bigint) {
  const boostTarget = (principal * BigInt(30)) / BigInt(100); // 30% of principal
  const boostRatio = (boostValue * BigInt(100)) / boostTarget;
  const maxBoost = 5; // 5% max boost

  if (boostRatio > BigInt(100)) {
    return maxBoost;
  }

  return (Number(boostRatio) / 100) * maxBoost;
}
