import { Card, Flex, Switch, Typography } from "antd";
import { useState } from "react";

const { Title } = Typography;

export const SwitchCard = ({
  title,
  onChange,
  value,
  defaultChecked = false,
}: {
  title: string;
  onChange?: (checked: boolean) => void;
  value: boolean;
  defaultChecked?: boolean;
}) => {
  const handleToggle = (checked: boolean) => {
    if (onChange) onChange(checked);
  };

  return (
    <Card
      hoverable
      style={{
        background: value ? "#1890ff" : "#1e1e2f",
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
        <Switch
          checked={value}
          defaultChecked={defaultChecked}
          onChange={handleToggle}
        />
      </Flex>
    </Card>
  );
};
