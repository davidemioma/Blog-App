import React from "react";

export const dynamic = "force-dynamic";

type Props = {
  children: React.ReactNode;
};

const Layout = ({ children }: Props) => {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      {children}
    </div>
  );
};

export default Layout;
