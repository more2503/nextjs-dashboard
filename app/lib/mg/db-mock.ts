import { events } from "@/app/lib/mg/placeholder-data";
import { Event } from "@/app/lib/definitions";

export async function fetchEvents(): Promise<Event[]> {

    return events;
}