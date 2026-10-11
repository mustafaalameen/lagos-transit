export type MockJourney = {
  progress: number;
  latestUpdate: string;
  nextStop: string;
  minutesToNextStop: number;
};

// Fictional journey snapshots for the prototype, not verified transport data.
export const mockJourneys = {
  "yaba-obalende": {
    progress: 40,
    latestUpdate: "Your demo bus has left the previous stop and is continuing towards Obalende.",
    nextStop: "Fadeyi",
    minutesToNextStop: 5,
  },
  "yaba-cms": {
    progress: 60,
    latestUpdate: "Your demo bus is continuing towards CMS. The next stop is coming up.",
    nextStop: "Costain",
    minutesToNextStop: 3,
  },
} satisfies Record<string, MockJourney>;
