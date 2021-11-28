import React from 'react';

function Image({src, title}) {
  return (
    <div className="container text--center">
     <figure>
       <img src={require('/img/' + src).default} width="640" max-width="100%"/>
       <figcaption><em>{title}</em></figcaption>
     </figure> 
    </div>
  );
}

export default Image;

