import {
  AfterViewInit,
  Component,
  ElementRef,
  Inject,
  OnDestroy,
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
export class ToolshopForestComponent implements AfterViewInit, OnDestroy {
  @ViewChild('c', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private isBrowser: boolean;
  private animationId: number = 0;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  canvas: HTMLCanvasElement = null as any;
  ctx: CanvasRenderingContext2D = null as any;

  // Canvas dimensions (4x original for high detail)
  WIDTH = 640;
  HEIGHT = 268;

  // Color palette
  p: any = null;

  // Scene elements
  stars: any[] = [];
  shootingStars: any[] = [];
  mountains: any[] = [];
  trees: any[] = [];
  particles: any[] = [];
  fireflies: any[] = [];
  bats: any[] = [];
  grassBlades: any[] = [];
  clouds: any[] = [];
  auroraWaves: any[] = [];
  waterRipples: any[] = [];
  leaves: any[] = [];

  // Animation state
  t = 0;
  groundOffset = 0;
  frame = 0;
  frameTimer = 0;
  FRAME_SPEED = 5;

  // Character frames (simplified)
  FRAMES = [
    {
      hy: 174,
      by: 188,
      bounce: 0,
      ll: [-3, 204],
      rl: [5, 206],
      la: [-8, 192],
      ra: [12, 196],
    },
    {
      hy: 173,
      by: 187,
      bounce: -2,
      ll: [4, 206],
      rl: [-2, 204],
      la: [10, 194],
      ra: [-6, 192],
    },
    {
      hy: 172,
      by: 186,
      bounce: -3,
      ll: [-4, 206],
      rl: [6, 204],
      la: [-6, 190],
      ra: [14, 196],
    },
    {
      hy: 173,
      by: 187,
      bounce: -2,
      ll: [5, 204],
      rl: [-3, 206],
      la: [12, 192],
      ra: [-8, 194],
    },
  ];

  ngAfterViewInit() {
    if (!this.isBrowser) return;
    setTimeout(() => {
      this.setup();
      this.loop();
    }, 100);
  }

  ngOnDestroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  setup() {
    if (!this.canvasRef?.nativeElement) {
      console.error('Canvas not found');
      return;
    }
    this.canvas = this.canvasRef.nativeElement;
    this.canvas.width = this.WIDTH;
    this.canvas.height = this.HEIGHT;
    this.ctx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.ctx.imageSmoothingEnabled = false;

    // Enhanced color palette
    this.p = {
      // Sky colors
      sky1: '#0a0f1a',
      sky2: '#0d1a2a',
      sky3: '#142238',
      skyHorizon: '#1a3050',

      // Aurora colors
      aurora1: '#20ff80',
      aurora2: '#40ffaa',
      aurora3: '#80ffcc',

      // Moon & stars
      moon: '#f0f8e0',
      moonGlow: '#e8f4c8',
      moonCrater: '#d0d8b8',
      star: '#ffffff',
      starDim: '#a0c0ff',

      // Mountains
      mt1: '#0a1018',
      mt2: '#101820',
      mt3: '#182030',
      mt4: '#203040',

      // Forest
      tree1: '#0a1810',
      tree2: '#0d2015',
      tree3: '#10281a',
      tree4: '#142820',
      leaf1: '#1a4028',
      leaf2: '#205030',
      leaf3: '#286038',
      leafHighlight: '#308040',

      // Ground & water
      ground: '#0a1008',
      groundLight: '#101810',
      grass: '#1a3018',
      grassLight: '#204020',
      water: '#0a2030',
      waterLight: '#103848',
      waterHighlight: '#1a4858',

      // Character
      charShadow: '#1a2040',
      charBody: '#3050a0',
      charBodyLight: '#4070c0',
      charSkin: '#e8c090',
      charSkinShadow: '#c0a070',
      charHair: '#2a1808',
      charEye: '#101020',
      charCape: '#802040',
      charCapeLight: '#a03050',
      charBoots: '#1a1a2a',

      // Effects
      fog: '#1a3040',
      particle: '#80c0a0',
      firefly: '#c0ff80',
      fireflyGlow: '#a0ff60',
    };

    this.initStars();
    this.initMountains();
    this.initTrees();
    this.initParticles();
    this.initFireflies();
    this.initBats();
    this.initGrass();
    this.initClouds();
    this.initAurora();
    this.initLeaves();
  }

  initStars() {
    // Regular stars
    this.stars = Array.from({ length: 150 }, () => ({
      x: Math.random() * this.WIDTH,
      y: Math.random() * 100,
      size: Math.random() < 0.2 ? 3 : 2,
      brightness: Math.random(),
      twinkleSpeed: 0.02 + Math.random() * 0.03,
      color: Math.random() < 0.3 ? this.p.starDim : this.p.star,
    }));

    // Shooting stars (occasional)
    this.shootingStars = [];
  }

  initMountains() {
    // 4 layers of mountains with different parallax speeds
    for (let layer = 0; layer < 4; layer++) {
      const peaks = [];
      const numPeaks = 6 + layer * 2;
      for (let i = 0; i < numPeaks; i++) {
        peaks.push({
          x: (i / numPeaks) * this.WIDTH * 1.5,
          height: 40 + Math.random() * 60 + layer * 20,
          width: 60 + Math.random() * 80,
        });
      }
      this.mountains.push({
        layer,
        peaks,
        speed: 0.1 + layer * 0.16,
        color: [this.p.mt1, this.p.mt2, this.p.mt3, this.p.mt4][layer],
        yOffset: 110 + layer * 16,
      });
    }
  }

  initTrees() {
    for (let layer = 0; layer < 5; layer++) {
      const numTrees = 10 + layer * 4;
      for (let i = 0; i < numTrees; i++) {
        this.trees.push({
          x: Math.random() * this.WIDTH * 1.5,
          layer,
          height: 40 + Math.random() * 50 + layer * 10,
          width: 16 + Math.random() * 16 + layer * 4,
          speed: 0.2 + layer * 0.3,
          variant: Math.floor(Math.random() * 3),
          sway: Math.random() * Math.PI * 2,
          swaySpeed: 0.02 + Math.random() * 0.02,
        });
      }
    }
  }

  initParticles() {
    // Dust/mist particles
    this.particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * this.WIDTH,
      y: 140 + Math.random() * 80,
      size: 2 + Math.random() * 4,
      speed: 0.2 + Math.random() * 0.6,
      alpha: 0.1 + Math.random() * 0.3,
      drift: Math.random() * Math.PI * 2,
    }));
  }

  initFireflies() {
    this.fireflies = Array.from({ length: 25 }, () => ({
      x: Math.random() * this.WIDTH,
      y: 100 + Math.random() * 100,
      phase: Math.random() * Math.PI * 2,
      glowSpeed: 0.03 + Math.random() * 0.03,
      moveSpeed: 0.4 + Math.random() * 0.6,
      amplitude: 6 + Math.random() * 10,
    }));
  }

  initBats() {
    this.bats = Array.from({ length: 6 }, () => ({
      x: Math.random() * this.WIDTH,
      y: 40 + Math.random() * 60,
      wingPhase: Math.random() * Math.PI * 2,
      speed: 1.6 + Math.random() * 1.0,
      size: 4 + Math.random() * 4,
    }));
  }

  initGrass() {
    this.grassBlades = Array.from({ length: 200 }, () => ({
      x: Math.random() * this.WIDTH * 1.5,
      height: 6 + Math.random() * 10,
      sway: Math.random() * Math.PI * 2,
      swaySpeed: 0.05 + Math.random() * 0.03,
    }));
  }

  initClouds() {
    this.clouds = Array.from({ length: 8 }, () => ({
      x: Math.random() * this.WIDTH,
      y: 20 + Math.random() * 50,
      width: 40 + Math.random() * 80,
      height: 12 + Math.random() * 16,
      speed: 0.1 + Math.random() * 0.2,
      alpha: 0.1 + Math.random() * 0.15,
    }));
  }

  initAurora() {
    this.auroraWaves = Array.from({ length: 7 }, (_, i) => ({
      offset: i * 40,
      amplitude: 6 + Math.random() * 8,
      frequency: 0.01 + Math.random() * 0.005,
      speed: 0.02 + Math.random() * 0.02,
      alpha: 0.05 + Math.random() * 0.1,
    }));
  }

  initLeaves() {
    this.leaves = Array.from({ length: 20 }, () => ({
      x: Math.random() * this.WIDTH,
      y: Math.random() * this.HEIGHT,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: 0.05 + Math.random() * 0.1,
      fallSpeed: 0.6 + Math.random() * 0.8,
      drift: Math.random() * Math.PI * 2,
      size: 4 + Math.random() * 4,
    }));
  }

  px(x: number, y: number, c: string, w = 1, h = 1) {
    this.ctx.fillStyle = c;
    this.ctx.fillRect(Math.round(x), Math.round(y), w, h);
  }

  drawSky() {
    // Gradient sky
    const gradient = this.ctx.createLinearGradient(0, 0, 0, 200);
    gradient.addColorStop(0, this.p.sky1);
    gradient.addColorStop(0.4, this.p.sky2);
    gradient.addColorStop(0.7, this.p.sky3);
    gradient.addColorStop(1, this.p.skyHorizon);
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.WIDTH, 200);
  }

  drawAurora() {
    for (const wave of this.auroraWaves) {
      this.ctx.globalAlpha = wave.alpha;
      for (let x = 0; x < this.WIDTH; x += 3) {
        const y =
          30 +
          wave.offset +
          Math.sin(x * wave.frequency + this.t * wave.speed) * wave.amplitude;
        const h = 16 + Math.sin(x * 0.015 + this.t * 0.01) * 8;

        const gradient = this.ctx.createLinearGradient(x, y, x, y + h);
        gradient.addColorStop(0, 'transparent');
        gradient.addColorStop(0.5, this.p.aurora1);
        gradient.addColorStop(1, 'transparent');
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(x, y, 3, h);
      }
    }
    this.ctx.globalAlpha = 1;
  }

  drawStars() {
    for (const s of this.stars) {
      const twinkle =
        (Math.sin(this.t * s.twinkleSpeed + s.brightness * 10) + 1) / 2;
      this.ctx.globalAlpha = 0.3 + twinkle * 0.7;
      this.px(s.x, s.y, s.color, s.size, s.size);
    }
    this.ctx.globalAlpha = 1;

    // Occasional shooting star
    if (Math.random() < 0.002 && this.shootingStars.length < 2) {
      this.shootingStars.push({
        x: Math.random() * this.WIDTH,
        y: Math.random() * 60,
        vx: 6 + Math.random() * 4,
        vy: 2 + Math.random() * 2,
        life: 30,
      });
    }

    // Draw shooting stars
    for (let i = this.shootingStars.length - 1; i >= 0; i--) {
      const ss = this.shootingStars[i];
      const alpha = ss.life / 30;
      this.ctx.globalAlpha = alpha;

      // Trail
      for (let j = 0; j < 12; j++) {
        const trailAlpha = alpha * (1 - j / 12);
        this.ctx.globalAlpha = trailAlpha;
        this.px(
          ss.x - ss.vx * j * 0.5,
          ss.y - ss.vy * j * 0.5,
          '#ffffff',
          2,
          2,
        );
      }

      ss.x += ss.vx;
      ss.y += ss.vy;
      ss.life--;

      if (ss.life <= 0) {
        this.shootingStars.splice(i, 1);
      }
    }
    this.ctx.globalAlpha = 1;
  }

  drawMoon() {
    const mx = 520,
      my = 24;

    // Outer glow
    this.ctx.globalAlpha = 0.08;
    this.ctx.beginPath();
    this.ctx.arc(mx + 16, my + 16, 50, 0, Math.PI * 2);
    this.ctx.fillStyle = this.p.moonGlow;
    this.ctx.fill();

    // Inner glow
    this.ctx.globalAlpha = 0.15;
    this.ctx.beginPath();
    this.ctx.arc(mx + 16, my + 16, 30, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.globalAlpha = 1;

    // Moon body
    this.px(mx + 4, my, this.p.moon, 24, 4);
    this.px(mx, my + 4, this.p.moon, 32, 24);
    this.px(mx + 4, my + 28, this.p.moon, 24, 4);

    // Craters
    this.px(mx + 8, my + 8, this.p.moonCrater, 6, 4);
    this.px(mx + 20, my + 16, this.p.moonCrater, 4, 4);
    this.px(mx + 12, my + 20, this.p.moonCrater, 4, 2);

    // Crescent shadow
    this.ctx.globalAlpha = 0.6;
    this.px(mx + 20, my + 4, this.p.sky1, 12, 24);
    this.px(mx + 16, my + 8, this.p.sky1, 4, 16);
    this.ctx.globalAlpha = 1;
  }

  drawClouds() {
    for (const cloud of this.clouds) {
      this.ctx.globalAlpha = cloud.alpha;

      // Cloud body (multiple circles)
      for (let i = 0; i < 4; i++) {
        const cx = cloud.x + i * (cloud.width / 4);
        const cy = cloud.y + Math.sin(i * 1.5) * 2;
        const r = cloud.height / 2 + Math.sin(i * 2) * 2;

        this.px(cx - r, cy - r / 2, '#2a3a50', r * 2, r);
      }

      cloud.x -= cloud.speed;
      if (cloud.x < -cloud.width) cloud.x = this.WIDTH + 20;
    }
    this.ctx.globalAlpha = 1;
  }

  drawMountains() {
    for (const mt of this.mountains) {
      this.ctx.fillStyle = mt.color;

      for (const peak of mt.peaks) {
        // Draw mountain shape
        this.ctx.beginPath();
        this.ctx.moveTo(peak.x - peak.width / 2, mt.yOffset + 80);
        this.ctx.lineTo(peak.x, mt.yOffset + 80 - peak.height);
        this.ctx.lineTo(peak.x + peak.width / 2, mt.yOffset + 80);
        this.ctx.fill();

        peak.x -= mt.speed;
        if (peak.x < -peak.width) {
          peak.x = this.WIDTH + peak.width;
          peak.height = 40 + Math.random() * 60 + mt.layer * 20;
        }
      }
    }
  }

  drawTrees() {
    // Sort by layer
    const sortedTrees = [...this.trees].sort((a, b) => a.layer - b.layer);

    for (const tree of sortedTrees) {
      const alpha = 0.3 + tree.layer * 0.15;
      this.ctx.globalAlpha = alpha;

      const sway = Math.sin(this.t * tree.swaySpeed + tree.sway) * 4;
      const baseY = 218;
      const gx = Math.round(tree.x);

      // Trunk
      const trunkW = 4 + tree.layer * 2;
      const trunkH = tree.height * 0.3;
      this.px(gx, baseY - trunkH, this.p.tree1, trunkW, trunkH);

      // Foliage layers
      const colors = [this.p.leaf1, this.p.leaf2, this.p.leaf3];
      for (let layer = 0; layer < 4; layer++) {
        const layerY = baseY - trunkH - layer * (tree.height * 0.2);
        const layerW = tree.width * (1 - layer * 0.2);
        const color = colors[layer % colors.length];

        this.px(
          gx - layerW / 2 + sway * (layer * 0.3),
          layerY,
          color,
          layerW,
          tree.height * 0.25,
        );
      }

      // Top
      this.px(
        gx - 4 + sway,
        baseY - trunkH - tree.height * 0.8,
        this.p.leafHighlight,
        8,
        6,
      );

      tree.x -= tree.speed;
      if (tree.x < -tree.width * 2) {
        tree.x = this.WIDTH + tree.width + Math.random() * 100;
      }
    }
    this.ctx.globalAlpha = 1;
  }

  drawGround() {
    // Water/river
    const waterY = 200;
    this.px(0, waterY, this.p.water, this.WIDTH, 20);

    // Water reflections
    for (let i = 0; i < 30; i++) {
      const rx = ((i * 24 + this.t * 0.5) % (this.WIDTH + 20)) - 10;
      const ry = waterY + 4 + Math.sin(this.t * 0.1 + i) * 4;
      this.ctx.globalAlpha = 0.3 + Math.sin(this.t * 0.05 + i) * 0.2;
      this.px(rx, ry, this.p.waterHighlight, 16, 2);
    }
    this.ctx.globalAlpha = 1;

    // Ground base
    this.px(0, 220, this.p.ground, this.WIDTH, 48);
    this.px(0, 220, this.p.groundLight, this.WIDTH, 2);

    // Grass line
    for (const grass of this.grassBlades) {
      const sway = Math.sin(this.t * grass.swaySpeed + grass.sway) * 3;
      const gx =
        (((grass.x - this.groundOffset * 0.8) % (this.WIDTH * 1.5)) +
          this.WIDTH * 1.5) %
        (this.WIDTH * 1.5);

      if (gx < this.WIDTH) {
        this.ctx.strokeStyle =
          Math.random() < 0.3 ? this.p.grassLight : this.p.grass;
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(gx, 220);
        this.ctx.lineTo(gx + sway, 220 - grass.height);
        this.ctx.stroke();
      }
    }

    // Ground details
    for (let i = 0; i < 25; i++) {
      const dx =
        (((i * 30 - this.groundOffset) % (this.WIDTH + 30)) + this.WIDTH + 30) %
        (this.WIDTH + 30);
      this.px(dx, 224 + (i % 3) * 2, this.p.groundLight, 6 + (i % 2) * 2, 2);
    }
  }

  drawParticles() {
    for (const p of this.particles) {
      p.drift += 0.02;
      const dx = Math.sin(p.drift) * 0.5;

      this.ctx.globalAlpha = p.alpha;
      this.px(p.x + dx, p.y, this.p.particle, p.size, p.size);

      p.x -= p.speed;
      if (p.x < -5) p.x = this.WIDTH + 5;
    }
    this.ctx.globalAlpha = 1;
  }

  drawFireflies() {
    for (const f of this.fireflies) {
      const glow = (Math.sin(this.t * f.glowSpeed + f.phase) + 1) / 2;

      if (glow > 0.3) {
        const fy = f.y + Math.sin(this.t * 0.05 + f.phase) * f.amplitude;

        // Glow
        this.ctx.globalAlpha = glow * 0.3;
        this.px(f.x - 2, fy - 2, this.p.fireflyGlow, 6, 6);

        // Core
        this.ctx.globalAlpha = glow * 0.9;
        this.px(f.x, fy, this.p.firefly, 2, 2);
      }

      f.x -= f.moveSpeed;
      if (f.x < -5) f.x = this.WIDTH + 5;
    }
    this.ctx.globalAlpha = 1;
  }

  drawBats() {
    for (const bat of this.bats) {
      bat.wingPhase += 0.3;
      const wingUp = Math.sin(bat.wingPhase) > 0;

      // Body
      this.px(bat.x, bat.y, '#1a1a2a', bat.size, bat.size / 2);

      // Wings
      if (wingUp) {
        this.px(bat.x - bat.size, bat.y - 1, '#1a1a2a', bat.size, 1);
        this.px(bat.x + bat.size, bat.y - 1, '#1a1a2a', bat.size, 1);
      } else {
        this.px(bat.x - bat.size, bat.y + 1, '#1a1a2a', bat.size, 1);
        this.px(bat.x + bat.size, bat.y + 1, '#1a1a2a', bat.size, 1);
      }

      bat.x -= bat.speed;
      if (bat.x < -bat.size * 3) {
        bat.x = this.WIDTH + bat.size * 3;
        bat.y = 40 + Math.random() * 60;
      }
    }
  }

  drawLeaves() {
    for (const leaf of this.leaves) {
      leaf.rotation += leaf.rotSpeed;
      leaf.drift += 0.03;

      const dx = Math.sin(leaf.drift) * 2;

      this.ctx.save();
      this.ctx.translate(leaf.x + dx, leaf.y);
      this.ctx.rotate(leaf.rotation);
      this.ctx.globalAlpha = 0.6;
      this.ctx.fillStyle = this.p.leaf2;
      this.ctx.fillRect(
        -leaf.size / 2,
        -leaf.size / 4,
        leaf.size,
        leaf.size / 2,
      );
      this.ctx.restore();

      leaf.x -= 0.5;
      leaf.y += leaf.fallSpeed;

      if (leaf.y > this.HEIGHT || leaf.x < -10) {
        leaf.x = this.WIDTH + Math.random() * 50;
        leaf.y = -10;
      }
    }
    this.ctx.globalAlpha = 1;
  }

  drawCharacter() {
    const f = this.FRAMES[this.frame];
    const cx = 160;
    const bounceY = f.bounce;

    // Shadow
    this.ctx.globalAlpha = 0.4;
    this.px(cx - 6, 218, this.p.charShadow, 20, 3);
    this.ctx.globalAlpha = 1;

    // Cape (animated)
    const capeWave = Math.sin(this.t * 0.2) * 3;
    this.ctx.fillStyle = this.p.charCape;
    this.ctx.beginPath();
    this.ctx.moveTo(cx, f.by + bounceY + 4);
    this.ctx.lineTo(cx - 12 + capeWave, f.by + bounceY + 28);
    this.ctx.lineTo(cx - 6 + capeWave * 0.5, f.by + bounceY + 30);
    this.ctx.lineTo(cx + 2, f.by + bounceY + 10);
    this.ctx.fill();

    // Left leg
    const [llx, lly] = f.ll;
    this.px(cx + llx, lly + bounceY, this.p.charBody, 5, 10);
    this.px(cx + llx, lly + bounceY + 10, this.p.charBoots, 5, 4);

    // Right leg
    const [rlx, rly] = f.rl;
    this.px(cx + rlx, rly + bounceY, this.p.charBody, 5, 10);
    this.px(cx + rlx, rly + bounceY + 10, this.p.charBoots, 5, 4);

    // Body
    this.px(cx - 4, f.by + bounceY, this.p.charBody, 14, 18);
    this.px(cx - 2, f.by + bounceY + 2, this.p.charBodyLight, 6, 10);

    // Belt
    this.px(cx - 4, f.by + bounceY + 14, '#40302a', 14, 3);
    this.px(cx + 2, f.by + bounceY + 14, '#c0a040', 3, 3);

    // Left arm
    const [lax, lay] = f.la;
    this.px(cx + lax, lay + bounceY, this.p.charBody, 5, 8);
    this.px(cx + lax + 1, lay + bounceY + 8, this.p.charSkin, 3, 3);

    // Right arm
    const [rax, ray] = f.ra;
    this.px(cx + rax, ray + bounceY, this.p.charBody, 5, 8);
    this.px(cx + rax + 1, ray + bounceY + 8, this.p.charSkin, 3, 3);

    // Head
    this.px(cx - 1, f.hy + bounceY, this.p.charSkin, 12, 12);
    this.px(cx - 3, f.hy + bounceY + 3, this.p.charSkin, 16, 6);

    // Face shadow
    this.px(cx - 1, f.hy + bounceY + 6, this.p.charSkinShadow, 4, 4);

    // Hair
    this.px(cx - 3, f.hy + bounceY - 2, this.p.charHair, 16, 6);
    this.px(cx - 5, f.hy + bounceY + 1, this.p.charHair, 4, 6);
    this.px(cx + 10, f.hy + bounceY + 2, this.p.charHair, 3, 3);

    // Eyes
    this.px(cx + 6, f.hy + bounceY + 4, this.p.charEye, 3, 3);
    this.px(cx + 7, f.hy + bounceY + 4, '#ffffff', 2, 2);

    // Mouth
    this.px(cx + 6, f.hy + bounceY + 9, '#c06050', 3, 2);

    // Speed lines
    this.ctx.globalAlpha = 0.4;
    for (let i = 0; i < 3; i++) {
      const ly = 150 + i * 8 + (this.frame % 2) * 3;
      const lw = 8 + i * 4;
      this.px(cx - 30 - lw, ly + bounceY, this.p.charBodyLight, lw, 2);
    }
    this.ctx.globalAlpha = 1;
  }

  drawFog() {
    // Multiple fog layers
    for (let layer = 0; layer < 3; layer++) {
      this.ctx.globalAlpha = 0.04 + layer * 0.02;
      const fogY = 160 + layer * 20;
      const fogH = 40 - layer * 8;

      const gradient = this.ctx.createLinearGradient(0, fogY, 0, fogY + fogH);
      gradient.addColorStop(0, 'transparent');
      gradient.addColorStop(0.5, this.p.fog);
      gradient.addColorStop(1, 'transparent');

      this.ctx.fillStyle = gradient;
      this.ctx.fillRect(0, fogY, this.WIDTH, fogH);
    }
    this.ctx.globalAlpha = 1;
  }

  drawEffects() {
    // Scanlines
    this.ctx.globalAlpha = 0.04;
    for (let y = 0; y < this.HEIGHT; y += 3) {
      this.px(0, y, '#000000', this.WIDTH, 1);
    }

    // Vignette
    const vignette = this.ctx.createRadialGradient(
      this.WIDTH / 2,
      this.HEIGHT / 2,
      60,
      this.WIDTH / 2,
      this.HEIGHT / 2,
      this.WIDTH * 0.6,
    );
    vignette.addColorStop(0, 'transparent');
    vignette.addColorStop(1, 'rgba(0,0,0,0.6)');
    this.ctx.fillStyle = vignette;
    this.ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);

    // Subtle color overlay
    this.ctx.globalAlpha = 0.03;
    this.ctx.fillStyle = '#4080ff';
    this.ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);

    this.ctx.globalAlpha = 1;
  }

  loop() {
    this.t++;

    // Clear
    this.ctx.fillStyle = this.p.sky1;
    this.ctx.fillRect(0, 0, this.WIDTH, this.HEIGHT);

    // Draw all layers in order
    this.drawSky();
    this.drawAurora();
    this.drawStars();
    this.drawMoon();
    this.drawClouds();
    this.drawMountains();
    this.drawFog();
    this.drawParticles();
    this.drawGround();
    this.drawTrees();
    this.drawFireflies();
    this.drawBats();
    this.drawLeaves();
    this.drawCharacter();
    this.drawEffects();

    // Update animation state
    this.groundOffset += 2.4;
    this.frameTimer++;
    if (this.frameTimer >= this.FRAME_SPEED) {
      this.frameTimer = 0;
      this.frame = (this.frame + 1) % this.FRAMES.length;
    }

    this.animationId = requestAnimationFrame(() => this.loop());
  }
}
