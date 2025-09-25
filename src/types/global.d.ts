declare module '*.js';
declare module '*.png';
declare module '*.svg';

// Provide basic globals used by Kaplay scripts
declare const width: () => number;
declare const height: () => number;
declare const center: () => { x: number; y: number };
declare const vec2: (x: number, y: number) => { x: number; y: number };
declare function scene(name: string, cb: () => void): void;
declare function add(components: any[]): any;
declare function rect(w: number, h: number, opts?: any): any;
// pos can accept two numbers or a vec2-like object
declare function pos(x: number, y: number): any;
declare function pos(p: { x: number; y: number }): any;
declare function anchor(a: string): any;
declare function color(r: number, g: number, b: number, a?: number): any;
declare function opacity(v: number): any;
declare function z(v: number): any;
declare function text(t: string | number, opts?: any): any;
declare function area(opts?: any): any;
declare function body(opts?: any): any;
declare function sprite(name: string, opts?: any): any;
declare function loadSprite(name: string, path: string | string[], opts?: any): Promise<void>;
declare function getSprite(name: string): Promise<any>;
declare function go(scene: string): void;
declare function onKeyDown(key: string, cb: () => void): void;
declare function shake(): void;
declare function destroy(o: any): void;
declare function outline(n: number): any;
declare function area(opts?: any): any;
declare function move(dir: any, speed: number): any;
declare const LEFT: any;
declare function wait(t: number, cb: () => void): any;
declare function rand(a: number, b: number): number;
declare function getSpriteData(name: string): any;
declare function rgb(r: number, g: number, b: number): any;
// Additional helpers
declare function scale(s: number | { x: number; y: number }): any;
declare function setGravity(v: number): any;
declare function health(n: number): any;
