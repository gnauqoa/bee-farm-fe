import { DeleteButton, EditButton, ShowButton, useTable } from "@refinedev/antd";
import { Table, Tag, Input, Select, Button, Form, Space } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useEffect, useState, useMemo } from "react";
import { IDevice, statusColors } from "../../interfaces/device";
import { socket } from "../../providers/liveProvider";
import { CrudFilters } from "@refinedev/core";
import { DeviceStatus } from "../../interfaces/device";
import { capitalize } from "../../utility/text";
import {
  HANDLE_DEVICE_DATA_CHANNEL,
  JOIN_DEVICE_ROOM_CHANNEL,
  LEAVE_DEVICE_ROOM_CHANNEL,
} from "../../constants";

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
    for (const device of newDevices) {
      socket.emit(JOIN_DEVICE_ROOM_CHANNEL, device.id);
    }
    socket.on(HANDLE_DEVICE_DATA_CHANNEL, handleDeviceUpdate);

    return () => {
      socket.off(HANDLE_DEVICE_DATA_CHANNEL, handleDeviceUpdate);
      for (const device of newDevices) {
        socket.emit(LEAVE_DEVICE_ROOM_CHANNEL, device.id);
      }
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
                  {capitalize(status)}
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

      <Table {...tableProps} dataSource={devices} rowKey="id">
        <Table.Column title="ID" dataIndex="id" key="id" width={60} />
        <Table.Column title="Name" dataIndex="name" key="name" />
        <Table.Column
          title="Status"
          dataIndex="status"
          key="status"
          render={(status: DeviceStatus) => (
            <Tag color={statusColors[status]} style={{ margin: 0 }}>
              {capitalize(status)}
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
        <Table.Column
          title="Actions"
          dataIndex="actions"
          render={(_, record) => (
            <Space>
              <EditButton hideText size="small" recordItemId={record.id} />
              <ShowButton hideText size="small" recordItemId={record.id} />
              <DeleteButton hideText size="small" recordItemId={record.id} />
            </Space>
          )}
        />
      </Table>
    </>
  );
};
