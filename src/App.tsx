import { Authenticated, Refine } from "@refinedev/core";
import { RefineKbarProvider } from "@refinedev/kbar";

import {
  ThemedLayoutV2,
  ErrorComponent,
  notificationProvider,
  ThemedTitleV2,
  ThemedSiderV2,
} from "@refinedev/antd";
import dataProvider, { axiosInstance } from "@refinedev/nestjsx-crud";
import { NavigateToResource, CatchAllNavigate } from "@refinedev/react-router";
import { BrowserRouter, Routes, Route, Outlet } from "react-router";
import { TeamOutlined } from "@ant-design/icons";
import { ConfigProvider } from "antd";
import "@refinedev/antd/dist/reset.css";
import { Login } from "./pages/login";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { authProvider } from "./providers/authProvider";
import { accessControlProvider } from "./providers/accessControlProvider";
import routerBindings from "@refinedev/react-router";
import AppLogo from "./components/AppLogo";
import { Header } from "./components";
import { PostCreate, PostEdit, PostList, PostShow } from "./pages/users";
import { API_URL } from "./constants";

const App: React.FC = () => {
  return (
    <ConfigProvider locale={{ locale: "vi" }}>
      <BrowserRouter>
        <RefineKbarProvider>
          <ColorModeContextProvider>
            <Refine
              dataProvider={dataProvider(API_URL, axiosInstance)}
              routerProvider={routerBindings}
              authProvider={authProvider}
              accessControlProvider={accessControlProvider}
              notificationProvider={notificationProvider}
              options={{
                disableTelemetry: true,
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
              }}
              resources={[
                {
                  name: "users",
                  list: "/users",
                  create: "/users/create",
                  edit: "/users/edit/:id",
                  show: "/users/:id",
                  meta: {
                    canDelete: true,
                    icon: (
                      <TeamOutlined
                        style={{ fontSize: "16px", color: "#08c" }}
                      />
                    ),
                  },
                },
              ]}
            >
              <Routes>
                <Route
                  element={
                    <Authenticated
                      key="autheticated-inner"
                      fallback={<CatchAllNavigate to="/login" />}
                    >
                      <ThemedLayoutV2
                        Title={({ collapsed }) => (
                          <ThemedTitleV2
                            // collapsed is a boolean value that indicates whether the <Sidebar> is collapsed or not
                            collapsed={collapsed}
                            // Adjust to different logo when collapsed, if needed
                            icon={collapsed ? <AppLogo /> : <AppLogo />}
                            text="Pile School" // App title if needed
                          />
                        )}
                        Header={() => <Header sticky />}
                        Sider={(props) => <ThemedSiderV2 {...props} fixed />}
                      >
                        <Outlet />
                      </ThemedLayoutV2>
                    </Authenticated>
                  }
                >
                  <Route path="*" element={<ErrorComponent />} />
                </Route>
                <Route path="/users">
                  <Route index element={<PostList />} />
                  <Route path="create" element={<PostCreate />} />
                  <Route path="edit/:id" element={<PostEdit />} />
                  <Route path="show/:id" element={<PostShow />} />
                </Route>
                <Route
                  element={
                    <Authenticated
                      key="authenticated-outer"
                      fallback={<Outlet />}
                    >
                      <NavigateToResource />
                    </Authenticated>
                  }
                >
                  <Route path="/login" element={<Login />} />
                </Route>
              </Routes>
            </Refine>
          </ColorModeContextProvider>
        </RefineKbarProvider>
      </BrowserRouter>
    </ConfigProvider>
  );
};

export default App;
