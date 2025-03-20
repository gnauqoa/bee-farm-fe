import { Authenticated, Refine } from "@refinedev/core";
import { RefineKbarProvider } from "@refinedev/kbar";

import {
  ThemedLayoutV2,
  ErrorComponent,
  notificationProvider,
  ThemedTitleV2,
  ThemedSiderV2,
} from "@refinedev/antd";
import dataProvider from "@refinedev/nestjsx-crud";
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
import { UserCreate, UserEdit, UserList, UserShow } from "./pages/users";
import { API_URL } from "./constants";
import { axiosInstance } from "./utility/axios";

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
                            collapsed={collapsed}
                            icon={collapsed ? <AppLogo /> : <AppLogo />}
                            text="Bee farm"
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
                  <Route path="/users">
                    <Route index element={<UserList />} />
                    <Route path="create" element={<UserCreate />} />
                    <Route path="edit/:id" element={<UserEdit />} />
                    <Route path="show/:id" element={<UserShow />} />
                  </Route>
                  <Route path="*" element={<ErrorComponent />} />
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
