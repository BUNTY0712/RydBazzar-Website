import { Suspense } from "react";
import DealerViewContent from "./component/DealerViewContent";

export const metadata = {
  title: "advators-dealer-view",
};

const Page = () => {
  return (
    <Suspense fallback={<div>Loading dealer data...</div>}>
      <DealerViewContent />
    </Suspense>
  );
};

export default Page;