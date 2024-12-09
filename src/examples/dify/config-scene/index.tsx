import type { FC } from "react";
import React from "react";
import type { IConfigFormProps } from "./config-scene-form";
import { ConfigSceneForm } from "./config-scene-form";

export const ConfigScene: FC<IConfigFormProps> = React.memo((props) => {
  return <ConfigSceneForm {...props} />;
});
