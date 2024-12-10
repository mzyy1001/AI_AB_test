import React from "react";
import NebulaScene from "../nebula/TwoParticleScene";

const Scene = () => {
    return (
      <div>
        <NebulaScene 
            percentageToCenter1={0.7} 
            transitionTime={30} 
        /> {/* 70% particles to center 1 */}
      </div>
    );
  };

export default Scene;
