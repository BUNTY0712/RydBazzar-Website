import { Suspense } from "react";
import ExcelContent from "./component/ExcelContent";


export const metadata = {
  title: "advators-project-excel",
};

const Page = () => {
  return (
    <Suspense fallback={<div>Loading project...</div>}>
      <ExcelContent />
    </Suspense>
  );
};

export default Page;