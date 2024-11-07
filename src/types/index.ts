export interface Capability {
  name: string;
  level: number;
}

export interface CapabilityCategory {
  category: string;
  items: Capability[];
}

export interface CapabilityData {
  [key: string]: number;
}
