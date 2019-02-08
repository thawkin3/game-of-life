import React from 'react';
import loadingGif from './../loading-transparent.gif';
import './../stylesheets/Loading.css';

const Loading = (props) => {
  return (
    <div className="Loading">
      <h3>Loading...</h3>
      <img src={loadingGif} alt="Loading..." title="Loading..." className="loadingGif" />
    </div>
  );
}

export default Loading;
