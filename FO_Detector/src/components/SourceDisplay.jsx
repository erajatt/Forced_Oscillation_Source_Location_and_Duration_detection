import React from "react";
import G2Image from "../assets/Grid_images/G2.png";
import G5Image from "../assets/Grid_images/G5.png";
import G7Image from "../assets/Grid_images/G7.png";
import G22Image from "../assets/Grid_images/G22.png";
import G23Image from "../assets/Grid_images/G23.png";
import G4Image from "../assets/Grid_images/G4.png";
import G6Image from "../assets/Grid_images/G6.png";
import G14Image from "../assets/Grid_images/G14.png";
import G15Image from "../assets/Grid_images/G15.png";
import G16Image from "../assets/Grid_images/G16.png";
// import { GENERATOR_IMAGES } from "../utils/constants";

const GENERATOR_IMAGES = {
  G2: G2Image,
  G5: G5Image,
  G7: G7Image,
  G22: G22Image,
  G23: G23Image,
  G4: G4Image,
  G6: G6Image,
  G14: G14Image,
  G15: G15Image,
  G16: G16Image,
};
const SourceDisplay = ({ source }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h3 className="text-2xl font-bold text-indigo-800 mb-4">
        Source Generator: {source.predicted_source}
      </h3>
      <div className="flex justify-center">
        <img
          src={GENERATOR_IMAGES[source.predicted_source]}
          alt={`Generator ${source.predicted_source}`}
          className="object-contain w-2/3 h-auto"
        />
      </div>
    </div>
  );
};

export default SourceDisplay;
