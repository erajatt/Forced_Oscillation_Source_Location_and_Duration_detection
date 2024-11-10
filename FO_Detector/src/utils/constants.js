export const FRONTEND_TO_BACKEND_MAP = {
  G2: "G1",
  G5: "G2",
  G7: "G3",
  G22: "G4",
  G23: "G5",
  G4: "G6",
  G6: "G7",
  G14: "G8",
  G15: "G9",
  G16: "G10",
};

export const BACKEND_TO_FRONTEND_MAP = {
  G1: "G2",
  G2: "G5",
  G3: "G7",
  G4: "G22",
  G5: "G23",
  G6: "G4",
  G7: "G6",
  G8: "G14",
  G9: "G15",
  G10: "G16",
};

export const DISPLAY_GENERATORS = Object.keys(FRONTEND_TO_BACKEND_MAP);

export const propertyOptions = [
  { label: "Power", value: "P" },
  { label: "Reactive Power", value: "Q" },
  { label: "Voltage Magnitude", value: "V" },
  { label: "Voltage Angle", value: "A" },
];

export const propertyLabelMap = {
  P: "Power",
  Q: "Reactive Power",
  V: "Voltage Magnitude",
  A: "Voltage Angle",
};
