import { Event } from "@/types";

export const UPCOMING_EVENTS: Event[] = [
  {
    id: 1,
    name: "Colombo International Bookfair 2025",
    description: "The premier annual book exhibition showcasing local and international publishers",
    startDate: "2025-09-15",
    endDate: "2025-09-20",
    venue: "Bandaranaike Memorial International Conference Hall (BMICH), Colombo",
    status: "UPCOMING",
    registrationOpen: true,
    totalStalls: 450,
    availableStalls: 120
  },
  {
    id: 2,
    name: "Sci-Fi & Fantasy Convention",
    description: "A gathering for science fiction and fantasy enthusiasts, authors, and publishers.",
    startDate: "2025-04-20",
    endDate: "2025-04-22",
    venue: "Exhibition Hall B",
    status: "UPCOMING",
    registrationOpen: true,
    totalStalls: 200,
    availableStalls: 50
  },
  {
    id: 3,
    name: "Academic Literature Expo",
    description: "Showcasing the latest in academic research, textbooks, and educational resources.",
    startDate: "2025-05-10",
    endDate: "2025-05-12",
    venue: "University Main Hall",
    status: "UPCOMING",
    registrationOpen: true,
    totalStalls: 150,
    availableStalls: 80
  }
];