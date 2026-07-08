import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layouts/MainLayouts";
import Recommendation from "./pages/Recommendation";
import Home from "./pages/Home";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import AuthLayout from "./components/layouts/AuthLayout";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
// import ProtectedRoute from "./routes/ProtectedRoute";
import AdminLayout from "./components/layouts/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import BrandIndex from "./pages/admin/brands/BrandIndex";
import AddBrand from "./pages/admin/brands/AddBrand";
import EditBrand from "./pages/admin/brands/EditBrand";
import ProductIndex from "./pages/admin/products/ProductIndex";
import AddProduct from "./pages/admin/products/AddProduct";
import EditProduct from "./pages/admin/products/EditProduct";
import StoreIndex from "./pages/admin/stores/StoreIndex";
import AddStore from "./pages/admin/stores/AddStore";
import EditStore from "./pages/admin/stores/EditStore";
import ProductStoreIndex from "./pages/admin/productstores/ProductStoreIndex";
import AddStock from "./pages/admin/productstores/AddStock";
import EditStock from "./pages/admin/productstores/EditStock";
import CriteriaIndex from "./pages/admin/criterias/CriteriaIndex";
import AddCriteria from "./pages/admin/criterias/AddCriteria";
import EditCriteria from "./pages/admin/criterias/EditCriteria";
import SubCriteriaIndex from "./pages/admin/subcriterias/SubCriteriaIndex";
import AddSubCriteria from "./pages/admin/subcriterias/AddSubCriteria";
import ProductWeightIndex from "./pages/admin/productweights/ProductWeightIndex";
import AddProductWeight from "./pages/admin/productweights/AddProductWeight";
import EditProductWeight from "./pages/admin/productweights/EditProductWeight";
import ReqHistory from "./pages/admin/recommendations/ReqHistory";
import ResultDetail from "./pages/admin/recommendations/ResultDetail";
import UserIndex from "./pages/admin/users/UserIndex";
import AddUser from "./pages/admin/users/AddUser";
import EditUser from "./pages/admin/users/EditUser";
import ManageAccess from "./pages/admin/userstores/ManageAccess";
import ProductDetail from "./pages/ProductDetail";
import Marketplace from "./pages/Marketplace";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>

          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/rekomendasi" element={<Recommendation />} />
            <Route path="/product/:id"element={<ProductDetail />}/>
            <Route path="/toko/:id" element={<Marketplace />} />
          </Route>
          

          <Route element={<AuthLayout />}>
            <Route path='/login' element={<Login />} />
            <Route path='/register' element={<Register />} />
          </Route>

          {/* <Route element={<ProtectedRoute />}> */}
            <Route path="/admin" element={<AdminLayout />}>

              <Route index element={<AdminDashboard />} />

              <Route path="brands">
                <Route index element={<BrandIndex />} />
                <Route path="add" element={<AddBrand />} />
                <Route path="edit/:id" element={<EditBrand />} />
              </Route>

              <Route path="products">
                <Route index element={<ProductIndex />} />
                <Route path="add" element={<AddProduct />} />
                <Route path="edit/:id" element={<EditProduct />} />
              </Route>

              <Route path="stores">
                <Route index element={<StoreIndex />} />
                <Route path="add" element={<AddStore />} />
                <Route path="edit/:id" element={<EditStore />} />
              </Route>

              <Route path="productstores">
                <Route index element={<ProductStoreIndex />} />
                <Route path="add" element={<AddStock />} />
                <Route path="edit/:id" element={<EditStock />} />
              </Route>

              <Route path="criterias">
                <Route index element={<CriteriaIndex />} />
                <Route path="add" element={<AddCriteria />} />
                <Route path="edit/:id" element={<EditCriteria />} />
              </Route>

              <Route path="subcriterias">
                <Route index element={<SubCriteriaIndex />} />
                <Route path="add" element={<AddSubCriteria />} />
              </Route>

              <Route path="productweights">
                <Route index element={<ProductWeightIndex />} />
                <Route path="add" element={<AddProductWeight />} />
                <Route path="edit/:id" element={<EditProductWeight />} />
              </Route>

              <Route path="recommendations">
                <Route index element={<ReqHistory />} />
                <Route path=":id" element={<ResultDetail />} />
              </Route>

              <Route path="users">
                <Route index element={<UserIndex />} />
                <Route path="add" element={<AddUser />} />
                <Route path="edit/:id" element={<EditUser />} />
              </Route>

              <Route path="user-stores" element={<ManageAccess />} />

          </Route>

        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;