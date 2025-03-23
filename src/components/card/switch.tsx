import { Card, Flex, Switch, Typography } from "antd";
import { useState } from "react";

const { Title } = Typography;

export const SwitchCard = ({
  title,
  onChange,
  defaultChecked = false,
}: {
  title: string;
  onChange?: (checked: boolean) => void;
  defaultChecked?: boolean;
}) => {
  const [isOn, setIsOn] = useState(defaultChecked);

  const handleToggle = (checked: boolean) => {
    setIsOn(checked);
    if (onChange) onChange(checked);
  };

  return (
    <Card
      hoverable
      style={{
        background: isOn ? "#1890ff" : "#1e1e2f",
        color: "white",
        borderRadius: "12px",
        transition:
          "transform 0.3s ease, box-shadow 0.3s ease, background 0.3s ease",
      }}
      bodyStyle={{ padding: "16px" }}
    >
      <Flex vertical gap={12} align="center">
        <Flex gap={12} align="center">
          <Title style={{ margin: 0, color: "white" }} level={4}>
            {title}
          </Title>
        </Flex>
        <Switch checked={isOn} onChange={handleToggle} />
      </Flex>
    </Card>
  );
};
