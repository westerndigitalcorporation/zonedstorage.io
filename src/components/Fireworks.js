import React, {useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';

// Cartoon fireworks for the landing-page zone model. Client-only: it reads the
// window when mounted. The show plays once on a full-viewport canvas, ignores
// pointer input, and removes itself after the last effect ends.

const TAU = Math.PI * 2;
const FLIGHT = 0.95; // Seconds from launch to burst.
const REDUCED_MOTION = '(prefers-reduced-motion: reduce)';
const FONT = 'Impact, "Arial Black", "Segoe UI Black", system-ui, sans-serif';
const BANNER = 'ALL ZONES FULL!';

const palettes = [
  ['#ff4f5e', '#ffd23f'],
  ['#2f9bff', '#8ff0e4'],
  ['#ff6fcf', '#ffe98a'],
  ['#4fcf5a', '#ffd23f'],
  ['#9b7bff', '#76e4ff'],
  ['#ff9a1f', '#ff4f5e'],
];
const heartColors = ['#ff6fcf', '#ff4f5e'];
const blockColors = ['#4f74d6', '#6b90f0', '#86a8ff'];
const confettiColors = ['#ff4f5e', '#ffd23f', '#2f9bff', '#4fcf5a', '#ff6fcf', '#9b7bff', '#8ff0e4'];
const letterFills = [
  ['#fff36b', '#ff9a1f'],
  ['#ffffff', '#8ff0e4'],
  ['#ffe0f5', '#ff6fcf'],
];

// Positions are viewport fractions. Each rocket starts at `from` on the bottom
// edge, so it climbs at its own angle; the last five form the finale salvo.
const cues = [
  {at: 0, from: 0.05, x: 0.2, y: 0.3, burst: 'peony', palette: 1, word: 'BOOM!'},
  {at: 0.45, from: 0.96, x: 0.79, y: 0.24, burst: 'heart', palette: 2},
  {at: 0.9, from: 0.28, x: 0.47, y: 0.3, burst: 'smiley', palette: 0, word: 'WOW!'},
  {at: 1.35, from: 0.62, x: 0.86, y: 0.5, burst: 'blocks', palette: 1, word: 'ZAP!'},
  {at: 1.75, from: 0.44, x: 0.14, y: 0.55, burst: 'spiral', palette: 4},
  {at: 2.15, from: 0.92, x: 0.64, y: 0.36, burst: 'star', palette: 3, word: 'POW!'},
  {at: 2.6, from: 0.02, x: 0.3, y: 0.2, burst: 'ring', palette: 5},
  {at: 3, from: 0.5, x: 0.74, y: 0.6, burst: 'peony', palette: 4, word: 'BANG!'},
  {at: 3.8, from: 0.36, x: 0.1, y: 0.3, burst: 'ring', palette: 0},
  {at: 3.8, from: 0.43, x: 0.3, y: 0.22, burst: 'peony', palette: 2},
  {at: 3.8, from: 0.5, x: 0.5, y: 0.17, burst: 'star', palette: 3},
  {at: 3.8, from: 0.57, x: 0.7, y: 0.22, burst: 'peony', palette: 1},
  {at: 3.8, from: 0.64, x: 0.9, y: 0.3, burst: 'ring', palette: 5},
];
const FINALE_AT = cues[cues.length - 1].at + FLIGHT;

const random = (min, max) => min + Math.random() * (max - min);
const easeIn = (t) => t * t;
const easeOut = (t) => 1 - (1 - t) ** 3;
const easeOutBack = (t) => 1 + 2.70158 * (t - 1) ** 3 + 1.70158 * (t - 1) ** 2;

// Unit-circle outline alternating spikes and valleys, used for comic bursts.
function jaggedPoints(spikes, depth) {
  const points = [];
  for (let i = 0; i < spikes * 2; i++) {
    const angle = (i / (spikes * 2)) * TAU;
    const radius = i % 2 ? depth * random(0.9, 1.1) : random(0.85, 1.15);
    points.push(Math.cos(angle) * radius, Math.sin(angle) * radius);
  }
  return points;
}

function polygon(ctx, points, rx, ry) {
  ctx.beginPath();
  for (let i = 0; i < points.length; i += 2) {
    ctx.lineTo(points[i] * rx, points[i + 1] * ry);
  }
  ctx.closePath();
}

function starPath(ctx, points, outer, inner) {
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 ? inner : outer;
    const angle = -Math.PI / 2 + (i * Math.PI) / points;
    ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
  }
  ctx.closePath();
}

function heartPath(ctx, r) {
  ctx.moveTo(0, r * 0.9);
  ctx.bezierCurveTo(-r * 1.6, -r * 0.1, -r * 0.7, -r * 1.25, 0, -r * 0.45);
  ctx.bezierCurveTo(r * 0.7, -r * 1.25, r * 1.6, -r * 0.1, 0, r * 0.9);
  ctx.closePath();
}

function roundedRect(ctx, x, y, w, h, r) {
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function shapePath(ctx, shape, r) {
  ctx.beginPath();
  switch (shape) {
    case 'star':
      starPath(ctx, 5, r * 1.3, r * 0.55);
      break;
    case 'sparkle':
      starPath(ctx, 4, r * 1.4, r * 0.4);
      break;
    case 'heart':
      heartPath(ctx, r * 1.15);
      break;
    case 'block':
      roundedRect(ctx, -r * 1.2, -r * 0.85, r * 2.4, r * 1.7, r * 0.4);
      break;
    default:
      ctx.arc(0, 0, r, 0, TAU);
  }
}

// Runs the show on `canvas` and calls `onFinish` once everything has faded.
// Returns a function that stops the show early.
function runShow(canvas, onFinish) {
  const ctx = canvas.getContext('2d');
  const rockets = [];
  const smoke = [];
  const flashes = [];
  const sparks = [];
  const confetti = [];
  const words = [];
  let banner = null;
  let width = 0;
  let height = 0;
  let ratio = 1;
  let scale = 1;
  let time = 0;
  let nextCue = 0;
  let finale = false;
  let wordCount = 0;
  let last = performance.now();
  let frame = 0;

  function resize() {
    const box = canvas.getBoundingClientRect();
    width = box.width;
    height = box.height;
    ratio = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    scale = Math.min(1.25, Math.max(0.6, Math.min(width, height) / 900));
  }

  function place(x, y, rotation, size) {
    const cos = Math.cos(rotation) * size * ratio;
    const sin = Math.sin(rotation) * size * ratio;
    ctx.setTransform(cos, sin, -sin, cos, x * ratio, y * ratio);
  }

  function disc(x, y, radius, color) {
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, TAU);
    ctx.fillStyle = color;
    ctx.fill();
  }

  function segment(x0, y0, x1, y1, lineWidth, color) {
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.lineWidth = lineWidth;
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  // Rockets decelerate so they burst at the target while still climbing.
  function launch(cue) {
    const x = cue.from * width;
    const y = height + 30 * scale;
    const vy = (cue.y * height - y) / (0.65 * FLIGHT);
    rockets.push({
      cue, x, y, vx: (cue.x * width - x) / FLIGHT, vy, lift: (-0.7 * vy) / FLIGHT,
      age: 0, puff: 0, phase: random(0, TAU),
    });
  }

  function explode(x, y, cue) {
    const colors = palettes[cue.palette];
    const speed = 480 * scale;
    const add = (dx, dy, color, shape, size, extra) => sparks.push({
      x, y, vx: dx * speed, vy: dy * speed, color, shape, size: size * scale,
      age: 0, life: random(1.35, 1.65), rotation: random(0, TAU), spin: random(-5, 5),
      curl: 0, comet: false, twinkle: false, ...extra,
    });

    switch (cue.burst) {
      case 'heart':
        for (let i = 0; i < 32; i++) {
          const t = (i / 32) * TAU;
          const dy = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
          add(Math.sin(t) ** 3, -(dy + 2.5) / 16, heartColors[i % 2], 'heart', 6, {rotation: 0, spin: 0});
        }
        break;
      case 'smiley':
        for (let i = 0; i < 30; i++) {
          const a = (i / 30) * TAU;
          add(Math.cos(a), Math.sin(a), '#ffd23f', 'circle', 5);
        }
        add(-0.34, -0.28, colors[0], 'circle', 9);
        add(0.34, -0.28, colors[0], 'circle', 9);
        for (let i = 0; i <= 8; i++) {
          const a = Math.PI * (0.2 + (i / 8) * 0.6);
          add(Math.cos(a) * 0.56, Math.sin(a) * 0.56, colors[0], 'circle', 5);
        }
        break;
      case 'star':
        for (let i = 0; i < 10; i++) {
          const a0 = -Math.PI / 2 + (i * Math.PI) / 5;
          const a1 = a0 + Math.PI / 5;
          const r0 = i % 2 ? 0.42 : 1;
          const r1 = i % 2 ? 1 : 0.42;
          for (let j = 0; j < 4; j++) {
            const t = j / 4;
            add(
              Math.cos(a0) * r0 * (1 - t) + Math.cos(a1) * r1 * t,
              Math.sin(a0) * r0 * (1 - t) + Math.sin(a1) * r1 * t,
              colors[i % 2], 'star', 5, {rotation: 0, spin: 0},
            );
          }
        }
        break;
      case 'blocks':
        // Three zones of eight blocks, like the interactive model.
        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 8; col++) {
            add((col - 3.5) * 0.25, (row - 1) * 0.36, blockColors[row], 'block', 7, {rotation: 0, spin: 0});
          }
        }
        break;
      case 'spiral':
        for (let i = 0; i < 24; i++) {
          const a = (i / 24) * TAU;
          add(Math.cos(a), Math.sin(a), colors[i % 2], 'circle', 4.5, {comet: true, curl: 4.5});
        }
        break;
      case 'ring':
        for (let i = 0; i < 36; i++) {
          const a = (i / 36) * TAU;
          add(Math.cos(a), Math.sin(a), colors[0], 'circle', 4, {comet: true});
        }
        for (let i = 0; i < 14; i++) {
          const a = ((i + 0.5) / 14) * TAU;
          add(Math.cos(a) * 0.5, Math.sin(a) * 0.5, colors[1], 'sparkle', 6);
        }
        break;
      default:
        for (let i = 0; i < 30; i++) {
          const a = (i / 30) * TAU + random(-0.08, 0.08);
          const v = random(0.8, 1.1);
          add(Math.cos(a) * v, Math.sin(a) * v, colors[i % 2], 'circle', 4.5, {comet: true});
        }
        for (let i = 0; i < 10; i++) {
          const a = random(0, TAU);
          const v = random(0.2, 0.55);
          add(Math.cos(a) * v, Math.sin(a) * v, colors[1], 'star', 6);
        }
    }

    flashes.push({
      x, y, age: 0, life: 0.42, radius: 40 * scale, color: colors[1], rotation: random(0, TAU),
      points: jaggedPoints(12, 0.5),
      lines: Array.from({length: 12}, (_, i) => (i / 12) * TAU + random(-0.12, 0.12)),
    });
    if (cue.word) {
      words.push({
        text: cue.word, x, y, size: 54 * scale, fill: letterFills[wordCount++ % letterFills.length],
        age: 0, life: 1.05, rotation: random(-0.22, 0.22),
      });
    }
  }

  function confettiPiece(x, y, angle, speed) {
    return {
      x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed,
      w: random(7, 12) * scale, h: random(4, 6) * scale,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      rotation: random(0, TAU), spin: random(-6, 6), flip: random(0, TAU), flipRate: random(6, 12),
      sway: random(20, 45) * scale, swayRate: random(2, 4), phase: random(0, TAU),
      age: 0, life: random(3, 3.8),
    };
  }

  // Finale: banner plus confetti from both bottom corners and the banner.
  function celebrate() {
    ctx.font = `900 100px ${FONT}`;
    const measured = ctx.measureText(BANNER).width;
    const size = Math.min(110 * scale, (width * 0.82 * 100) / measured, height * 0.16);
    const textWidth = (measured * size) / 100;
    banner = {
      x: width / 2, y: height * 0.42, size, age: 0, life: 2.7,
      rx: Math.min(textWidth * 0.68 + size * 0.4, width * 0.49), ry: size * 1.25,
      points: jaggedPoints(16, 0.8),
    };
    const perCorner = Math.round(Math.min(80, Math.max(30, width / 18)));
    for (let i = 0; i < perCorner; i++) {
      const tilt = random(0.2, 0.75);
      confetti.push(confettiPiece(0, height, -Math.PI / 2 + tilt, height * random(1.2, 1.8)));
      confetti.push(confettiPiece(width, height, -Math.PI / 2 - tilt, height * random(1.2, 1.8)));
    }
    const fromBanner = Math.round(Math.min(120, Math.max(40, width / 12)));
    for (let i = 0; i < fromBanner; i++) {
      confetti.push(confettiPiece(banner.x, banner.y, random(0, TAU), random(250, 900) * scale));
    }
  }

  // Ages every item, keeps those for which `advance` returns true, and
  // compacts the list in place. Items that `advance` appends to `list` are
  // processed in the same pass.
  function step(list, dt, advance) {
    let kept = 0;
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      item.age += dt;
      if (advance(item)) list[kept++] = item;
    }
    list.length = kept;
  }

  function update(dt) {
    step(rockets, dt, (rocket) => {
      if (rocket.age >= FLIGHT) {
        explode(rocket.x, rocket.y, rocket.cue);
        return false;
      }
      rocket.vy += rocket.lift * dt;
      rocket.x += rocket.vx * dt;
      rocket.y += rocket.vy * dt;
      rocket.puff -= dt;
      while (rocket.puff <= 0) {
        rocket.puff += 0.02;
        const speed = Math.hypot(rocket.vx, rocket.vy);
        const dx = rocket.vx / speed;
        const dy = rocket.vy / speed;
        smoke.push({
          x: rocket.x - dx * 20 * scale, y: rocket.y - dy * 20 * scale,
          vx: random(-18, 18) - dx * 30, vy: random(-18, 18) - dy * 30,
          radius: random(3.5, 5.5) * scale, age: 0, life: random(0.45, 0.7),
        });
      }
      return true;
    });

    step(smoke, dt, (puff) => {
      puff.x += puff.vx * dt;
      puff.y += puff.vy * dt;
      return puff.age < puff.life;
    });
    step(flashes, dt, (flash) => flash.age < flash.life);
    step(words, dt, (word) => word.age < word.life);

    const drag = Math.exp(-3 * dt);
    const gravity = 140 * scale * dt;
    step(sparks, dt, (spark) => {
      if (spark.age >= spark.life) {
        if (spark.shape !== 'sparkle' && Math.random() < 0.3) {
          sparks.push({
            x: spark.x, y: spark.y, vx: 0, vy: 0, color: '#fffbe6', shape: 'sparkle',
            size: random(4, 6.5) * scale, age: 0, life: 0.3, rotation: random(0, TAU), spin: 0,
            curl: 0, comet: false, twinkle: true,
          });
        }
        return false;
      }
      if (spark.twinkle) return true;
      spark.vx *= drag;
      spark.vy *= drag;
      if (spark.curl) {
        const turn = spark.curl * dt;
        const vx = spark.vx * Math.cos(turn) - spark.vy * Math.sin(turn);
        spark.vy = spark.vx * Math.sin(turn) + spark.vy * Math.cos(turn);
        spark.vx = vx;
      }
      spark.vy += gravity;
      spark.x += spark.vx * dt;
      spark.y += spark.vy * dt;
      spark.rotation += spark.spin * dt;
      return true;
    });

    const air = Math.exp(-2.4 * dt);
    const fall = 420 * scale * dt;
    step(confetti, dt, (piece) => {
      piece.vx *= air;
      piece.vy = piece.vy * air + fall;
      piece.x += (piece.vx + Math.cos(piece.age * piece.swayRate + piece.phase) * piece.sway) * dt;
      piece.y += piece.vy * dt;
      piece.rotation += piece.spin * dt;
      piece.flip += piece.flipRate * dt;
      return piece.age < piece.life && piece.y < height + 40;
    });

    if (banner) {
      banner.age += dt;
      if (banner.age >= banner.life) banner = null;
    }
  }

  // Puffs share one outline: all ink discs first, then all smoke discs.
  function drawSmoke(ink, fill) {
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const outline = 2 * scale;
    for (let pass = 0; pass < 2; pass++) {
      ctx.beginPath();
      for (const puff of smoke) {
        const t = puff.age / puff.life;
        const r = puff.radius * (t < 0.6 ? 1 + 1.1 * easeOut(t / 0.6) : 2.1 * (1 - easeIn((t - 0.6) / 0.4)));
        const radius = pass ? r : r + Math.min(outline, r * 0.5);
        ctx.moveTo(puff.x + radius, puff.y);
        ctx.arc(puff.x, puff.y, radius, 0, TAU);
      }
      ctx.fillStyle = pass ? fill : ink;
      ctx.fill();
    }
  }

  function drawRocket(rocket, ink) {
    const [body, nose] = palettes[rocket.cue.palette];
    const wiggle = Math.sin(rocket.age * 38 + rocket.phase);
    const speed = Math.hypot(rocket.vx, rocket.vy);
    const offset = wiggle * 2.5 * scale;
    place(
      rocket.x - (rocket.vy / speed) * offset,
      rocket.y + (rocket.vx / speed) * offset,
      Math.atan2(rocket.vy, rocket.vx) + Math.PI / 2 + wiggle * 0.08,
      scale,
    );
    const flame = 1 + Math.sin(rocket.age * 70) * 0.15 + Math.random() * 0.12;
    ctx.lineWidth = 2.2;
    ctx.strokeStyle = ink;

    ctx.beginPath();
    ctx.moveTo(-4.5, 11);
    ctx.quadraticCurveTo(-6.5, 19 * flame, 0, 26 * flame);
    ctx.quadraticCurveTo(6.5, 19 * flame, 4.5, 11);
    ctx.closePath();
    ctx.fillStyle = '#ff7a1f';
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-2.5, 11);
    ctx.quadraticCurveTo(-3.2, 16 * flame, 0, 20 * flame);
    ctx.quadraticCurveTo(3.2, 16 * flame, 2.5, 11);
    ctx.closePath();
    ctx.fillStyle = '#ffe14d';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(-6, 1);
    ctx.lineTo(-12.5, 13);
    ctx.lineTo(-6, 10.5);
    ctx.closePath();
    ctx.moveTo(6, 1);
    ctx.lineTo(12.5, 13);
    ctx.lineTo(6, 10.5);
    ctx.closePath();
    ctx.fillStyle = body;
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    roundedRect(ctx, -6, -11, 12, 23, 3);
    ctx.fillStyle = '#fff8ea';
    ctx.fill();
    ctx.fillStyle = body;
    ctx.fillRect(-6, -4, 12, 4);
    ctx.fillRect(-6, 4, 12, 3);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-6, -11);
    ctx.quadraticCurveTo(-5.5, -19, 0, -24);
    ctx.quadraticCurveTo(5.5, -19, 6, -11);
    ctx.closePath();
    ctx.fillStyle = nose;
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    ctx.fillRect(-4, -9, 2, 15);
  }

  function drawFlash(flash, ink, lines) {
    const t = flash.age / flash.life;
    const size = flash.radius * (t < 0.3 ? easeOutBack(t / 0.3) : 1 - easeIn((t - 0.3) / 0.7));
    place(flash.x, flash.y, flash.rotation + flash.age * 0.8, 1);
    ctx.lineWidth = 2.4 * scale;
    ctx.strokeStyle = ink;
    polygon(ctx, flash.points, size, size);
    ctx.fillStyle = flash.color;
    ctx.fill();
    ctx.stroke();
    polygon(ctx, flash.points, size * 0.55, size * 0.55);
    ctx.fillStyle = '#fffbe6';
    ctx.fill();

    const spread = easeOut(t);
    ctx.beginPath();
    for (const angle of flash.lines) {
      const start = flash.radius * (1 + 1.8 * spread);
      const end = start + flash.radius * 0.9 * (1 - spread);
      ctx.moveTo(Math.cos(angle) * start, Math.sin(angle) * start);
      ctx.lineTo(Math.cos(angle) * end, Math.sin(angle) * end);
    }
    ctx.lineWidth = 3 * scale;
    ctx.strokeStyle = lines;
    ctx.stroke();
  }

  function drawSpark(spark, ink) {
    const t = spark.age / spark.life;
    const k = spark.twinkle ? Math.sin(Math.PI * t) : Math.min(1, spark.age / 0.06, (1 - t) / 0.3);
    if (k <= 0) return;
    if (spark.comet) {
      // Head and tapered tail share one outline.
      const r = spark.size * k;
      const outline = 1.8 * scale * k;
      const tailX = spark.x - spark.vx * 0.05;
      const tailY = spark.y - spark.vy * 0.05;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      segment(tailX, tailY, spark.x, spark.y, r * 1.1 + outline * 2, ink);
      disc(spark.x, spark.y, r + outline, ink);
      segment(tailX, tailY, spark.x, spark.y, r * 1.1, spark.color);
      disc(spark.x, spark.y, r, spark.color);
      disc(spark.x - r * 0.35, spark.y - r * 0.35, r * 0.3, 'rgba(255, 255, 255, 0.8)');
      return;
    }
    const round = spark.shape === 'circle' || spark.shape === 'heart';
    place(spark.x, spark.y, spark.shape === 'circle' ? 0 : spark.rotation, k);
    shapePath(ctx, spark.shape, spark.size);
    ctx.fillStyle = spark.color;
    ctx.fill();
    ctx.lineWidth = 1.8 * scale;
    ctx.strokeStyle = ink;
    ctx.stroke();
    if (round) {
      disc(-spark.size * 0.35, -spark.size * 0.35, spark.size * 0.3, 'rgba(255, 255, 255, 0.8)');
    }
  }

  function drawConfetti(piece, ink) {
    const t = piece.age / piece.life;
    place(piece.x, piece.y, piece.rotation, t > 0.85 ? (1 - t) / 0.15 : 1);
    ctx.scale(1, Math.max(0.15, Math.abs(Math.cos(piece.flip))));
    ctx.beginPath();
    ctx.rect(-piece.w / 2, -piece.h / 2, piece.w, piece.h);
    ctx.fillStyle = piece.color;
    ctx.fill();
    ctx.lineWidth = 1.4 * scale;
    ctx.strokeStyle = ink;
    ctx.stroke();
  }

  // Slanted comic lettering with an ink outline and offset ink shadow.
  function drawLettering(text, size, fill, ink) {
    ctx.transform(1, 0, -0.2, 1, 0, 0);
    ctx.font = `900 ${size}px ${FONT}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.lineWidth = size * 0.2;
    ctx.strokeStyle = ink;
    ctx.fillStyle = ink;
    const shadow = size * 0.08;
    ctx.strokeText(text, shadow, shadow);
    ctx.fillText(text, shadow, shadow);
    ctx.strokeText(text, 0, 0);
    const gradient = ctx.createLinearGradient(0, -size * 0.4, 0, size * 0.4);
    gradient.addColorStop(0, fill[0]);
    gradient.addColorStop(1, fill[1]);
    ctx.fillStyle = gradient;
    ctx.fillText(text, 0, 0);
  }

  function drawWord(word, ink) {
    const t = word.age / word.life;
    let k = word.age < 0.22 ? easeOutBack(word.age / 0.22) : 1 + 0.06 * (word.age - 0.22);
    if (t > 0.85) k *= 1 - easeIn((t - 0.85) / 0.15);
    place(word.x, word.y, word.rotation + Math.sin(word.age * 16) * 0.04 * (1 - t), k);
    drawLettering(word.text, word.size, word.fill, ink);
  }

  function drawBanner(ink) {
    const t = banner.age / banner.life;
    let k = banner.age < 0.35 ? easeOutBack(banner.age / 0.35) : 1 + Math.sin((banner.age - 0.35) * 9) * 0.025;
    if (t > 0.88) k *= 1 - easeIn((t - 0.88) / 0.12);
    place(banner.x, banner.y, -0.05, 1);
    ctx.lineWidth = 3 * scale;
    ctx.strokeStyle = ink;
    polygon(ctx, banner.points, banner.rx * k, banner.ry * k);
    ctx.fillStyle = '#3d6fe0';
    ctx.fill();
    ctx.stroke();
    polygon(ctx, banner.points, banner.rx * k * 0.8, banner.ry * k * 0.8);
    ctx.fillStyle = '#7fd0ff';
    ctx.fill();
    ctx.stroke();
    place(banner.x, banner.y, -0.05, k);
    drawLettering(BANNER, banner.size, letterFills[0], ink);
  }

  function draw() {
    const dark = document.documentElement.dataset.theme === 'dark';
    const ink = dark ? '#060a14' : '#1b2140';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    if (smoke.length) drawSmoke(ink, dark ? '#cdd6ec' : '#ffffff');
    for (const rocket of rockets) drawRocket(rocket, ink);
    for (const flash of flashes) drawFlash(flash, ink, dark ? '#fffbe6' : ink);
    for (const spark of sparks) drawSpark(spark, ink);
    for (const piece of confetti) drawConfetti(piece, ink);
    for (const word of words) drawWord(word, ink);
    if (banner) drawBanner(ink);
  }

  function tick(now) {
    // Clamp the step so a backgrounded tab resumes instead of skipping ahead;
    // the first frame's timestamp can precede the start time.
    const dt = Math.max(0, Math.min((now - last) / 1000, 0.05));
    last = now;
    time += dt;
    while (nextCue < cues.length && cues[nextCue].at <= time) launch(cues[nextCue++]);
    if (!finale && time >= FINALE_AT) {
      finale = true;
      celebrate();
    }
    update(dt);
    draw();
    const idle = !banner && !rockets.length && !smoke.length && !flashes.length
      && !sparks.length && !confetti.length && !words.length;
    if (finale && idle) {
      onFinish();
    } else {
      frame = requestAnimationFrame(tick);
    }
  }

  resize();
  window.addEventListener('resize', resize);
  frame = requestAnimationFrame(tick);
  return () => {
    cancelAnimationFrame(frame);
    window.removeEventListener('resize', resize);
  };
}

export default function Fireworks({className}) {
  const canvasRef = useRef(null);
  const [done, setDone] = useState(() => window.matchMedia(REDUCED_MOTION).matches);

  useEffect(() => {
    if (done) return undefined;
    const motion = window.matchMedia(REDUCED_MOTION);
    const finish = () => setDone(true);
    const onMotionChange = () => {
      if (motion.matches) finish();
    };
    const stopShow = runShow(canvasRef.current, finish);
    motion.addEventListener('change', onMotionChange);
    return () => {
      stopShow();
      motion.removeEventListener('change', onMotionChange);
    };
  }, [done]);

  if (done) return null;
  return createPortal(
    <canvas ref={canvasRef} className={className} aria-hidden="true" />,
    document.body,
  );
}
