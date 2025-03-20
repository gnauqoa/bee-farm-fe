import { useTable } from "@refinedev/antd";
import { Table, Space, Tag, Input, Select } from "antd";
import { useState } from "react";
import { IDevice } from "../../interfaces/device";

export const DeviceList = () => {
  const { tableProps, searchFormProps } = useTable<IDevice>({
    resource: "devices",
    initialSorter: [
      {
        field: "createdAt",
        order: "desc",
      },
    ],
    syncWithLocation: true,
  });

  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Lọc dữ liệu dựa trên tìm kiếm & trạng thái
  const filteredData = tableProps.dataSource?.filter((device) => {
    const matchesSearch = device.name
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesStatus = statusFilter ? device.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      {/* Thanh tìm kiếm & bộ lọc */}
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Search by name..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          allowClear
        />
        <Select
          placeholder="Filter by status"
          value={statusFilter}
          onChange={(value) => setStatusFilter(value)}
          allowClear
          style={{ width: 150 }}
        >
          <Select.Option value="online">Online</Select.Option>
          <Select.Option value="offline">Offline</Select.Option>
        </Select>
      </Space>

      <Table {...tableProps} dataSource={filteredData} rowKey="id">
        <Table.Column title="ID" dataIndex="id" key="id" width={60} />
        <Table.Column title="Name" dataIndex="name" key="name" />
        <Table.Column
          title="Status"
          dataIndex="status"
          key="status"
          render={(status: string) => (
            <Tag color={status === "online" ? "green" : "red"}>
              {status.toUpperCase()}
            </Tag>
          )}
        />
        <Table.Column
          render={(val) => val ?? "-"}
          title="Temperature"
          dataIndex="temp"
          key="temp"
        />
        <Table.Column
          render={(val) => val ?? "-"}
          title="Humidity"
          dataIndex="humi"
          key="humi"
        />
        <Table.Column
          render={(val) => val ?? "-"}
          title="Lux"
          dataIndex="lux"
          key="lux"
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
