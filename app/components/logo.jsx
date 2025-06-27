import React from "react";
import Image from "next/image";

const CircularImage = ({ src, alt }) => {
  return (
    <div
      style={{
        position: "absolute",
        top: "22%",
        margin: "auto",
        borderRadius: "50%",
      }}
    >
      <Image
    
       width={100}
       height={100}
        src={src}
        alt={alt}
        style={{
          objectFit: "contain",
          borderRadius: "50%",
        }}
      />
    </div>
  );
};

export default CircularImage;