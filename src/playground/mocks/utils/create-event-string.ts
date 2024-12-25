export function createEventString(event: string, data: object): string {
  return "".concat(
    `event: ${event}`,
    "\n",
    "data: " + JSON.stringify(data) + "\n\n"
  );
}
