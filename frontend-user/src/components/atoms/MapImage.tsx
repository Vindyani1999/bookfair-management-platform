import type { CSSProperties } from "react";
import type { Props } from "../../utils/types";

export default function Image(props: Props) {
  const { src, alt, style, ...rest } = props;
  // Avoid forcing inline width/height defaults so stylesheet rules (e.g. map canvas) can
  // control sizing via CSS (object-fit: contain). Apply inline style only when provided.
  const imgStyle: CSSProperties | undefined = style as
    | CSSProperties
    | undefined;

  return <img src={src} alt={alt} style={imgStyle} {...rest} />;
}
