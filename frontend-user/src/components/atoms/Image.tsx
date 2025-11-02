import type { ImgHTMLAttributes, CSSProperties } from 'react';

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
};

export default function Image(props: Props) {
  const { src, alt, style, ...rest } = props;
  const imgStyle: CSSProperties = {
    maxWidth: '100%',
    height: 'auto',
    ...(style as CSSProperties),
  };

  return <img src={src} alt={alt} style={imgStyle} {...rest} />;
}
