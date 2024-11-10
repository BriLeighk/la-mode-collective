import { useState } from 'react';
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import axios from 'axios';

export default function OutfitModal({ isVisible, onClose }) {
  const [category, setCategory] = useState('');
  const [subType, setSubType] = useState('');
  const [selectedColors, setSelectedColors] = useState([]);
  const [pantsType, setPantsType] = useState('');
  const [image, setImage] = useState(null);
  const [formError, setFormError] = useState('');
  const [step, setStep] = useState(1);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryChange = (event) => {
    setCategory(event.target.value);
    setSubType('');
  };

  const handleSubTypeChange = (event) => {
    setSubType(event.target.value);
  };

  const handlePantsTypeChange = (event) => {
    setPantsType(event.target.value);
  };

  const handleColorSelection = (color) => {
    setSelectedColors((prevColors) =>
      prevColors.includes(color)
        ? prevColors.filter((c) => c !== color)
        : [...prevColors, color]
    );
  };

  const handleNext = () => {
    if (step === 1 && !image) {
      setFormError("Please upload an image.");
      return;
    }
    if (step === 2 && !category) {
      setFormError("Please select a category.");
      return;
    }
    if (step === 3 && category === "top" && !subType) {
      setFormError("Please select a type of top.");
      return;
    }
    if (step === 3 && category === "bottom" && !subType) {
      setFormError("Please select a type of bottom.");
      return;
    }
    if (step === 4 && selectedColors.length === 0) {
      setFormError("Please select at least one color.");
      return;
    }
    setFormError('');
    setStep((prevStep) => prevStep + 1);
  };

  const handlePrevious = () => {
    setStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  const handleSubmit = async () => {
    setFormError('');

    try {
      // Store the image and data in Firebase
      const storage = getStorage();
      const storageRef = ref(storage, `images/${new Date().toISOString()}.png`);
      await uploadString(storageRef, image.split(',')[1], 'base64');

      // Get the download URL
      const downloadURL = await getDownloadURL(storageRef);

      const db = getFirestore();
      await addDoc(collection(db, 'outfits'), {
        category,
        subType,
        selectedColors,
        pantsType,
        image: downloadURL,
        createdAt: new Date()
      });

      // Reset form
      setCategory('');
      setSubType('');
      setSelectedColors([]);
      setPantsType('');
      setImage(null);
      setStep(1);
      onClose();
    } catch (error) {
      console.error("Error uploading image or storing data:", error);
      setFormError('Failed to upload image or store data.');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#D0F0C0] text-[#4D5D53] rounded-lg w-full max-w-md shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Add New Item To Closet</h2>

        <div className="h-96 overflow-y-auto p-4 bg-[#D0F0C0] rounded-lg shadow-inner">
          <form>
            {step === 1 && (
              <div className="mb-4">
                <label className="block font-semibold mb-2">Upload Image:</label>
                <p className="text-sm text-gray-600 mb-2">Please ensure the image is taken against a plain light-colored background.</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-[#4D5D53] bg-[#D0F0C0] p-2 rounded border border-gray-300"
                />
                {image && (
                  <div className="mt-4">
                    <img src={image} alt="Uploaded Outfit" className="w-full h-32 object-cover rounded-md shadow-sm" />
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <>
                <label className="block mb-2 font-semibold">Category:</label>
                <select
                  className="w-full mb-4 p-2 rounded bg-[#4D5D53] text-[#D0F0C0]"
                  value={category}
                  onChange={handleCategoryChange}
                >
                  <option value="">Select Category</option>
                  <option value="top">Top</option>
                  <option value="bottom">Bottom</option>
                  <option value="dress">Dress</option>
                </select>
              </>
            )}

            {step === 3 && category === "top" && (
              <>
                <label className="block mb-2 font-semibold">Type of Top:</label>
                <select className="w-full mb-4 p-2 rounded bg-[#4D5D53] text-[#D0F0C0]" value={subType} onChange={handleSubTypeChange}>
                  <option value="">Select Type</option>
                  <option value="shirt">Shirt</option>
                  <option value="sweater">Sweater</option>
                  <option value="hoodie">Hoodie</option>
                  <option value="jacket">Jacket</option>
                </select>
                {subType === "shirt" && (
                  <>
                    <label className="block mb-2 font-semibold">Sleeve Length:</label>
                    <label><input type="checkbox" value="sleeveless" /> Sleeveless/Tube</label><br />
                    <label><input type="checkbox" value="spaghetti" /> Spaghetti</label><br />
                    <label><input type="checkbox" value="tank" /> Tank</label><br />
                    <label><input type="checkbox" value="short" /> Short</label><br />
                    <label><input type="checkbox" value="half" /> Half</label><br />
                    <label><input type="checkbox" value="3/4" /> 3/4</label><br />
                    <label><input type="checkbox" value="full" /> Full</label><br />

                    <label className="block mb-2 font-semibold">Material:</label>
                    <label><input type="checkbox" value="cotton" /> Cotton</label><br />
                    <label><input type="checkbox" value="lace" /> Lace</label><br />
                    <label><input type="checkbox" value="silk" /> Silk</label><br />
                    <label><input type="checkbox" value="linen" /> Linen</label><br />
                  </>
                )}
                {subType === "sweater" && (
                  <>
                    <label className="block mb-2 font-semibold">Sleeve Length:</label>
                    <label><input type="checkbox" value="vest" /> Vest</label><br />
                    <label><input type="checkbox" value="short" /> Short</label><br />
                    <label><input type="checkbox" value="half" /> Half</label><br />
                    <label><input type="checkbox" value="3/4" /> 3/4</label><br />
                    <label><input type="checkbox" value="full" /> Full</label><br />
                  </>
                )}
                {subType === "jacket" && (
                  <>
                    <label className="block mb-2 font-semibold">Type of Jacket:</label>
                    <label><input type="checkbox" value="denim" /> Denim</label><br />
                    <label><input type="checkbox" value="rain" /> Rain</label><br />
                    <label><input type="checkbox" value="leather" /> Leather</label><br />
                    <label><input type="checkbox" value="winter" /> Winter</label><br />
                    <label><input type="checkbox" value="zip" /> Zip</label><br />
                    <label><input type="checkbox" value="flannel" /> Flannel</label><br />
                  </>
                )}
              </>
            )}

            {step === 3 && category === "bottom" && (
              <>
                <label className="block mb-2 font-semibold">Type of Bottom:</label>
                <select className="w-full mb-4 p-2 rounded bg-[#4D5D53] text-[#D0F0C0]" value={subType} onChange={handleSubTypeChange}>
                  <option value="">Select Type</option>
                  <option value="pants">Pants</option>
                  <option value="skirts">Skirts</option>
                </select>
                {subType === "pants" && (
                  <>
                    <label className="block mb-2 font-semibold">Length:</label>
                    <label><input type="checkbox" value="short" /> Shorts</label><br />
                    <label><input type="checkbox" value="knee" /> Knee length</label><br />
                    <label><input type="checkbox" value="3/4" /> 3/4 length</label><br />
                    <label><input type="checkbox" value="full" /> Full length</label><br />

                    <label className="block mb-2 font-semibold">Rise:</label>
                    <label><input type="checkbox" value="high" /> High</label><br />
                    <label><input type="checkbox" value="normal" /> Normal</label><br />
                    <label><input type="checkbox" value="low" /> Low</label><br />

                    <label className="block mb-2 font-semibold">Type of Pants:</label>
                    <select className="w-full mb-4 p-2 rounded bg-[#4D5D53] text-[#D0F0C0]" value={pantsType} onChange={handlePantsTypeChange}>
                      <option value="">Select Pants Type</option>
                      <option value="jeans">Jeans</option>
                      <option value="tights">Tights</option>
                      <option value="sweats">Sweats</option>
                      <option value="business">Business</option>
                      <option value="khakis">Khakis</option>
                      <option value="cargo">Cargo</option>
                    </select>
                    {pantsType === "jeans" && (
                      <>
                        <label className="block mb-2 font-semibold">Fit of Jeans:</label>
                        <label><input type="checkbox" value="straight" /> Straight/normal</label><br />
                        <label><input type="checkbox" value="flare" /> Flare/bootcut</label><br />
                        <label><input type="checkbox" value="baggy" /> Baggy</label><br />
                      </>
                    )}
                  </>
                )}
                {subType === "skirts" && (
                  <>
                    <label className="block mb-2 font-semibold">Length of Skirt:</label>
                    <label><input type="checkbox" value="mini" /> Mini</label><br />
                    <label><input type="checkbox" value="short" /> Short</label><br />
                    <label><input type="checkbox" value="aboveKnee" /> Above knee</label><br />
                    <label><input type="checkbox" value="knee" /> Knee</label><br />
                    <label><input type="checkbox" value="belowKnee" /> Below knee</label><br />
                    <label><input type="checkbox" value="calf" /> At calf</label><br />
                    <label><input type="checkbox" value="ankle" /> Ankle</label><br />
                    <label><input type="checkbox" value="floor" /> Floor</label><br />
                  </>
                )}
              </>
            )}

            {step === 3 && category === "dress" && (
              <>
                <label className="block mb-2 font-semibold">Length of Dress:</label>
                <label><input type="checkbox" value="mini" /> Mini</label><br />
                <label><input type="checkbox" value="short" /> Short</label><br />
                <label><input type="checkbox" value="aboveKnee" /> Above knee</label><br />
                <label><input type="checkbox" value="knee" /> Knee</label><br />
                <label><input type="checkbox" value="belowKnee" /> Below knee</label><br />
                <label><input type="checkbox" value="calf" /> At calf</label><br />
                <label><input type="checkbox" value="ankle" /> Ankle</label><br />
                <label><input type="checkbox" value="floor" /> Floor</label><br />
              </>
            )}

            {step === 4 && (
              <>
                <label className="block mb-2 font-semibold">Color:</label>
                {['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'brown', 'gray', 'denim', 'white', 'black'].map((color) => (
                  <div key={color} className="mb-1">
                    <label>
                      <input
                        type="checkbox"
                        value={color}
                        onChange={() => handleColorSelection(color)}
                        checked={selectedColors.includes(color)}
                      />{" "}
                      {color.charAt(0).toUpperCase() + color.slice(1)}
                    </label>
                    {color !== 'white' && color !== 'black' && (
                      <div className="ml-4">
                        <label>
                          <input
                            type="checkbox"
                            value={`light-${color}`}
                            onChange={() => handleColorSelection(`light-${color}`)}
                            checked={selectedColors.includes(`light-${color}`)}
                          />{" "}
                          Light {color}
                        </label>
                        <br />
                        <label>
                          <input
                            type="checkbox"
                            value={`dark-${color}`}
                            onChange={() => handleColorSelection(`dark-${color}`)}
                            checked={selectedColors.includes(`dark-${color}`)}
                          />{" "}
                          Dark {color}
                        </label>
                        <br />
                      </div>
                    )}
                  </div>
                ))}
              </>
            )}

            {formError && <p className="text-red-500 text-sm mt-4">{formError}</p>}

            <div className="flex justify-between mt-4">
              {step > 1 && (
                <button
                  type="button"
                  onClick={handlePrevious}
                  className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                >
                  Previous
                </button>
              )}
              {step < 5 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="px-4 py-2 bg-[#4D5D53] text-[#D0F0C0] font-semibold rounded-lg shadow-md hover:bg-[#6ea190] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#88c9a7]"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-4 py-2 bg-[#4D5D53] text-[#D0F0C0] font-semibold rounded-lg shadow-md hover:bg-[#6ea190] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#88c9a7]"
                >
                  Submit
                </button>
              )}
            </div>
          </form>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 px-3 py-1 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
        >
          Close
        </button>
      </div>
    </div>
  );
}
