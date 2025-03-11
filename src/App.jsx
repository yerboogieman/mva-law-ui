import {Provider} from "react-redux";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import RootAppContainer from "./components/RootAppContainer.jsx";
import WorkflowContainer from "./components/WorkflowContainer.jsx";
import LanguageProvider from "./contexts/LanguageContext";
import Businesses from "./pages/Businesses/Businesses";
import ClientList from "./pages/ClientList/ClientList";
import EnrollBusiness from "./pages/EnrollBusiness/EnrollBusiness";

import Login from "./pages/Login/Login.jsx";
import NotAuthorized from "./pages/NotAuthorized/NotAuthorized";
import ResetPassword from "./pages/ResetPassword/ResetPassword.jsx";
import SignUp from "./pages/SignUp/SignUp";
import Tasks from "./pages/Tasks/Tasks";
import TestPage from "./pages/TestPage/TestPage";
import UsersList from "./pages/UsersList/UsersList";
import WorkflowManager from "./pages/WorkflowManager/WorkflowManager";

import store from "./redux/store";
import ProtectedRoute from "./routes/ProtectedRoute.jsx";

export default function App() {

   return (
      <Provider store={store}>
         <LanguageProvider>
            <BrowserRouter>
               <Routes>
                  <Route path="/login" element={<Login/>}/>
                  <Route path="/signup" element={<SignUp/>}/>
                  <Route path="/reset-password" element={<ResetPassword/>}/>
                  <Route path="/enroll-business" element={<EnrollBusiness></EnrollBusiness>}/>

                  <Route path="/test-page" element={
                     <ProtectedRoute allowedRoles={[
                        "ROLE_USER",
                        "ROLE_ADMIN"
                     ]}>
                        <RootAppContainer>
                           <TestPage/>
                        </RootAppContainer>
                     </ProtectedRoute>
                  }/>

                  <Route path="/clients" element={
                     <ProtectedRoute allowedRoles={[
                        "ROLE_USER",
                        "ROLE_ADMIN"
                     ]}>
                        <RootAppContainer>
                           <ClientList/>
                        </RootAppContainer>
                     </ProtectedRoute>
                  }/>

                  <Route path="/users" element={
                     <ProtectedRoute allowedRoles={[
                        "ROLE_USER",
                        "ROLE_ADMIN"
                     ]}>
                        <RootAppContainer>
                           <UsersList/>
                        </RootAppContainer>
                     </ProtectedRoute>
                  }/>

                  <Route path="/job-list" element={
                     <ProtectedRoute allowedRoles={[
                        "ROLE_USER",
                        "ROLE_CLIENT",
                        "ROLE_ADMIN"
                     ]}>
                        <RootAppContainer>
                           <Tasks/>
                        </RootAppContainer>
                     </ProtectedRoute>
                  }/>

                  <Route path="/workflow-manager" element={
                     <ProtectedRoute allowedRoles={[
                        "ROLE_USER",
                        "ROLE_CLIENT",
                        "ROLE_ADMIN"
                     ]}>
                        <WorkflowContainer>
                           <WorkflowManager/>
                        </WorkflowContainer>
                     </ProtectedRoute>
                  }/>
                  <Route path="/businesses" element={
                     <ProtectedRoute allowedRoles={["ROLE_ADMIN"]}>
                        <RootAppContainer>
                           <Businesses/>
                        </RootAppContainer>
                     </ProtectedRoute>
                  }/>

                  <Route path="/not-authorized" element={<NotAuthorized/>}/>

                  <Route path="/" element={
                     <ProtectedRoute allowedRoles={[
                        "ROLE_USER",
                        "ROLE_ADMIN"
                     ]}>
                        <RootAppContainer/>
                     </ProtectedRoute>}/>
               </Routes>
            </BrowserRouter>
         </LanguageProvider>
      </Provider>
   );
}
