import { useState } from 'react';

export default function OutfitModal({ isVisible, onClose }) {
  const [category, setCategory] = useState('');
  const [subType, setSubType] = useState('');
  const [selectedColors, setSelectedColors] = useState([]);
  const [pantsType, setPantsType] = useState('');
  const [image, setImage] = useState(null);
  const [formError, setFormError] = useState('');

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setSubType('');
    setSelectedColors([]);
    setPantsType('');
  };

  const handleSubTypeChange = (e) => {
    setSubType(e.target.value);
  };

  const handlePantsTypeChange = (e) => {
    setPantsType(e.target.value);
  };

  const handleColorSelection = (color) => {
    const mainColor = color.split('-')[1] || color;

    setSelectedColors((prevColors) => {
      const colors = new Set(prevColors);

      if (color.includes('-')) colors.add(mainColor);

      colors.has(color) ? colors.delete(color) : colors.add(color);

      return Array.from(colors);
    });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    // Check if all required fields are filled
    if (!image) {
      setFormError("Please upload an image.");
      return;
    }

    if (!category) {
      setFormError("Please select a category.");
      return;
    }

    if (!subType) {
      setFormError("Please complete the type selection for the chosen category.");
      return;
    }

    if (category === "bottom" && !pantsType) {
      setFormError("Please select the type of pants for the Bottom category.");
      return;
    }

    if (selectedColors.length === 0) {
      setFormError("Please select at least one color.");
      return;
    }

    // If all fields are complete, reset the form and close modal
    setFormError(''); // Clear any error message
    setCategory('');
    setSubType('');
    setSelectedColors([]);
    setPantsType('');
    setImage(null);
    onClose();
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#D0F0C0] text-[#4D5D53] rounded-lg w-full max-w-md shadow-lg p-6">
        <h2 className="text-xl font-bold mb-4">Add New Item To Closet</h2>

        {/* Image Upload */}
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

        {/* Scrollable Content */}
        <div className="h-96 overflow-y-auto p-4 bg-[#D0F0C0] rounded-lg shadow-inner">
          <form>
            {/* Category Selection */}
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

            {/* Subtype Options Based on Category */}
            {category === "top" && (
              <>
                <label className="block mb-2 font-semibold">Type of Top:</label>
                <select className="w-full mb-4 p-2 rounded bg-[#4D5D53] text-[#D0F0C0]" value={subType} onChange={handleSubTypeChange}>
                  <option value="">Select Type</option>
                  <option value="shirt">Shirt</option>
                  <option value="sweater">Sweater</option>
                  <option value="hoodie">Hoodie</option>
                  <option value="jacket">Jacket</option>
                </select>

                {/* Conditional Options for Shirt */}
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

                {/* Conditional Options for Sweater */}
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

                {/* Conditional Options for Jacket */}
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

            {category === "bottom" && (
              <>
                <label className="block mb-2 font-semibold">Type of Bottom:</label>
                <select className="w-full mb-4 p-2 rounded bg-[#4D5D53] text-[#D0F0C0]" value={subType} onChange={handleSubTypeChange}>
                  <option value="">Select Type</option>
                  <option value="pants">Pants</option>
                  <option value="skirts">Skirts</option>
                </select>

                {/* Conditional Options for Pants */}
                {subType === "pants" && (
                  <>
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

                    {/* Jeans-specific Options */}
                    {pantsType === "jeans" && (
                      <>
                        <label className="block mb-2 font-semibold">Fit of Jeans:</label>
                        <label><input type="checkbox" value="straight" /> Straight/normal</label><br />
                        <label><input type="checkbox" value="flare" /> Flare/bootcut</label><br />
                        <label><input type="checkbox" value="baggy" /> Baggy</label><br />
                      </>
                    )}

                    <label className="block mb-2 font-semibold">Length:</label>
                    <label><input type="checkbox" value="short" /> Shorts</label><br />
                    <label><input type="checkbox" value="knee" /> Knee length</label><br />
                    <label><input type="checkbox" value="3/4" /> 3/4 length</label><br />
                    <label><input type="checkbox" value="full" /> Full length</label><br />

                    <label className="block mb-2 font-semibold">Rise:</label>
                    <label><input type="checkbox" value="high" /> High</label><br />
                    <label><input type="checkbox" value="normal" /> Normal</label><br />
                    <label><input type="checkbox" value="low" /> Low</label><br />
                  </>
                )}

                {/* Conditional Options for Skirts */}
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

            {/* Dress Length and Sleeve Options */}
            {category === "dress" && (
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

                <label className="block mb-2 font-semibold">Sleeve Length:</label>
                <label><input type="checkbox" value="sleeveless" /> Sleeveless</label><br />
                <label><input type="checkbox" value="spaghetti" /> Spaghetti</label><br />
                <label><input type="checkbox" value="tank" /> Tank</label><br />
                <label><input type="checkbox" value="short" /> Short</label><br />
                <label><input type="checkbox" value="half" /> Half</label><br />
                <label><input type="checkbox" value="3/4" /> 3/4</label><br />
                <label><input type="checkbox" value="full" /> Full</label><br />
              </>
            )}

            {/* Color Selection with Checkboxes */}
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

            {formError && <p className="text-red-500 text-sm mt-4">{formError}</p>}

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              className="mt-4 w-full px-4 py-2 bg-[#4D5D53] text-[#D0F0C0] font-semibold rounded-lg shadow-md hover:bg-[#6ea190] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#88c9a7]"
            >
              Submit
            </button>
          </form>
        </div>

        {/* Close Button */}
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
