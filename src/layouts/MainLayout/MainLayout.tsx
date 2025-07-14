import { ReactNode } from "react";

interface Props {
  children: ReactNode;
}

export default function MainLayout({ children }: Props) {
  return (
    <div className="flex h-screen overflow-auto w-[100vw] p-0">{children}</div>
  );
}
