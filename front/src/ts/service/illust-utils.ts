import { Illustration } from "domain/illustration";

export function iiifUrl(i: Illustration) {
  return `https://www.dl.ndl.go.jp/api/iiif/${i.pid}/R${(
    "0000000000" + i.page
  ).slice(-7)}/pct:${i.x},${i.y},${i.w},${i.h}/full/0/default.jpg`;
}

export function iiifUrlWithHeight(i: Illustration, h: number) {
  return `https://www.dl.ndl.go.jp/api/iiif/${i.pid}/R${(
    "0000000000" + i.page
  ).slice(-7)}/pct:${i.x},${i.y},${i.w},${i.h}/,${h}/0/default.jpg`;
}

export function iiifUrlRaw(pid: string, page: number, x, y, w, h, tgtH) {
  return `https://www.dl.ndl.go.jp/api/iiif/${pid}/R${(
    "0000000000" + page
  ).slice(-7)}/pct:${x},${y},${w},${h}/,${tgtH}/0/default.jpg`;
}
