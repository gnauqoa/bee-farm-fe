import { LoginPage } from "./login";

export const Login = () => {
  return (
    <LoginPage
      title="Đăng nhập Pile School"
      formProps={{
        initialValues: { email: "admin@example.com", password: "secret" },
      }}
    />
  );
};
