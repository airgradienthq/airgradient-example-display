export interface DisplayPlaceInfo {
  name: string;
  public_name: string | null;
  timezone_id: string;
  id: number;
  open: boolean;
}

export interface DisplayGuideline {
  id: number;
  place_id: number;
  indoor: boolean;
  measure: string;
  min: number;
  max: number;
  color: string;
  icon: string;
  title: string;
  description: string;
  avg: number;
}

export interface DisplayLocation {
  id: number;
  name: string;
  pm02: number;
  pm02_clr: string;
  pi02: number;
  pi02_clr: string;
  atmp: number;
  rhum: number;
  rco2: number;
  rco2_clr: string;
  heatindex?: number;
  heatindex_clr?: string;
  heat_index_fahrenheit?: number;
  atmp_fahrenheit: number;
  timestamp: string;
}

export interface DisplayLocations {
  indoor: DisplayLocation[];
  outdoor: DisplayLocation[];
}

export interface DisplayData {
  place: DisplayPlaceInfo;
  guidelines: DisplayGuideline[];
  locations: DisplayLocations;
}
