import React from 'react';
import './../stylesheets/GameCell.css';

const GameCell = (props) => {
  return (
    <div className={"GameCell " + (props.isOn ? "on" : "off")} id={props.theId} onClick={() => props.modifyCell(props.theId)}></div>
  );
}

export default GameCell;
