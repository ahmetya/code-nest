import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  PLATFORM_ID,
  ViewChild,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-toolshop-forest',
  imports: [],
  templateUrl: './toolshop-forest.component.html',
  styleUrl: './toolshop-forest.component.scss',
})
export class ToolshopForestComponent implements AfterViewInit {
  @ViewChild('c', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  canvas: HTMLCanvasElement = null as any;
  ctx: CanvasRenderingContext2D = null as any;
  p: any = null;
  stars: any[] = null as any;
  trees: any[] = [];
  groundOffset: number = 0;
  FRAMES = [
    // run frame 0
    {
      hx: 0,
      hy: 28,
      bx: 0,
      by: 33,
      ll: [
        [-1, 42],
        [0, 45],
      ],
      rl: [
        [2, 42],
        [1, 45],
      ],
      la: [
        [-2, 34],
        [-3, 37],
      ],
      ra: [
        [2, 34],
        [3, 37],
      ],
    },
    // run frame 1
    {
      hx: 0,
      hy: 28,
      bx: 0,
      by: 33,
      ll: [
        [1, 42],
        [2, 45],
      ],
      rl: [
        [-2, 42],
        [-1, 45],
      ],
      la: [
        [2, 34],
        [3, 37],
      ],
      ra: [
        [-2, 34],
        [-3, 37],
      ],
    },
    // run frame 2 (airborne slightly)
    {
      hx: 0,
      hy: 27,
      bx: 0,
      by: 32,
      ll: [
        [-2, 41],
        [0, 44],
      ],
      rl: [
        [2, 41],
        [1, 44],
      ],
      la: [
        [-3, 33],
        [-2, 36],
      ],
      ra: [
        [3, 33],
        [2, 36],
      ],
    },
    // run frame 3
    {
      hx: 0,
      hy: 27,
      bx: 0,
      by: 32,
      ll: [
        [2, 41],
        [-1, 44],
      ],
      rl: [
        [-2, 41],
        [0, 44],
      ],
      la: [
        [3, 33],
        [2, 36],
      ],
      ra: [
        [-3, 33],
        [-2, 36],
      ],
    },
  ];

  frame = 0;
  frameTimer = 0;
  FRAME_SPEED = 6;

  flies = Array.from({ length: 6 }, () => ({
    x: Math.random() * 160,
    y: 20 + Math.random() * 25,
    t: Math.random() * Math.PI * 2,
    s: 0.03 + Math.random() * 0.02,
  }));

  t = 0;

  ngAfterViewInit() {
    if (!this.isBrowser) return;

    // Small delay to ensure hydration is complete
    setTimeout(() => {
      this.setup();
      this.loop();
    }, 100);
  }

  setup() {
    if (!this.canvasRef?.nativeElement) {
      console.error('Canvas not found');
      return;
    }
    this.canvas = this.canvasRef.nativeElement;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.ctx.imageSmoothingEnabled = false;

    this.p = {
      sky1: '#0d1f0d',
      sky2: '#0a2a14',
      moon: '#e8f4c8',
      star: '#c8e8a0',
      fog: '#0e2e16',
      tree1: '#0d3318',
      tree2: '#0a2610',
      tree3: '#082008',
      leaf1: '#1a5c28',
      leaf2: '#236b30',
      leaf3: '#2e8040',
      ground: '#0e1a08',
      gline: '#162a0e',
      moss: '#1e3a12',
      char_s: '#1a3a6a', // shadow
      char_b: '#3a7adf', // body blue
      char_h: '#f5d080', // skin
      char_e: '#1a1a2a', // eye
      char_r: '#e05050', // red scarf
      char_g: '#2aaf50', // green accent
      white: '#f0f0f0',
    };

    this.stars = Array.from({ length: 22 }, () => ({
      x: Math.random() * 160,
      y: Math.random() * 28,
      b: Math.random(),
      s: Math.random() * 0.02 + 0.01,
    }));

    for (let l = 0; l < 4; l++) {
      for (let i = 0; i < (l + 2) * 2; i++) {
        this.trees.push(this.makeTree(Math.random() * 200 - 20, l));
      }
    }
  }

  px(
    x: number,
    y: number,
    c: string | CanvasGradient | CanvasPattern,
    w = 1,
    h = 1,
  ) {
    this.ctx.fillStyle = c;
    this.ctx.fillRect(Math.round(x), Math.round(y), w, h);
  }

  makeTree(x: number, layer: number) {
    const heights = [18, 22, 26, 30];
    return {
      x,
      layer,
      h: heights[Math.floor(Math.random() * heights.length)] + layer * 4,
      speed: [0.15, 0.3, 0.55, 0.9][layer],
      variant: Math.floor(Math.random() * 3),
    };
  }

  drawTree(t: any) {
    const lc = [this.p.tree3, this.p.tree2, this.p.tree1, this.p.moss];
    const fc = [
      [this.p.leaf1],
      [this.p.leaf1, this.p.leaf2],
      [this.p.leaf2, this.p.leaf3],
      [this.p.leaf2, this.p.leaf3],
    ][t.layer];
    const gx = Math.round(t.x);
    const ground = 48;
    const trunk_w = [1, 1, 2, 2][t.layer];
    const trunk_h = [4, 5, 6, 8][t.layer];

    // trunk
    this.px(
      gx + Math.floor(t.h / 5),
      ground - trunk_h,
      lc[t.layer],
      trunk_w,
      trunk_h,
    );

    // foliage — triangle style
    const tw = t.h / 2;
    for (let row = 0; row < t.h / 3; row++) {
      const w = Math.max(1, Math.floor((tw * (row + 1)) / (t.h / 3)));
      const c = fc[row % fc.length];
      const cx2 = gx + Math.floor(t.h / 5) + Math.floor(trunk_w / 2);
      this.px(
        cx2 - Math.floor(w / 2),
        ground - trunk_h - (t.h / 3 - row) * 2,
        c,
        w,
        2,
      );
    }
  }

  drawGround() {
    // base
    this.px(0, 48, this.p.ground, 160, 20);
    this.px(0, 48, this.p.gline, 160, 1);
    // moss patches scrolling
    for (let i = 0; i < 12; i++) {
      const bx = (((i * 17 - this.groundOffset * 0.9) % 170) + 170) % 170;
      this.px(bx, 49, this.p.moss, 5, 1);
      this.px(bx + 1, 50, this.p.moss, 3, 1);
    }
    // small pebbles
    for (let i = 0; i < 8; i++) {
      const bx = (((i * 22 + 5 - this.groundOffset) % 170) + 170) % 170;
      this.px(bx, 50, this.p.gline, 2, 1);
    }
  }

  drawChar() {
    const f = this.FRAMES[this.frame];
    const cx = 52;

    // shadow
    this.ctx.globalAlpha = 0.3;
    this.px(cx - 2, 49, this.p.char_s, 8, 1);
    this.ctx.globalAlpha = 1;

    // legs
    for (const [ox, oy] of f.ll) this.px(cx + ox, oy, this.p.char_b, 2, 2);
    for (const [ox, oy] of f.rl) this.px(cx + 2 + ox, oy, this.p.char_b, 2, 2);
    // feet (dark)
    this.px(cx + f.ll[1][0], f.ll[1][1] + 1, '#1a2a4a', 2, 1);
    this.px(cx + 2 + f.rl[1][0], f.rl[1][1] + 1, '#1a2a4a', 2, 1);

    // body
    this.px(cx - 1 + f.bx, f.by, this.p.char_b, 5, 5);
    // scarf/collar
    this.px(cx - 1 + f.bx, f.by, this.p.char_r, 5, 2);
    // body highlight
    this.px(cx + f.bx, f.by + 2, this.p.char_g, 2, 1);

    // arms
    for (const [ox, oy] of f.la) this.px(cx - 2 + ox, oy, this.p.char_b, 2, 2);
    for (const [ox, oy] of f.ra) this.px(cx + 4 + ox, oy, this.p.char_b, 2, 2);

    // head
    this.px(cx + f.hx, f.hy, this.p.char_h, 5, 5);
    // hair
    this.px(cx + f.hx, f.hy, '#3a2808', 5, 2);
    this.px(cx + f.hx - 1, f.hy + 1, '#3a2808', 1, 1);
    // eye
    this.px(cx + f.hx + 3, f.hy + 2, this.p.char_e, 1, 1);
    this.px(cx + f.hx + 3, f.hy + 3, '#ffffff', 1, 1);
    // mouth
    this.px(cx + f.hx + 3, f.hy + 4, '#c06040', 1, 1);

    // speed lines
    this.ctx.globalAlpha = 0.4;
    for (let i = 0; i < 3; i++) {
      const ly = 33 + i * 3 + (this.frame % 2);
      const lw = 4 + i * 2;
      this.px(cx - 10 - lw, ly, this.p.char_b, lw, 1);
    }
    this.ctx.globalAlpha = 1;
  }

  drawFly(f: any, t: number) {
    const alpha = (Math.sin(f.t + t * f.s * 3) + 1) / 2;
    if (alpha > 0.4) {
      this.ctx.globalAlpha = alpha * 0.9;
      this.px(f.x, f.y + Math.sin(f.t + t * 0.05) * 3, '#c8ff88', 1, 1);
      this.ctx.globalAlpha = alpha * 0.3;
      this.px(f.x - 1, f.y + Math.sin(f.t + t * 0.05) * 3, '#c8ff88', 3, 1);
      this.ctx.globalAlpha = 1;
    }
  }

  drawMoon() {
    this.px(130, 5, this.p.moon, 5, 5);
    this.px(129, 6, this.p.moon, 7, 3);
    // crescent shadow
    this.px(132, 5, '#0d1f0d', 2, 2);
    this.px(133, 6, '#0d1f0d', 2, 2);
    // glow
    this.ctx.globalAlpha = 0.12;
    this.px(126, 2, this.p.moon, 13, 11);
    this.ctx.globalAlpha = 1;
  }

  loop() {
    this.t++;

    // clear
    this.ctx.fillStyle = this.p.sky1;
    this.ctx.fillRect(0, 0, 160, 67);

    // sky gradient
    this.ctx.fillStyle = this.p.sky2;
    this.ctx.fillRect(0, 30, 160, 20);

    // stars
    for (const s of this.stars) {
      const blink = (Math.sin(this.t * s.s + s.b * 10) + 1) / 2;
      this.ctx.globalAlpha = blink * 0.8;
      this.px(s.x, s.y, this.p.star, 1, 1);
    }
    this.ctx.globalAlpha = 1;

    this.drawMoon();

    // fog layer
    this.ctx.globalAlpha = 0.08;
    this.ctx.fillStyle = '#a0ffb0';
    this.ctx.fillRect(0, 38, 160, 12);
    this.ctx.globalAlpha = 1;

    // scroll trees (back to front)
    for (let l = 0; l < 4; l++) {
      const layerTrees = this.trees.filter((tr) => tr.layer === l);
      this.ctx.globalAlpha = [0.25, 0.4, 0.65, 1][l];
      for (const tr of layerTrees) {
        tr.x -= tr.speed;
        if (tr.x < -35) tr.x = 165 + Math.random() * 20;
        this.drawTree(tr);
      }
      this.ctx.globalAlpha = 1;
    }

    this.drawGround();
    this.groundOffset += 0.9;

    // fireflies
    for (const f of this.flies) {
      f.x -= 0.2;
      if (f.x < 0) f.x = 160;
      this.drawFly(f, this.t);
    }

    this.drawChar();
    // frame animation
    this.frameTimer++;
    if (this.frameTimer >= this.FRAME_SPEED) {
      this.frameTimer = 0;
      this.frame = (this.frame + 1) % this.FRAMES.length;
    }

    // scanline overlay
    this.ctx.globalAlpha = 0.07;
    for (let y = 0; y < 67; y += 2) {
      this.px(0, y, '#000', 160, 1);
    }
    this.ctx.globalAlpha = 1;

    // vignette corners
    const grad = this.ctx.createRadialGradient(80, 33, 20, 80, 33, 90);
    grad.addColorStop(0, 'transparent');
    grad.addColorStop(1, 'rgba(0,0,0,0.55)');
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, 160, 67);

    requestAnimationFrame(() => this.loop());
  }
}
