// @flow
import React from "react";
import classNames from "classnames";
import PluginService from "ory-editor-core-hubside/lib/service/plugin";
import { editable as reducer } from "ory-editor-core-hubside/lib/reducer/editable";
import type { Cell, Row } from "ory-editor-core-hubside/lib/types/editable";

// if classNames is set, default size is for md devices, the rest of devices is classNames responsibility
const gridClass = (size: number = 12, classNames: ?string = null): string =>
  classNames
    ? classNames.replace("<size>", size.toString())
    : `ory-cell-sm-${size} ory-cell-xs-12`;

const HTMLRow = ({
  cells = [],
  className,
  hasInlineChildren,
  classNames = null,
  style
}: Row) => (
  <div
    className={classNames("ory-row", className, {
      "ory-row-has-floating-children": hasInlineChildren,
      classNames: Boolean(classNames)
    })}
    style={style}
  >
    {cells.map((c: Cell) => <HTMLCell key={c.id} {...c} />)}
  </div>
);

// eslint-disable-next-line no-empty-function
const noop = () => {};

const HTMLCell = (props: Cell) => {
  const {
    rows = [],
    layout = {},
    content = {},
    hasInlineNeighbour,
    inline,
    size,
    classNames: gridClassNames,
    style
  } = props;
  const cn = classNames("ory-cell", gridClass(size, gridClassNames), {
    "ory-cell-has-inline-neighbour": hasInlineNeighbour,
    [`ory-cell-inline-${inline || ""}`]: inline
  });

  if (layout.plugin) {
    const { state, plugin: { Component } } = layout;

    return (
      <div className={cn} style={style}>
        <div className="ory-cell-inner">
          <Component isPreviewMode readOnly state={state} onChange={noop}>
            {rows.map((r: Row) => (
              <HTMLRow key={r.id} {...r} className="ory-cell-inner" />
            ))}
          </Component>
        </div>
      </div>
    );
  } else if (content.plugin) {
    const { state, plugin: { Component, StaticComponent } } = content;
    const Renderer = StaticComponent || Component;

    return (
      <div className={cn} style={style}>
        <div className="ory-cell-inner ory-cell-leaf">
          <Renderer isPreviewMode readOnly state={state} onChange={noop} />
        </div>
      </div>
    );
  } else if (rows.length > 0) {
    return (
      <div className={cn} style={style}>
        {rows.map((r: Row) => (
          <HTMLRow key={r.id} {...r} className="ory-cell-inner" />
        ))}
      </div>
    );
  }

  return (
    <div className={cn} style={style}>
      <div className="ory-cell-inner" />
    </div>
  );
};

export const HTMLRenderer = ({
  state,
  plugins
}: {
  state: any,
  plugins: { layout: [], content: [] }
}) => {
  const service = new PluginService(plugins);
  const props = reducer(service.unserialize(state), { type: "renderer/noop" });

  return <HTMLRow {...props} />;
};
