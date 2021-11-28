import React from 'react';

function Video({src, title}) {
  return (
    <div className="container text--center">
      <figure>
        <video controls width="640" max-width="100%">
          <source type="video/mp4" src={require('/img/' + src).default}/>
        </video>
        <figcaption><em>{title}</em></figcaption>
      </figure> 
    </div>
  );
}

export default Video;

