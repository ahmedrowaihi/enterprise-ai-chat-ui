import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge as twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge({
    prefix: "ui-",
  })(clsx(inputs));
}
