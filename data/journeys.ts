export type MockJourney = {
  progress: number;
  latestUpdate: string;
  nextStop: string;
  minutesToNextStop: number;
  passengerName: string;
  batteryPercentage: number;
  etaMinutes: number;
};

// Fictional journey snapshots for the prototype, not verified transport data.
export const mockJourneys = {
  "yaba-obalende": {
    progress: 40,
    latestUpdate: "Your demo bus has left the previous stop and is continuing towards Obalende.",
    nextStop: "Fadeyi",
    minutesToNextStop: 5,
    passengerName: "Amina Bello",
    batteryPercentage: 78,
    etaMinutes: 27,
  },
  "yaba-cms": {
    progress: 60,
    latestUpdate: "Your demo bus is continuing towards CMS. The next stop is coming up.",
    nextStop: "Costain",
    minutesToNextStop: 3,
    passengerName: "Amina Bello",
    batteryPercentage: 78,
    etaMinutes: 14,
  },
} satisfies Record<string, MockJourney>;
