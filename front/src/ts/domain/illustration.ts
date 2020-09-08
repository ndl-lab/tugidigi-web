import { Graphictag } from "./graphictag";
export interface Illustration {
  id: string;
  pid: string;
  title: string;
  page: number;
  x: number;
  y: number;
  w: number;
  h: number;
  graphictags: Graphictag[];
}
