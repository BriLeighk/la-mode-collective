import { useState, useEffect } from 'react';
import { getStorage, ref, uploadString, getDownloadURL } from "firebase/storage";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import axios from 'axios';

export default function OutfitModal({ isVisible, onClose, onUpload }) {
  const [category, setCategory] = useState('');
  const [subType, setSubType] = useState('');
  const [selectedColors, setSelectedColors] = useState([]);
  const [pantsType, setPantsType] = useState('');
  const [image, setImage] = useState(null);
  const [formError, setFormError] = useState('');
  const [step, setStep] = useState(1);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    if (formError) {
      setShowError(true);
      const timer = setTimeout(() => {
        setShowError(false);
      }, 3000); // Error message will fade after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [formError]);

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
    if (step === 3 && category === "bottom" && subType === "pants" && !pantsType) {
      setFormError("Please select a type of pants.");
      return;
    }
    if (step === 3 && category === "dress" && !subType) {
      setFormError("Please select a length of dress.");
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
      onUpload();
    } catch (error) {
      console.error("Error uploading image or storing data:", error);
      setFormError('Failed to upload image or store data.');
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#D0D0D0] text-[#4D5D53] rounded-lg w-full max-w-md shadow-lg p-6 flex flex-col justify-between relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 px-3 py-1 text-[#4D5D53] font-bold rounded-lg hover:text-[#6ea190]"
        >
          X
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center">Add New Item To Closet</h2>

        <div className="h-96 overflow-y-auto p-6 bg-[#D0D0D0] rounded-lg shadow-inner flex-grow">
          <form className="space-y-8">
            {step === 1 && (
              <div className="mb-6 text-center">
                <label className="block font-semibold mb-3">Upload Image:</label>
                <p className="text-sm text-gray-600 mb-4">Capture your style! Ensure the image is taken against a plain light-colored background for best results.</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-[#4D5D53] bg-[#D0D0D0] p-3 rounded border border-gray-300"
                />
                {image && (
                  <div className="mt-5">
                    <img
                      src={image}
                      alt="Uploaded Outfit"
                      className="w-64 h-64 object-cover rounded-sm shadow-sm mx-auto border-2 border-[#4D5D53]"
                    />
                  </div>
                )}
              </div>
            )}

            {step === 2 && (
              <div className="text-center">
                <label className="block mb-3 font-semibold">Category:</label>
                <p className="text-sm text-gray-600 mb-4">Select the category that best describes your item. This helps in organizing your closet efficiently.</p>
                <select
                  className="w-full mb-6 p-3 rounded bg-[#4D5D53] text-[#D0F0C0]"
                  value={category}
                  onChange={handleCategoryChange}
                >
                  <option value="">Select Category</option>
                  <option value="top">Top</option>
                  <option value="bottom">Bottom</option>
                  <option value="dress">Dress</option>
                </select>
              </div>
            )}

            {step === 3 && category === "top" && (
              <div className="text-left">
                <label className="block mb-3 font-semibold">Type of Top:</label>
                <p className="text-sm text-gray-600 mb-4">Refine your selection by specifying the type of top. This adds more detail to your closet.</p>
                <select className="w-full mb-6 p-3 rounded bg-[#4D5D53] text-[#D0F0C0]" value={subType} onChange={handleSubTypeChange}>
                  <option value="">Select Type</option>
                  <option value="shirt">Shirt</option>
                  <option value="sweater">Sweater</option>
                  <option value="hoodie">Hoodie</option>
                  <option value="jacket">Jacket</option>
                </select>
                {subType === "shirt" && (
                  <>
                    <label className="block mb-2 font-semibold">Sleeve Length:</label>
                    <div className="ml-4">
                      <label><input type="checkbox" value="sleeveless" /> Sleeveless/Tube</label><br />
                      <label><input type="checkbox" value="spaghetti" /> Spaghetti</label><br />
                      <label><input type="checkbox" value="tank" /> Tank</label><br />
                      <label><input type="checkbox" value="short" /> Short</label><br />
                      <label><input type="checkbox" value="half" /> Half</label><br />
                      <label><input type="checkbox" value="3/4" /> 3/4</label><br />
                      <label><input type="checkbox" value="full" /> Full</label><br />
                    </div>

                    <label className="block mb-2 font-semibold">Material:</label>
                    <div className="ml-4">
                      <label><input type="checkbox" value="cotton" /> Cotton</label><br />
                      <label><input type="checkbox" value="lace" /> Lace</label><br />
                      <label><input type="checkbox" value="silk" /> Silk</label><br />
                      <label><input type="checkbox" value="linen" /> Linen</label><br />
                    </div>
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
              </div>
            )}

            {step === 3 && category === "bottom" && (
              <>
                <div className="text-center">
                  <label className="block mb-3 font-semibold">Type of Bottom:</label>
                  <p className="text-sm text-gray-600 mb-4">Select the type of bottom that best describes your item. This helps in organizing your closet efficiently.</p>
                </div>
                <select className="w-full mb-4 p-2 rounded bg-[#4D5D53] text-[#D0F0C0]" value={subType} onChange={handleSubTypeChange}>
                  <option value="">Select Type</option>
                  <option value="pants">Pants</option>
                  <option value="skirts">Skirts</option>
                </select>
                {subType === "pants" && (
                  <>
                    <div className="text-left">
                      <label className="block mb-3 font-semibold">Length:</label>
                      <p className="text-sm text-gray-600 mb-4">Choose the length that best represents your pants.</p>
                    </div>
                    <div className="space-y-1">
                      <label><input type="checkbox" value="short" /> Shorts</label><br />
                      <label><input type="checkbox" value="knee" /> Knee length</label><br />
                      <label><input type="checkbox" value="3/4" /> 3/4 length</label><br />
                      <label><input type="checkbox" value="full" /> Full length</label><br />
                    </div>

                    <div className="text-left">
                      <label className="block mb-3 font-semibold">Rise:</label>
                      <p className="text-sm text-gray-600 mb-4">Select the rise that best describes your pants.</p>
                    </div>
                    <div className="space-y-1">
                      <label><input type="checkbox" value="high" /> High</label><br />
                      <label><input type="checkbox" value="normal" /> Normal</label><br />
                      <label><input type="checkbox" value="low" /> Low</label><br />
                    </div>

                    <div className="text-left">
                      <label className="block mb-3 font-semibold">Type of Pants:</label>
                      <p className="text-sm text-gray-600 mb-4">Choose the type of pants that best represents your item.</p>
                    </div>
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
                        <div className="text-left">
                          <label className="block mb-3 font-semibold">Fit of Jeans:</label>
                          <p className="text-sm text-gray-600 mb-4">Select the fit that best describes your jeans.</p>
                        </div>
                        <div className="space-y-1">
                          <label><input type="checkbox" value="straight" /> Straight/normal</label><br />
                          <label><input type="checkbox" value="flare" /> Flare/bootcut</label><br />
                          <label><input type="checkbox" value="baggy" /> Baggy</label><br />
                        </div>
                      </>
                    )}
                  </>
                )}
                {subType === "skirts" && (
                  <>
                    <div className="text-center">
                      <label className="block mb-3 font-semibold">Length of Skirt:</label>
                      <p className="text-sm text-gray-600 mb-4">Select the length that best describes your skirt.</p>
                    </div>
                    <div className="space-y-1">
                      <label><input type="checkbox" value="mini" /> Mini</label><br />
                      <label><input type="checkbox" value="short" /> Short</label><br />
                      <label><input type="checkbox" value="aboveKnee" /> Above knee</label><br />
                      <label><input type="checkbox" value="knee" /> Knee</label><br />
                      <label><input type="checkbox" value="belowKnee" /> Below knee</label><br />
                      <label><input type="checkbox" value="calf" /> At calf</label><br />
                      <label><input type="checkbox" value="ankle" /> Ankle</label><br />
                      <label><input type="checkbox" value="floor" /> Floor</label><br />
                    </div>
                  </>
                )}
              </>
            )}

            {step === 3 && category === "dress" && (
              <>
                <div className="text-center">
                  <label className="block mb-3 font-semibold">Length of Dress:</label>
                  <p className="text-sm text-gray-600 mb-4">Select the length that best describes your dress. This helps in organizing your closet efficiently.</p>
                </div>
                <div className="space-y-1">
                  <label><input type="checkbox" value="mini" /> Mini</label><br />
                  <label><input type="checkbox" value="short" /> Short</label><br />
                  <label><input type="checkbox" value="aboveKnee" /> Above knee</label><br />
                  <label><input type="checkbox" value="knee" /> Knee</label><br />
                  <label><input type="checkbox" value="belowKnee" /> Below knee</label><br />
                  <label><input type="checkbox" value="calf" /> At calf</label><br />
                  <label><input type="checkbox" value="ankle" /> Ankle</label><br />
                  <label><input type="checkbox" value="floor" /> Floor</label><br />
                </div>
              </>
            )}

            {step === 4 && (
              <>
                <div className="text-center">
                  <label className="block mb-3 font-semibold">Color:</label>
                  <p className="text-sm text-gray-600 mb-4">Choose the colors that best represent your item. You can select multiple shades for a more detailed description.</p>
                </div>
                <div className="space-y-1">
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
                </div>
              </>
            )}

            {formError && showError && (
              <p className="text-red-500 text-sm mt-6 text-center transition-opacity duration-500 ease-in-out opacity-100">
                {formError}
              </p>
            )}
          </form>
        </div>

        <div className="flex justify-between mt-6">
          {step > 1 && (
            <button
              type="button"
              onClick={handlePrevious}
              className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg shadow-md hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
            >
              Previous
            </button>
          )}
          <div className="flex-grow"></div>
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
      </div>
    </div>
  );
}
