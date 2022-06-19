import { Publisher, Subjects, TicketUpdatedEvent } from "@mrticketing/common";

export class TicketUpdated extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
