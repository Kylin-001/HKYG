/**
 * NProgress类型声明
 */

declare interface NProgress {
  start(): void;
  done(): void;
  inc(): void;
  set(progress: number): void;
  configure(options: NProgressOptions): void;
}

declare interface NProgressOptions {
  minimum?: number;
  easing?: string;
  speed?: number;
  trickle?: boolean;
  trickleSpeed?: number;
  showSpinner?: boolean;
  barSelector?: string;
  spinnerSelector?: string;
  parent?: string;
}

declare const NProgress: NProgress;

export default NProgress;
