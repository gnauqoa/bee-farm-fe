import { LoginPage } from "./login";

export const Login = () => {
  return (
    <LoginPage
      title="Đăng nhập Bee farm"
      formProps={{
        initialValues: { email: "admin@example.com", password: "secret" },
      }}
    />
  );
};
