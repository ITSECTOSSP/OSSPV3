import { ImgHTMLAttributes } from 'react';

export default function AppLogoIcon(
  props: ImgHTMLAttributes<HTMLImageElement>
) {
  return (
    <img
      src="/iossp.png"
      alt="IOSSP Logo"
      width="100px"
      height="100px"
      {...props}
    />
  );
}
