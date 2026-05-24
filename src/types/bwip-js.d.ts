declare module "bwip-js" {
  interface ToCanvasOptions {
    bcid?: string;
    text?: string;
    scale?: number;
    height?: number;
    includetext?: boolean;
    textxalign?: string;
  }

  interface BwipJs {
    toCanvas(canvas: HTMLCanvasElement, options: ToCanvasOptions): void;
  }

  const bwipjs: BwipJs;
  export default bwipjs;
}
