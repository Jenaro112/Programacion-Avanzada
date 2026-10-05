export const IKafkaToolkit = 'IKafkaToolkit';

export function isIdempotent(processedEventsMap: Map<string, boolean>, eventId: string): boolean {
  if (processedEventsMap.has(eventId)) {
    return true; // Already processed
  }
  processedEventsMap.set(eventId, true);
  return false;
}
