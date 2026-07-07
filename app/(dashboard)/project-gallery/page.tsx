import { Suspense } from "react";
import ProjectGalleryConent from "./component/ProjectGalleryConent";


export const metadata = {
  title: "advators-project-gallery",
};

const Page = () => {
  return (
    <Suspense fallback={<div>Loading project dealer...</div>}>
      <ProjectGalleryConent />
    </Suspense>
  );
};

export default Page;