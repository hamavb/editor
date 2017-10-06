// @flow
import React from "react";
import classNames from "classnames";

import Cell from "../Cell";
import type { ComponetizedRow } from "../../types/editable";

const Inner = ({
  editable,
  ancestors,
  node: { id, hover, cells = [], hasInlineChildren, classNames, style },
  containerHeight,
  blurAllCells,
  containerWidth
}: ComponetizedRow) => (
  <div
    className={classNames("ory-row", {
      "ory-row-is-hovering-this": Boolean(hover),
      [`ory-row-is-hovering-${hover || ""}`]: Boolean(hover),
      "ory-row-has-floating-children": hasInlineChildren,
      classNames: Boolean(classNames)
    })}
    onClick={blurAllCells}
    style={style}
  >
    {cells.map((c: string) => (
      <Cell
        rowWidth={containerWidth}
        rowHeight={containerHeight}
        ancestors={[...ancestors, id]}
        editable={editable}
        key={c}
        id={c}
      />
    ))}
  </div>
);

export default Inner;
