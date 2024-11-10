import React, { useEffect, useState } from 'react';
import p5 from 'p5';
import { BackwardIcon, ForwardIcon } from '@heroicons/react/24/outline';
import { getFirestore, collection, getDocs, addDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import HangerPopup from './HangerPopup';

function Drawers({ refreshKey }) {
  const [images, setImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [bottomsImages, setBottomsImages] = useState([]);
  const [bottomsIndex, setBottomsIndex] = useState(0);
  const [outfitPairs, setOutfitPairs] = useState([]);
  const [hoveredPairIndex, setHoveredPairIndex] = useState(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [openDrawerIndex, setOpenDrawerIndex] = useState(0); // Track which drawer is open
  const [visibleHangers, setVisibleHangers] = useState(4); // Initialize with a default value

  useEffect(() => {
    const fetchImages = async () => {
      const db = getFirestore();
      const storage = getStorage();
      const querySnapshot = await getDocs(collection(db, 'outfits'));
      const imageUrls = [];
      const bottomsUrls = [];

      for (const doc of querySnapshot.docs) {
        const data = doc.data();
        const imageRef = ref(storage, `${data.image}`);
        try {
          const url = await getDownloadURL(imageRef);
          if (data.category === 'top') {
            imageUrls.push(url);
          } else if (data.category === 'bottom') {
            bottomsUrls.push(url);
          }
        } catch (error) {
          console.error("Error fetching image URL:", error);
        }
      }

      setImages(imageUrls);
      setBottomsImages(bottomsUrls);
    };

    fetchImages();
  }, [refreshKey]);

  useEffect(() => {
    const fetchOutfitPairs = async () => {
      const db = getFirestore();
      const querySnapshot = await getDocs(collection(db, 'outfitPairs'));
      const pairs = querySnapshot.docs.map(doc => doc.data());
      setOutfitPairs(pairs);
      setVisibleHangers(pairs.length); // Set the number of visible hangers to the number of pairs
    };

    fetchOutfitPairs();
  }, [refreshKey]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const sketch = (p) => {
        let img;
        let woodTexture;
        let drawers = [
          { x: -200, y: -100, z: 50, depth: 100, open: true }, // First drawer open by default
          { x: -200, y: 40, z: -50, depth: 100, open: false },
          { x: -200, y: 150, z: -50, depth: 100, open: false }
        ];

        let rodY = -180;
        let rodStartX = 105;
        let rodEndX = 290;
        let spacing = 50;
        let hangerDrop = 10;

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

          // Conditionally draw the clothing rack if the first drawer is open
          if (drawers[0].open) {
            p.push();
            p.stroke("#35261F");
            p.strokeWeight(4);

            // Calculate the number of rows needed
            const rows = Math.ceil(visibleHangers / 4);
            const rowSpacing = 60; // Adjust spacing between rows as needed

            for (let row = 0; row < rows; row++) {
              const yOffset = rodY + (row * rowSpacing);
              p.line(rodStartX, yOffset, rodEndX, yOffset);

              for (let i = 0; i < 4; i++) {
                const hangerIndex = row * 4 + i;
                if (hangerIndex >= visibleHangers) break; // Stop if no more hangers

                let x = rodStartX + spacing / 2 + (i * spacing);
                drawOutlinedHanger(p, x, yOffset + hangerDrop, hangerIndex);
              }
            }
            p.pop();
          }
        };

        function drawOutlinedHanger(p, x, y, index) {
          p.push();
          p.stroke("#4D5D53");
          p.strokeWeight(2);
          p.noFill();

          // Add hover detection
          const canvasX = p.mouseX - p.width / 2;
          const canvasY = p.mouseY - p.height / 2;
          let isHovered = false;

          if (canvasX > x - 15 && canvasX < x + 15 && canvasY > y - 10 && canvasY < y + 10) {
            isHovered = true;
            if (hoveredPairIndex !== index) {
              setHoveredPairIndex(index);
              setIsPopupVisible(true);
            }
          } else if (hoveredPairIndex === index) {
            setHoveredPairIndex(null);
            setIsPopupVisible(false);
          }

          // Levitate the hanger slightly if hovered
          if (isHovered) {
            p.translate(0, -2);
          }

          // Draw the hanger
          p.beginShape();
          p.vertex(x, y - 10);
          p.bezierVertex(x - 2.5, y - 20, x + 5, y - 20, x, y - 15);
          p.endShape();

          p.beginShape();
          p.vertex(x - 15, y);
          p.bezierVertex(x - 10, y - 7.5, x + 10, y - 7.5, x + 15, y);
          p.vertex(x + 12.5, y + 2.5);
          p.vertex(x - 12.5, y + 2.5);
          p.endShape(p.CLOSE);

          p.line(x - 12.5, y + 2.5, x + 12.5, y + 2.5);

          p.beginShape();
          p.vertex(x - 15, y); 
          p.vertex(x - 17.5, y + 2.5);
          p.vertex(x - 16.5, y + 3.5);
          p.endShape();

          p.beginShape();
          p.vertex(x + 15, y);
          p.vertex(x + 17.5, y + 2.5);
          p.vertex(x + 16.5, y + 3.5);
          p.endShape();

          p.pop();
        }

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
              setOpenDrawerIndex(i); // Update the open drawer index
            }
          }
        };
      };

      const p5Instance = new p5(sketch);

      return () => {
        p5Instance.remove();
      };
    }
  }, [outfitPairs, visibleHangers]); // Add visibleHangers to dependencies

  const handleNextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePreviousImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  const handleNextBottomsImage = () => {
    setBottomsIndex((prevIndex) => (prevIndex + 1) % bottomsImages.length);
  };

  const handlePreviousBottomsImage = () => {
    setBottomsIndex((prevIndex) => (prevIndex - 1 + bottomsImages.length) % bottomsImages.length);
  };

  const saveCurrentPair = async () => {
    const db = getFirestore();
    try {
      // Fetch existing outfit pairs
      const querySnapshot = await getDocs(collection(db, 'outfitPairs'));
      const existingPairs = querySnapshot.docs.map(doc => doc.data());

      // Check if the current pair already exists
      const currentPair = {
        top: images[currentIndex],
        bottom: bottomsImages[bottomsIndex]
      };

      const pairExists = existingPairs.some(pair => 
        pair.top === currentPair.top && pair.bottom === currentPair.bottom
      );

      if (pairExists) {
        alert('This outfit pair has already been saved.');
        return;
      }

      // Save the new outfit pair
      await addDoc(collection(db, 'outfitPairs'), {
        ...currentPair,
        createdAt: new Date()
      });
      alert('Outfit pair saved successfully!');
    } catch (error) {
      console.error("Error saving outfit pair:", error);
      alert('Failed to save outfit pair.');
    }
  };

  return (
    <div
      className="flex flex-col items-center absolute top-[50%] left-[50%] transform -translate-x-1/2"
      onMouseLeave={() => setIsPopupVisible(false)}
    >
      {openDrawerIndex === 0 && (
        <>
          <HangerPopup
            isVisible={isPopupVisible}
            pair={outfitPairs[hoveredPairIndex]}
            onClose={() => setIsPopupVisible(false)}
          />
          <div className="flex items-center justify-center w-[180px] h-[150px] bg-[#D0D0D0] shadow-md shadow-black mt-4">
            <img
              src={images[currentIndex] || '/image-placeholder.png'}
              alt="Outfit"
              className="w-[90%] h-[90%] object-cover shadow-md shadow-black"
              onError={(e) => e.target.src = '/image-placeholder.png'}
            />
          </div>
          <div className="grid grid-cols-3 gap-8 justify-center items-center">
            <BackwardIcon
              className="w-8 h-8 text-[#D0F0C0] hover:scale-110 transition-scale duration-300"
              onClick={handlePreviousImage}
            />
            <p> {/*empty cell */}</p>
            <ForwardIcon
              className="w-8 h-8 text-[#D0F0C0] hover:scale-110 transition-scale duration-300"
              onClick={handleNextImage}
            />
          </div>
          <div className="flex items-center justify-center w-[180px] h-[150px] bg-[#D0D0D0] shadow-md shadow-black">
            <img
              src={bottomsImages[bottomsIndex] || '/bottoms-placeholder.png'}
              alt="Bottom"
              className="w-[90%] h-[90%] object-cover shadow-md shadow-black"
              onError={(e) => e.target.src = '/bottoms-placeholder.png'}
            />
          </div>
          <div className="grid grid-cols-3 gap-8 justify-center items-center">
            <BackwardIcon
              className="w-8 h-8 text-[#D0F0C0] hover:scale-110 transition-scale duration-300"
              onClick={handlePreviousBottomsImage}
            />
            <p> {/*empty cell */}</p>
            <ForwardIcon
              className="w-8 h-8 text-[#D0F0C0] hover:scale-110 transition-scale duration-300"
              onClick={handleNextBottomsImage}
            />
          </div>
          <button
            onClick={saveCurrentPair}
            className="mt-4 px-4 py-2 bg-[#4D5D53] text-[#D0F0C0] font-semibold rounded-lg shadow-md hover:bg-[#D0D0D0] hover:text-[#4D5D53] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#88c9a7]"
          >
            Save Outfit Pair
          </button>
        </>
      )}
      {openDrawerIndex === 1 && (
        <div className="flex flex-col gap-4 ml-16">
          {/* Title for Tops */}
          <h2 className="text-lg font-semibold text-center">Tops</h2>
          {/* Render the second drawer content: first row for tops */}
          <div className="flex flex-wrap justify-center gap-4">
            {images.map((url, index) => (
              <img
                key={`top-${index}`}
                src={url}
                alt={`Top ${index}`}
                className="w-20 h-20 object-cover"
              />
            ))}
          </div>
          {/* Title for Bottoms */}
          <h2 className="text-lg font-semibold text-center">Bottoms</h2>
          {/* Render the second drawer content: second row for bottoms */}
          <div className="flex flex-wrap justify-center gap-4">
            {bottomsImages.map((url, index) => (
              <img
                key={`bottom-${index}`}
                src={url}
                alt={`Bottom ${index}`}
                className="w-20 h-20 object-cover"
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Drawers;