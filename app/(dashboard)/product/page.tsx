import AllClientContent from "../all-clients/components/AllClientContent";
import AllProductContent from "./components/AllProductContent";
import AllSubCategoryContent from "./components/AllProductContent";
import AllCategoryContent from "./components/AllProductContent";

export const metadata = {
  title: "fashion-bazzar-all-categories",
};

const page = () => {
  return (
    <AllProductContent />
  )
}
export default page