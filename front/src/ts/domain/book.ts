import { Illustration } from "./illustration";

export interface Book {
  id: string;
  version: number;
  title: string;
  index: string[];
  autoTOCindex:string[];
  contrastparam: number;
  leftopen:boolean;
  autoTOCflag: boolean;
  illustrations: string[];
  illusts: Illustration[];
}
