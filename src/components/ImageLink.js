import React from 'react';

function ImageLink({src, title, url}) {
  return (
    <div className="container text--center">
      <a href={url} target="_blank">
        <figure>
          <img src={src} width="640" max-width="100%"/>
          <figcaption><em>{title}</em></figcaption>
        </figure> 
      </a>
    </div>
  );
}

export default ImageLink;

