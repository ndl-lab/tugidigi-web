import Vue from "vue";
import Component from "vue-class-component";
import "./edit.scss";
import { Watch, Prop } from "vue-property-decorator";

interface Anchor {
  x?: boolean;
  y?: boolean;
  w?: boolean;
  h?: boolean;
  fixx?: number;
  fixy?: number;
  fixw?: number;
  fixh?: number;
  coordx: number;
  coordy: number;
}

interface Rect {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
}

interface Point {
  x?: number;
  y?: number;
}

export default interface RectEditor {}
@Component({
  template: require("./edit.html"),
})
export default class RectEditor extends Vue {
  setImage(image: HTMLImageElement) {
    this.canvas = <HTMLCanvasElement>this.$refs["canvas"];
    this.context = this.canvas.getContext("2d");
    this.canvas.addEventListener("mousedown", this.onMouseDown, false);
    this.canvas.addEventListener("touchstart", this.onMouseDown, false);
    this.canvas.addEventListener("mouseup", this.onMouseUp, false);
    this.canvas.addEventListener("touchend", this.onMouseUp, false);
    this.canvas.addEventListener("wheel", this.onWheel, false);
    this.imageObj = image;
    this.baseScale = 800.0 / this.imageObj.width;
    this.draw();
  }

  save() {
    this.$emit("close", this.rect);
  }

  cancel() {
    this.$emit("close", null);
  }

  //data
  rect: Rect = null;
  tempRect: Rect = null;
  size: number = 100;

  //non-reactive-field
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  imageObj: HTMLImageElement;

  baseScale = 1.0;

  eventPoint(evt): Point {
    let coord = evt.changedTouches ? evt.changedTouches[0] : evt;
    let canvCoord = this.canvas.getBoundingClientRect();
    return {
      x: coord.clientX - canvCoord.left,
      y: coord.clientY - canvCoord.top,
    };
  }

  onWheel(e: WheelEvent) {
    this.size += e.deltaY * -0.3;
    if (this.size < 1) this.size = 1;
    if (this.size > 200) this.size = 200;
    this.draw();
    e.preventDefault();
  }

  get anchors(): Anchor[] {
    if (!this.rect) return [];
    return [
      { x: true, y: true, coordx: this.rect.x, coordy: this.rect.y },
      {
        y: true,
        coordx: this.rect.x + this.rect.width / 2,
        coordy: this.rect.y,
      },
      {
        w: true,
        y: true,
        coordx: this.rect.x + this.rect.width,
        coordy: this.rect.y,
      },
      {
        w: true,
        coordx: this.rect.x + this.rect.width,
        coordy: this.rect.y + this.rect.height / 2,
      },
      {
        w: true,
        h: true,
        coordx: this.rect.x + this.rect.width,
        coordy: this.rect.y + this.rect.height,
      },
      {
        h: true,
        coordx: this.rect.x + this.rect.width / 2,
        coordy: this.rect.y + this.rect.height,
      },
      {
        x: true,
        h: true,
        coordx: this.rect.x,
        coordy: this.rect.y + this.rect.height,
      },
      {
        x: true,
        coordx: this.rect.x,
        coordy: this.rect.y + this.rect.height / 2,
      },
    ];
  }

  currentAnchor: Anchor = null;

  onMouseDown(e: MouseEvent) {
    let p = this.eventPoint(e);
    if (!this.tempRect) {
      this.currentAnchor = this.anchors
        .filter((a) => {
          let rect = this.anchorToRect(a);
          return (
            p.x >= rect.x &&
            p.x <= rect.x + rect.width &&
            p.y >= rect.y &&
            p.y <= rect.y + rect.height
          );
        })
        .pop();
      if (this.currentAnchor) {
        this.tempRect = {
          x: this.toCanvasValue(this.rect.x),
          y: this.toCanvasValue(this.rect.y),
          width: this.toCanvasValue(this.rect.width),
          height: this.toCanvasValue(this.rect.height),
        };
        console.info(this.tempRect);
      } else {
        this.tempRect = { x: 0, y: 0, width: 0, height: 0 };
        this.tempRect.x = p.x;
        this.tempRect.y = p.y;
      }
      this.canvas.addEventListener("mousemove", this.onMouseMove, false);
      this.canvas.addEventListener("touchmove", this.onMouseMove, false);
      e.preventDefault();
      this.draw();
    }
  }

  onMouseUp(e: MouseEvent) {
    if (this.tempRect) {
      if (this.tempRect.width <= 5 || this.tempRect.height <= 5) {
        this.rect = null;
      } else {
        this.rect = this.modRect(
          this.tempRect,
          100 / this.size / this.baseScale
        );
      }
      this.tempRect = null;
      this.canvas.removeEventListener("mousemove", this.onMouseMove, false);
      this.canvas.removeEventListener("touchmove", this.onMouseMove, false);
      e.preventDefault();
      this.draw();
    }
  }

  toCanvasPoint(p: Point) {
    return { x: this.toCanvasValue(p.x), y: this.toCanvasValue(p.y) };
  }

  toCanvasValue(x) {
    return (x / 100) * this.size * this.baseScale;
  }

  toActualPoint(p: Point) {
    return { x: this.toActualValue(p.x), y: this.toActualValue(p.y) };
  }

  toActualValue(x) {
    return (x * 100) / this.size / this.baseScale;
  }

  onMouseMove(e: Event) {
    let p = this.eventPoint(e);
    if (this.tempRect) {
      if (this.currentAnchor) {
        if (this.currentAnchor.x) {
          this.tempRect.x = p.x;
          this.tempRect.width =
            this.toCanvasValue(this.rect.width + this.rect.x) - p.x;
        }
        if (this.currentAnchor.y) {
          this.tempRect.y = p.y;
          this.tempRect.height =
            this.toCanvasValue(this.rect.height + this.rect.y) - p.y;
        }
        if (this.currentAnchor.w) {
          this.tempRect.width = p.x - this.tempRect.x;
        }
        if (this.currentAnchor.h) {
          this.tempRect.height = p.y - this.tempRect.y;
        }
      } else {
        this.tempRect.width = p.x - this.tempRect.x;
        this.tempRect.height = p.y - this.tempRect.y;
      }
      this.draw();
      e.preventDefault();
    }
  }

  modRect(r: Rect, mod): Rect {
    return {
      x: Math.floor((r.width < 0 ? r.x + r.width : r.x) * mod),
      y: Math.floor((r.height < 0 ? r.y + r.height : r.y) * mod),
      width: Math.floor(Math.abs(r.width) * mod),
      height: Math.floor(Math.abs(r.height) * mod),
    };
  }

  clear() {
    this.rect = {
      x: undefined,
      y: undefined,
      width: undefined,
      height: undefined,
    };
    this.$emit("rect:clear");
    this.draw();
  }

  draw() {
    if (this.imageObj && this.imageObj.src) {
      this.canvas.width =
        ((this.imageObj.width * this.size) / 100.0) * this.baseScale;
      this.canvas.height =
        ((this.imageObj.height * this.size) / 100.0) * this.baseScale;
      this.context.drawImage(
        this.imageObj,
        0,
        0,
        this.imageObj.width,
        this.imageObj.height,
        0,
        0,
        this.canvas.width,
        this.canvas.height
      );

      if (this.tempRect != null) {
        this.drawGrayRect(this.tempRect, 1);
      } else if (this.rect != null&&this.rect.x != null) {
        this.drawGrayRect(
          this.rect,
          (this.size / 100.0) * this.baseScale,
          true
        );
      }
    }
  }

  private anchorToRect(a: Anchor): Rect {
    return {
      x: this.toCanvasValue(a.coordx) - this.anchorSize / 2,
      y: this.toCanvasValue(a.coordy) - this.anchorSize / 2,
      width: this.anchorSize,
      height: this.anchorSize,
    };
  }

  anchorSize = 20;

  private drawGrayRect(rect: Rect, modsize, cut?: boolean) {
    rect = this.modRect(rect, modsize);
    this.context.globalAlpha = 0.7;
    this.context.lineWidth = 1;
    this.context.strokeStyle = "rgba(255,255,0)";
    this.context.beginPath();
    this.context.rect(rect.x, rect.y, rect.width, rect.height);
    this.context.stroke();

    if (cut) {
      //アンカーポイント
      this.context.lineWidth = 2;
      this.context.strokeStyle = "rgba(0,0,255)";
      this.anchors.forEach((a) => {
        this.context.beginPath();
        let r = this.anchorToRect(a);
        this.context.rect(r.x, r.y, r.width, r.height);
        this.context.stroke();
      });

      //周辺の黒
      let fullw = this.canvas.width;
      let fullh = this.canvas.height;

      this.context.fillStyle = "rgb(0,0,0)";
      this.context.fillRect(0, 0, fullw, rect.y);
      this.context.fillRect(0, rect.y, rect.x, rect.height);
      this.context.fillRect(
        rect.x + rect.width,
        rect.y,
        fullw - rect.x - rect.width,
        rect.height
      );
      this.context.fillRect(
        0,
        rect.y + rect.height,
        fullw,
        fullh - rect.y - rect.height
      );
    }
    this.context.globalAlpha = 1.0;
  }

  getMarginRect(r: Rect, size: number): Rect {
    let w = r.width * size;
    let h = r.height * size;
    return {
      x: r.x - (w - r.width) / 2,
      y: r.y - (h - r.height) / 2,
      width: w,
      height: h,
    };
  }
}
