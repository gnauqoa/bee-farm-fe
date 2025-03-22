import { useTable } from "@refinedev/antd";
import { Table, Tag, Input, Select, Button, Form } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useEffect, useState, useMemo } from "react";
import { IDevice } from "../../interfaces/device";
import { socket } from "../../providers/liveProvider";
import { CrudFilters } from "@refinedev/core";
import { DeviceStatus } from "../../interfaces/device";

const statusColors: Record<DeviceStatus, string> = {
  [DeviceStatus.Online]: "green",
  [DeviceStatus.Offline]: "red",
};

export const DeviceList = () => {
  const { tableProps, searchFormProps, tableQuery } = useTable<IDevice>({
    resource: "devices",
    syncWithLocation: true,
    onSearch: (params) => {
      const filters: CrudFilters = [];
      const { name, status } = params as any;

      if (name) {
        filters.push({
          field: "name",
          operator: "contains",
          value: name,
        });
      }

      if (status) {
        filters.push({
          field: "status",
          operator: "eq",
          value: status,
        });
      }

      return filters;
    },
    defaultSetFilterBehavior: "replace",
  });

  const [devices, setDevices] = useState<IDevice[]>([]);

  const handleDeviceUpdate = (updatedDevice: IDevice) => {
    setDevices((prevDevices) =>
      prevDevices.map((d) => (d.id === updatedDevice.id ? updatedDevice : d))
    );
  };

  useEffect(() => {
    if (!tableQuery.data?.data) return;

    const newDevices = tableQuery.data.data;
    setDevices(newDevices);

    newDevices.forEach((device: IDevice) => {
      console.log("Subscribing -", `device:${device.id}`);
      socket.on(`device:${device.id}`, handleDeviceUpdate);
    });

    return () => {
      newDevices.forEach((device: IDevice) => {
        socket.off(`device:${device.id}`, handleDeviceUpdate);
      });
    };
  }, [tableQuery.data?.data]);

  return (
    <>
      <Form
        layout="inline"
        {...searchFormProps}
        style={{ marginBottom: 16, gap: 12 }}
      >
        <Form.Item name="name">
          <Input
            placeholder="Search by name..."
            prefix={<SearchOutlined />}
            allowClear
          />
        </Form.Item>

        <Form.Item name="status">
          <Select
            placeholder="Filter by status"
            allowClear
            style={{ width: 150 }}
            options={Object.values(DeviceStatus).map((status) => ({
              label: (
                <Tag color={statusColors[status]} style={{ margin: 0 }}>
                  {String(status).charAt(0).toUpperCase() +
                    String(status).slice(1)}
                </Tag>
              ),
              value: status,
            }))}
          ></Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Search
          </Button>
        </Form.Item>
      </Form>

      <Table {...tableProps} rowKey="id">
        <Table.Column title="ID" dataIndex="id" key="id" width={60} />
        <Table.Column title="Name" dataIndex="name" key="name" />
        <Table.Column
          title="Status"
          dataIndex="status"
          key="status"
          render={(status: DeviceStatus) => (
            <Tag color={statusColors[status]} style={{ margin: 0 }}>
              {status}
            </Tag>
          )}
        />
        <Table.Column
          title="Temperature"
          dataIndex="temp"
          key="temp"
          render={(val) => val ?? "-"}
        />
        <Table.Column
          title="Humidity"
          dataIndex="humi"
          key="humi"
          render={(val) => val ?? "-"}
        />
        <Table.Column
          title="Lux"
          dataIndex="lux"
          key="lux"
          render={(val) => val ?? "-"}
        />
        <Table.Column
          title="Updated At"
          dataIndex="updatedAt"
          key="updatedAt"
          render={(date: string) => new Date(date).toLocaleString()}
        />
      </Table>
    </>
  );
};
