import Authenticate from "@/sections/Authenticate/page";
import React, { Suspense } from "react";

function page() {
  return (
    <Suspense>
      <Authenticate />;
    </Suspense>
  );
}

export default page;
