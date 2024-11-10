import React, { useRef, useEffect } from 'react';
import p5 from 'p5';

const DoubleDoors = () => {
  const sketchRef = useRef();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sketch = (p) => {
        let noiseScale = 0.04;
        let noiseLevel = 3;
        let doorOffset = 0;
        let targetOffset = 0;
        let doorSpeed = 0.1;
        let lockOpened = false;
        let maxDoorOffset;
        let woodTexture;

        p.preload = () => {
          try {
            woodTexture = p.loadImage('woodtexture.jpg');
          } catch (error) {
            console.error('Error loading wood texture:', error);
          }
        };

        p.setup = () => {
          try {
            p.createCanvas(p.windowWidth, p.windowHeight);
            p.rectMode(p.CENTER);
            maxDoorOffset = p.width * 0.5 - 50;
          } catch (error) {
            console.error('Error setting up canvas:', error);
          }
        };

        p.windowResized = () => {
          p.resizeCanvas(p.windowWidth, p.windowHeight);
          maxDoorOffset = p.width * 0.5 - 50;
          if (lockOpened) {
            doorOffset = Math.min(doorOffset, maxDoorOffset);
          }
        };

        p.draw = () => {
          p.clear();
          p.translate(p.width / 2, p.height / 2);

          const doorWidth = p.width / 2;
          const doorHeight = p.height;

          // Draw left door with wood texture
          p.push();
          p.translate(-doorWidth / 2 - doorOffset, 0);
          if (woodTexture) {
            p.imageMode(p.CENTER);
            p.image(woodTexture, 0, 0, doorWidth, doorHeight);
          }
          p.pop();

          // Draw right door with wood texture
          p.push();
          p.translate(doorWidth / 2 + doorOffset, 0);
          if (woodTexture) {
            p.imageMode(p.CENTER);
            p.image(woodTexture, 0, 0, doorWidth, doorHeight);
          }
          p.pop();

          // Draw right half of the lock on the left door
          p.strokeWeight(5);
          p.stroke('#D0F0C0');
          p.fill('#4D5D53');
          p.beginShape();
          for (let a = p.PI; a < p.TWO_PI; a += 0.1) { // Right half
              const r = 5;
              const x = r * 16 * Math.pow(Math.sin(a), 3);
              const y = -r * (13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a));
              p.vertex(x - doorOffset, y);
          }
          p.endShape();

          // Draw left half of the lock on the right door
          p.beginShape();
          for (let a = 0; a < p.PI; a += 0.1) { // Left half
              const r = 5;
              const x = r * 16 * Math.pow(Math.sin(a), 3);
              const y = -r * (13 * Math.cos(a) - 5 * Math.cos(2 * a) - 2 * Math.cos(3 * a) - Math.cos(4 * a));
              p.vertex(x + doorOffset, y);
          }
          p.endShape();

          // Draw lock details for right half on the left door
          p.fill(160, 160, 160);
          p.noStroke();
          p.beginShape();
          p.vertex(-4 - doorOffset, 10);
          p.vertex(4 - doorOffset, 10);
          p.vertex(10 - doorOffset, 50);
          p.vertex(-10 - doorOffset, 50);
          p.endShape(p.CLOSE);

          p.fill(210, 210, 210);
          p.ellipse(-doorOffset, 0, 25, 25);
          p.ellipse(-doorOffset, 0, 20, 10);

          p.stroke(255, 255, 255, 100);
          p.strokeWeight(1);
          p.ellipse(-doorOffset, 50, 20, 8);

          // Draw lock details for left half on the right door
          p.fill(160, 160, 160);
          p.noStroke();
          p.beginShape();
          p.vertex(-4 + doorOffset, 10);
          p.vertex(4 + doorOffset, 10);
          p.vertex(10 + doorOffset, 50);
          p.vertex(-10 + doorOffset, 50);
          p.endShape(p.CLOSE);

          p.fill(210, 210, 210);
          p.ellipse(doorOffset, 0, 25, 25);
          p.ellipse(doorOffset, 0, 20, 10);

          p.stroke(255, 255, 255, 100);
          p.strokeWeight(1);
          p.ellipse(doorOffset, 50, 20, 8);

          if (lockOpened && doorOffset < maxDoorOffset) {
              doorOffset = p.lerp(doorOffset, maxDoorOffset, doorSpeed);
          }
        };

        p.mousePressed = () => {
          if (!lockOpened) {
            lockOpened = true;
          }
        };
      };

      const p5Instance = new p5(sketch, sketchRef.current);

      return () => {
        p5Instance.remove();
      };
    }
  }, []);

  return (
    <div
      ref={sketchRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        zIndex: 10,
        pointerEvents: 'none',
        width: '100%',
        height: '100%',
      }}
    ></div>
  );
};

export default DoubleDoors;
