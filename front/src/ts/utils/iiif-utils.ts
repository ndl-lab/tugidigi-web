// import * as Axios from "axios";
// import { IIIFInfo, IIIFManifest } from "domain/iiif";

// export interface IIIFSizeParam {
//   w?: number;
//   h?: number;
// }

// function toSizeStr(p: IIIFSizeParam) {
//   if (!p) return "full";
//   if (p.w != null && p.w > 0) {
//     if (p.h != null && p.h > 0) {
//       return `${p.w},${p.h}`;
//     } else {
//       return `${p.w},`;
//     }
//   } else {
//     if (p.h != null && p.h > 0) {
//       return `,${p.h}`;
//     } else {
//       return "full";
//     }
//   }
// }

// export interface IIIFTrimParam {
//   x?: number;
//   y?: number;
//   w?: number;
//   h?: number;
// }

// function toTrimStr(p: IIIFTrimParam) {
//   if (p == null) return "full";
//   if (
//     p.x != null &&
//     p.y != null &&
//     p.w != null &&
//     p.h != null &&
//     Math.floor(p.w) > 0 &&
//     Math.floor(p.h) > 0
//   )
//     return `${Math.floor(p.x)},${Math.floor(p.y)},${Math.floor(
//       p.w
//     )},${Math.floor(p.h)}`;
//   return "full";
// }

// function toInt() {}

// export function iiifUrlFromInfo(
//   infoJsonUrl: string,
//   trim?: IIIFTrimParam,
//   size?: IIIFSizeParam
// ) {
//   return (
//     infoJsonUrl.replace("info.json", "") +
//     `${toTrimStr(trim)}/${toSizeStr(size)}/0/default.jpg`
//   );
// }

// export function iiifUrlFromContent(
//   contentId: string,
//   imageId: string,
//   trim?: IIIFTrimParam,
//   size?: IIIFSizeParam
// ) {
//   return `api/iiif/${contentId}-${imageId}/${toTrimStr(trim)}/${toSizeStr(
//     size
//   )}/0/default.jpg`;
// }

// export function infoUrl(contentId: string, imageId: string) {
//   return `/api/iiif/${contentId}-${imageId}/info.json`;
// }

// export function getInfoJson(infoJsonUrl: string): Axios.AxiosPromise<IIIFInfo> {
//   return Axios.default.get(infoJsonUrl);
// }

// export function getManfesto(
//   manifestUrl: string
// ): Axios.AxiosPromise<IIIFManifest> {
//   return Axios.default.get(manifestUrl);
// }
