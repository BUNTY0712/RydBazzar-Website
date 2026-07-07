import { Suspense } from "react";
import ProjectDealerContent from "./component/ProjectDealerContent";

export const metadata = {
  title: "advators-project-dealer",
};

const Page = () => {
  return (
    <Suspense fallback={<div>Loading project dealer...</div>}>
      <ProjectDealerContent />
    </Suspense>
  );
};

export default Page;