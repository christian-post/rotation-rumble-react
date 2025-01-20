import React, { useState } from "react";


export default function CardImage( { props }) {

  const handleClick = (e) => {
    if (props.onClick) {
      props.onClick(e);
    }
  };

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
        className={`card-image-${props.sizing} pulsating-placeholder`}
        src={placeholderImage}
        alt="Loading..."
        style={props.customStyle}
      />
      )}
      <img
        className={props.className || `card-image-${props.sizing} wiggle-image`}
        src={`https://beaverlicious.com/images/${props.card.id}.jpg`}
        alt={props.card.name}
        loading="lazy"
        onClick={handleClick}
        onLoad={handleImageLoad}
        onError={imageErrorHandler}
        style={{ 
          ...props.customStyle, 
          opacity: imageLoaded ? 1 : 0, 
          transition: "opacity 0.3s" 
        }}
      />
    </>
  )
}