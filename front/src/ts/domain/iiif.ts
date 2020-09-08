export interface IIIFManifest {
  /**
   * ID
   */
  "@id": string;

  label: PropertyValue;
  metadata: PropertyValue[];
  description: PropertyValue;
  attribution: PropertyValue;
  license: string | string[];
  logo: string;
  seeAlso: string;
  thumbnail: Resource;
  viewingDirection: ViewingDirection;
  sequences: Sequence[];
}

export interface Sequence {
  viewingDirection: ViewingDirection;
  canvases: Canvas[];
}

export interface Canvas {
  "@id": string;
  width: number;
  height: number;
  label: PropertyValue;
  description: PropertyValue;
  images: Annotation[];
}

export interface Annotation {}

export interface Resource {
  "@id": string;
  format: string;
  width: number;
  height: number;
}

export type ViewingDirection =
  | "left-to-right"
  | "right-to-left"
  | "top-to-bottom"
  | "bottom-to-top";

export type PropertyValue = string | LabelValue;

export interface LabelValue {
  label: string;
  value: string | LangValue;
}

export interface LangValue {
  "@value": string;
  "@language": string;
}

export interface IIIFInfo {
  "@id": string;
  "@type": string;
  width: number;
  height: number;
}
