import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

export function getProgressValue(status) {
  switch (status) {
    case 'not_started':
      return 0;
    case 'in_progress':
      return 50;
    case 'done':
      return 100;
    default:
      return 0;
  }
}

export function getStatusColor(status) {
  switch (status) {
    case 'not_started':
      return 'gray';
    case 'in_progress':
      return 'yellow';
    case 'done':
      return 'green';
    default:
      return 'gray';
  }
}

export function getStatusLabel(status) {
  switch (status) {
    case 'not_started':
      return 'Not Started';
    case 'in_progress':
      return 'In Progress';
    case 'done':
      return 'Completed';
    default:
      return 'Unknown';
  }
}