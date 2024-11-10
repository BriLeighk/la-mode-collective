import React, { useEffect } from 'react';
import p5 from 'p5';
import { BackwardIcon, ForwardIcon } from '@heroicons/react/24/outline';

function Drawers() {
  useEffect(() => {
    const sketch = (p) => {
      let img;
      let woodTexture;
      let drawers = [
        { x: -200, y: -100, z: -50, depth: 100, open: false },
        { x: -200, y: 40, z: -50, depth: 100, open: false },
        { x: -200, y: 150, z: -50, depth: 100, open: false }
      ];

      p.preload = () => {
        img = p.loadImage('/dresser.png');
        woodTexture = p.loadImage('/woodtexture.jpg');
      };

      p.setup = () => {
        p.createCanvas(p.windowWidth, p.windowHeight, p.WEBGL);
      };

      p.draw = () => {
        p.clear();

        p.stroke(0);

        // Draw the dresser image in the background
        p.push();
        p.translate(-p.width / 2, -p.height / 2, -200);
        p.image(img, 0, 0, p.width, p.height);
        p.pop();

        // Draw each drawer in the array
        for (let i = 0; i < drawers.length; i++) {
          let drawer = drawers[i];
          p.push();
          p.translate(drawer.x, drawer.y, drawer.z);

          // Move the drawer outward if it is open
          if (drawer.open && drawer.z < 50) {
            drawer.z += 20;
          } else if (!drawer.open && drawer.z > -50) {
            drawer.z -= 20;
          }

          // Apply the wood texture to the drawer box
          p.texture(woodTexture);

          // Set a dark border color
          p.stroke(0); // Dark gray color for the border
          p.strokeWeight(3); // Set the thickness of the border

          p.box(100, 30, drawer.depth);

          // Draw the drawer handle
          p.fill(200);
          p.translate(0, 0, drawer.depth / 2 + 5);
          p.sphere(5);
          p.pop();
        }

        // Draw hangers over dresser
        // Add the new div container and its elements
        p.push();
        p.translate(0, -45, 0); // Adjust the position as needed
        p.noStroke();
        p.fill('#4d5d53');
        p.box(200, 380, 10); // Background box for the new div
        p.pop();
      };

      p.mousePressed = () => {
        let mx = p.mouseX - p.width / 2;
        let my = p.mouseY - p.height / 2;

        for (let i = 0; i < drawers.length; i++) {
          let drawer = drawers[i];
          if (
            mx > drawer.x - 50 && mx < drawer.x + 50 &&
            my > drawer.y - 15 && my < drawer.y + 15
          ) {
            for (let j = 0; j < drawers.length; j++) {
              if (j !== i) {
                drawers[j].open = false;
              }
            }
            drawer.open = !drawer.open;
          }
        }
      };
    };

    const p5Instance = new p5(sketch);

    return () => {
      p5Instance.remove();
    };
  }, []);

  return (
    <div className="flex flex-col items-center absolute top-[50%] left-[50%] transform -translate-x-1/2">
      <div className="flex items-center justify-center w-[180px] h-[150px] bg-[#4d5d53] shadow-md shadow-black mt-4">
        <img src="/image-placeholder.png" alt="Outfit 1" className="w-[90%] h-[90%] object-cover shadow-md shadow-black"/>
      </div>
      <div className="grid grid-cols-3 gap-8 justify-center items-center">
        <BackwardIcon className="w-8 h-8 text-[#D0F0C0] hover:scale-110 transition-scale duration-300"/>
        <p> {/*empty cell */}</p>
        <ForwardIcon className="w-8 h-8 text-[#D0F0C0] hover:scale-110 transition-scale duration-300"/>
      </div>
      <div className="flex items-center justify-center w-[180px] h-[150px] bg-[#4d5d53] shadow-md shadow-black">
        <img src="/bottoms-placeholder.png" alt="Outfit 1" className="w-[90%] h-[90%] object-cover shadow-md shadow-black"/>
      </div>
      <div className="grid grid-cols-3 gap-8 justify-center items-center">
        <BackwardIcon className="w-8 h-8 text-[#D0F0C0] hover:scale-110 transition-scale duration-300" />
        <p> {/*empty cell */}</p>
        <ForwardIcon className="w-8 h-8 text-[#D0F0C0] hover:scale-110 transition-scale duration-300"/>
      </div>
    </div>
  );
}

export default Drawers;