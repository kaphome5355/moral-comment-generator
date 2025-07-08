export interface StudentData {
  valueItem: string;
  keywords: string[]; // Array of 6 strings
  generatedComment: string;
  isLoading: boolean;
  error: string | null;
}

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
  // Other types of chunks can be added if needed
}

export interface GroundingMetadata {
  groundingChunks?: GroundingChunk[];
  // other grounding metadata fields
}

export interface Candidate {
  groundingMetadata?: GroundingMetadata;
  // other candidate fields
}