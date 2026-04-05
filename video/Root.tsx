import React from "react";
import { Composition } from "remotion";
import { FeatureVideo } from "./scenes/FeatureVideo";

export const Root: React.FC = () => {
  return (
    <>
      <Composition
        id="FeatureVideo"
        component={FeatureVideo}
        durationInFrames={1350}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
