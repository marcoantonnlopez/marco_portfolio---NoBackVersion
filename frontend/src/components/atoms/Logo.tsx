import Image from "next/image";

export function Logo() {
  return (
    <Image
      src="https://cdn.jsdelivr.net/gh/marcoantonnlopez/portfolioContent@master/pages/logo.svg"
      alt="Mi Logo"
      width={48}
      height={48}
      priority
    />
  );
}
