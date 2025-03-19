import React, { useContext } from "react";
import {
  LoginPageProps,
  LoginFormTypes,
  useActiveAuthProvider,
  useLogin,
  useTranslate,
} from "@refinedev/core";
import { ThemedTitle } from "@refinedev/antd";
import {
  containerStyles,
  layoutStyles,
  titleStyles,
} from "../../components/styles/authStyles";
import {
  Row,
  Col,
  Layout,
  Card,
  Typography,
  Form,
  Input,
  Button,
  CardProps,
  LayoutProps,
  Divider,
  FormProps,
  theme,
} from "antd";
import { ColorModeContext } from "../../contexts/color-mode";

const { Text, Title } = Typography;
const { useToken } = theme;

type LoginProps = LoginPageProps<LayoutProps, CardProps, FormProps>;
/**
 * **refine** has a default login page form which is served on `/login` route when the `authProvider` configuration is provided.
 *
 * @see {@link https://refine.dev/docs/ui-frameworks/antd/components/antd-auth-page/#login} for more details.
 */
export const LoginPage: React.FC<LoginProps> = ({
  providers,
  contentProps,
  wrapperProps,
  renderContent,
  formProps,
  title,
}) => {
  const { token } = useToken();
  const [form] = Form.useForm<LoginFormTypes>();
  const translate = useTranslate();

  const authProvider = useActiveAuthProvider();
  const { mutate: login, isLoading } = useLogin<LoginFormTypes>({
    v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
  });

  const { mode, setMode } = useContext(ColorModeContext);

  const pageTitleColor = mode === "light" ? "#000" : "#fff";

  const PageTitle =
    title === false ? null : (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "32px",
          fontSize: "32px",
          fontWeight: 700,
          color: pageTitleColor,
        }}
      >
        {title ?? <ThemedTitle collapsed={false} text={title} />}
      </div>
    );

  const CardTitle = (
    <Title
      level={3}
      style={{
        color: token.colorPrimaryTextHover,
        ...titleStyles,
      }}
    >
      Login Bee farm
    </Title>
  );

  const renderProviders = () => {
    if (providers && providers.length > 0) {
      return (
        <>
          {providers.map((provider) => {
            return (
              <Button
                key={provider.name}
                type="default"
                block
                icon={provider.icon}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  width: "100%",
                  marginBottom: "8px",
                }}
                onClick={() =>
                  login({
                    providerName: provider.name,
                  })
                }
              >
                {provider.label}
              </Button>
            );
          })}
          <Divider>
            <Text
              style={{
                color: token.colorTextLabel,
              }}
            >
              {translate("pages.login.divider", "or")}
            </Text>
          </Divider>
        </>
      );
    }
    return null;
  };

  const CardContent = (
    <Card
      title={CardTitle}
      style={{
        ...containerStyles,
        backgroundColor: token.colorBgElevated,
      }}
      {...(contentProps ?? {})}
    >
      {renderProviders()}
      <Form<LoginFormTypes>
        layout="vertical"
        form={form}
        onFinish={(values) => login(values)}
        requiredMark={false}
        initialValues={{
          remember: false,
        }}
        {...formProps}
      >
        <Form.Item
          name="email"
          label={translate("pages.login.fields.email", "Email")}
          rules={[
            { required: true },
            {
              type: "email",
              message: translate(
                "pages.login.errors.validEmail",
                "Invalid email address"
              ),
            },
          ]}
        >
          <Input
            size="large"
            placeholder={translate("pages.login.fields.email", "Email")}
          />
        </Form.Item>
        <Form.Item
          name="password"
          label={translate("pages.login.fields.password", "Password")}
          rules={[{ required: true }]}
        >
          <Input type="password" placeholder="●●●●●●●●" size="large" />
        </Form.Item>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "24px",
          }}
        ></div>
        <Form.Item>
          <Button
            type="primary"
            size="large"
            htmlType="submit"
            loading={isLoading}
            block
          >
            Đăng nhập
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );

  return (
    <Layout style={layoutStyles} {...(wrapperProps ?? {})}>
      <Row
        justify="center"
        align="middle"
        style={{
          height: "100vh",
        }}
      >
        <Col xs={22}>
          {renderContent ? (
            renderContent(CardContent, PageTitle)
          ) : (
            <>
              {PageTitle}
              {CardContent}
            </>
          )}
        </Col>
      </Row>
    </Layout>
  );
};
