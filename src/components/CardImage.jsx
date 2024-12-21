import React, { useState } from "react";
import { useLoaderData } from "react-router-dom";


export default function CardImage( { card }) {
  const [imageLoaded, setImageLoaded] = useState(false);
    
  const placeholderImage = "/images/Lazy-Load-MTG.jpg";	

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const imageErrorHandler = (event) => {
    event.target.src = '/images/Image_Not_Found.jpg';
    setImageLoaded(true);
  }

  return (
    <>
    {!imageLoaded && (
      <img
        className="card-image-medium pulsating-placeholder"
        src={placeholderImage}
        alt="Loading..."
      />
      )}
      <img
        className="card-image-medium"
        src={card.image_url}
        alt={card.name}
        loading="lazy"
        onLoad={handleImageLoad}
        onError={imageErrorHandler}
        style={{ opacity: imageLoaded ? 1 : 0, transition: "opacity 0.3s" }}
      />
    </>
  )
}