import React, { useState } from "react";
import Tooltip from "./Tooltip";


export default function CardImage( { data }) {
  const { card, sizing } = data;

  const [imageLoaded, setImageLoaded] = useState(false);
    
  const placeholderImage = "/images/Lazy-Load-MTG.jpg";	

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const imageErrorHandler = (event) => {
    console.log(`could not get ${event.target.src}`);
    event.target.src = '/images/Image_Not_Found.jpg';
    setImageLoaded(true);
  }

  return (
    <>
    {!imageLoaded && (
      <img
        className={`card-image-${sizing} pulsating-placeholder`}
        src={placeholderImage}
        alt="Loading..."
      />
      )}
      <img
        className={`card-image-${sizing} wiggle-image`}
        src={`https://beaverlicious.com/images/${card.id}.jpg`}
        alt={card.name}
        loading="lazy"
        onLoad={handleImageLoad}
        onError={imageErrorHandler}
        style={{ opacity: imageLoaded ? 1 : 0, transition: "opacity 0.3s" }}
      />
    </>
  )
}