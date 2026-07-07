import { Suspense } from "react";
import ProjectPdfContent from "./component/ProjectPdfContent";

export const metadata = {
  title: "advators-project-pdf",
};

const Page = () => {
  return (
    <Suspense fallback={<div>Loading project dealer...</div>}>
      <ProjectPdfContent />
    </Suspense>
  );
};

export default Page;