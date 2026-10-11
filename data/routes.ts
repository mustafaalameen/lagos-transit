export type SavedRoute = {
  id: string;
  origin: string;
  destination: string;
  estimatedMinutes: number;
  stops: number;
  fareRange: string;
};

// Illustrative values copied from the design preview, NOT verified transport information.
export const savedRoutes: SavedRoute[] = [
  { id: "yaba-obalende", origin: "Yaba", destination: "Obalende", estimatedMinutes: 45, fareRange: "₦300–500", stops: 8 },
  { id: "yaba-cms", origin: "Yaba", destination: "CMS", estimatedMinutes: 35, fareRange: "₦250–400", stops: 6 },
];
