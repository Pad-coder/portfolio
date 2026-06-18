import React, { useEffect, useRef } from "react";
import { sharedPhysics } from "./Github.jsx";

const syntaxList = [
  "{}",
  "<>",
  "</>",
  "[]",
  "()",
  "=>",
  "const",
  "async",
  "await",
  "return",
  "function",
  "class",
  "interface",
  "React",
  "Node",
  "MongoDB",
  "0101",
  "110011",
];

export default function DigitalUniverse() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    let animationFrameId;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let scrollY = window.scrollY;
    let targetScrollY = window.scrollY;
    const isMobile = width < 768;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let mouse = { x: width / 2, y: height / 2, vx: 0, vy: 0 };
    let ripples = [];

    const STAR_COUNT = isMobile ? 30 : 120;
    const SYNTAX_COUNT = isMobile ? 10 : 30;
    const DUST_COUNT = isMobile ? 15 : 40;

    const stars = [];
    const syntaxes = [];
    const dusts = [];
    let shootingStar = null;

    const initEntities = () => {
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * (height * 3),
          z: Math.random() * 0.5 + 0.1,
          r: Math.random() * 1.5 + 0.5,
          alpha: Math.random(),
          twinkleSpeed: Math.random() * 0.02 + 0.005,
          isLime: Math.random() > 0.95,
        });
      }

      for (let i = 0; i < SYNTAX_COUNT; i++) {
        syntaxes.push({
          x: Math.random() * width,
          y: Math.random() * (height * 3),
          z: Math.random() * 0.8 + 0.4,
          text: syntaxList[Math.floor(Math.random() * syntaxList.length)],
          alpha: Math.random() * 0.15 + 0.02,
          rot: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.01,
          type: Math.random() > 0.7 ? "binary" : "code",
        });
      }

      for (let i = 0; i < DUST_COUNT; i++) {
        dusts.push({
          x: Math.random() * width,
          y: Math.random() * (height * 3),
          z: Math.random() * 1.2 + 0.8,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
        });
      }
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener("resize", resize);
    resize();
    initEntities();

    const handleMouseMove = (e) => {
      mouse.vx = e.clientX - mouse.x;
      mouse.vy = e.clientY - mouse.y;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    sharedPhysics.on("released", () => {
      ripples.push({
        x: sharedPhysics.ball.x,
        y: sharedPhysics.ball.y,
        radius: 0,
        alpha: 1,
      });
    });

    let time = 0;
    const render = () => {
      time += 1;
      targetScrollY = window.scrollY;
      scrollY += (targetScrollY - scrollY) * 0.1;

      const scrollPercent = scrollY / (document.body.scrollHeight - height || 1);
      ctx.clearRect(0, 0, width, height);

      // 1. NEBULA - Opacity significantly reduced for performance
      if (!prefersReducedMotion && !isMobile) {
        const cx = width * 0.5 + Math.sin(time * 0.002) * 100;
        const cy = height * 0.5 + Math.cos(time * 0.003) * 100 - scrollY * 0.1;
        const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, 800);
        grad.addColorStop(0, "rgba(163, 230, 53, 0.015)");
        grad.addColorStop(1, "rgba(0, 0, 0, 0)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      }

      // 2. STARS
      stars.forEach((star) => {
        let sy = (star.y - scrollY * star.z) % height;
        if (sy < 0) sy += height;

        star.alpha += Math.sin(time * star.twinkleSpeed) * 0.05;
        const clampedAlpha = Math.max(
          0.05,
          Math.min(star.alpha, star.isLime ? 0.4 : 0.25),
        );

        ctx.beginPath();
        ctx.arc(star.x, sy, star.r, 0, Math.PI * 2);
        ctx.fillStyle = star.isLime
          ? `rgba(163, 230, 53, ${clampedAlpha})`
          : `rgba(255, 255, 255, ${clampedAlpha})`;
        ctx.fill();
      });

      // 3. SHOOTING STARS
      if (!prefersReducedMotion) {
        if (!shootingStar && Math.random() < 0.002) {
          shootingStar = {
            x: Math.random() * width,
            y: 0,
            vx: Math.random() * 15 + 10,
            vy: Math.random() * 10 + 5,
            length: Math.random() * 100 + 50,
          };
        }
        if (shootingStar) {
          shootingStar.x += shootingStar.vx;
          shootingStar.y += shootingStar.vy;

          const grad = ctx.createLinearGradient(
            shootingStar.x,
            shootingStar.y,
            shootingStar.x - shootingStar.vx * 2,
            shootingStar.y - shootingStar.vy * 2,
          );
          grad.addColorStop(0, "rgba(255,255,255,0.4)");
          grad.addColorStop(1, "rgba(255,255,255,0)");

          ctx.beginPath();
          ctx.moveTo(shootingStar.x, shootingStar.y);
          ctx.lineTo(
            shootingStar.x - shootingStar.length * (shootingStar.vx / 20),
            shootingStar.y - shootingStar.length * (shootingStar.vy / 20),
          );
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1;
          ctx.stroke();

          if (shootingStar.x > width || shootingStar.y > height)
            shootingStar = null;
        }
      }

      // 4. FLOATING SYNTAX
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      syntaxes.forEach((syn) => {
        let sy = (syn.y - scrollY * syn.z) % height;
        if (sy < 0) sy += height;

        let targetAlpha = syn.alpha;
        if (syn.type === "binary" && scrollPercent > 0.4 && scrollPercent < 0.6)
          targetAlpha *= 1.5;
        if (syn.type === "code" && scrollPercent > 0.1 && scrollPercent < 0.3)
          targetAlpha *= 1.5;

        if (!prefersReducedMotion) syn.rot += syn.rotSpeed;

        const b = sharedPhysics.ball;
        const distSq = (syn.x - b.x) * (syn.x - b.x) + (sy - b.y) * (sy - b.y);
        
        // FIXED threshold to 40000 (200px distance) for responsive behavior
        if (b.isGrabbed && distSq < 40000) {
          syn.x += (syn.x - b.x) * 0.02;
          targetAlpha = 0;
        }

        ctx.save();
        ctx.translate(syn.x, sy);
        ctx.rotate(syn.rot);
        ctx.font = `14px monospace`;
        ctx.fillStyle = `rgba(163, 230, 53, ${Math.min(targetAlpha, 0.12)})`;
        ctx.fillText(syn.text, 0, 0);
        ctx.restore();
      });

      // 5. DATA PARTICLES & NETWORK
      ctx.strokeStyle = "rgba(163, 230, 53, 0.08)";
      ctx.fillStyle = "rgba(163, 230, 53, 0.2)";

      dusts.forEach((dust, i) => {
        if (!prefersReducedMotion) {
          dust.x += dust.vx;
          dust.y += dust.vy;
        }

        let sy = (dust.y - scrollY * dust.z) % height;
        if (sy < 0) sy += height;

        if (!isMobile) {
          const distSqMouse = (dust.x - mouse.x) * (dust.x - mouse.x) + (sy - mouse.y) * (sy - mouse.y);
          if (distSqMouse < 22500) { // 150px threshold
            dust.x += (dust.x - mouse.x) * 0.01;
            dust.y += (sy - mouse.y) * 0.01;
          }
        }

        const b = sharedPhysics.ball;
        const distSqBall = (dust.x - b.x) * (dust.x - b.x) + (sy - b.y) * (sy - b.y);
        
        // FIXED: Replaced 'distToBall' with 'distSqBall' to match our high-performance calculation
        if (b.isGrabbed && distSqBall < 62500) {
          const dx = dust.x - b.x;
          const dy = sy - b.y;
          dust.x += dy * 0.02;
          dust.y -= dx * 0.02;
        }

        ctx.beginPath();
        ctx.arc(dust.x, sy, 1.2, 0, Math.PI * 2);
        ctx.fill();

        if (!isMobile) {
          for (let j = i + 1; j < dusts.length; j++) {
            let sy2 = (dusts[j].y - scrollY * dusts[j].z) % height;
            if (sy2 < 0) sy2 += height;
            
            // Re-introduced Math.sqrt ONLY for the complex interconnected lines on Desktop
            const dist = Math.sqrt(
              (dust.x - dusts[j].x) ** 2 + (sy - sy2) ** 2,
            );

            if (dist < 70) {
              ctx.beginPath();
              ctx.moveTo(dust.x, sy);
              ctx.lineTo(dusts[j].x, sy2);
              ctx.stroke();
            }
          }
        }
      });

      // 6. RIPPLE EFFECTS
      ripples.forEach((rip, i) => {
        rip.radius += 5;
        rip.alpha -= 0.02;
        if (rip.alpha <= 0) {
          ripples.splice(i, 1);
          return;
        }
        ctx.beginPath();
        ctx.arc(rip.x, rip.y - scrollY * 0.1, rip.radius, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(163, 230, 53, ${rip.alpha * 0.3})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ background: "#050505" }}
    />
  );
}