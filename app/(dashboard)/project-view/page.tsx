import { Suspense } from "react";
import ProjectContent from "./component/ProjectContent";

export const metadata = {
   title: "advators-project-view",
};

const Page = () => {
  return (
    <Suspense fallback={<div>Loading project...</div>}>
      <ProjectContent />
    </Suspense>
  );
};

export default Page;