import { useState } from "react";
import { useForm, useSelect } from "@refinedev/antd";
import { Modal, Button, Form, Input, AutoComplete, Select } from "antd";
import { IDevice } from "../../interfaces/device";
import { IUser } from "../../interfaces/user";

// TypeScript type for the form values
type DeviceFormValues = {
  name: string;
  user_id: number | null;
  userName?: string; // Temporary field for autocomplete display
};

export const CreateDeviceModal = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { form, formProps, saveButtonProps, onFinish } = useForm<IDevice>({
    onMutationSuccess: () => setIsModalOpen(false),
  });

  const { selectProps, queryResult } = useSelect<IUser>({
    resource: "users",
    optionLabel: "fullName",
    optionValue: "id",
    pagination: { pageSize: 100 },
    filters: [],
  });

  // Transform users into AutoComplete options
  const options =
    queryResult.data?.data.map((user: IUser) => ({
      value: user.fullName,
      label: user.fullName,
      userId: user.id,
    })) || [];

  // Handle selection from autocomplete
  const onSelect = (value: string, option: { userId: number }) => {
    form.setFieldsValue({ user_id: option.userId }); // Set hidden user_id field
  };

  // Handle search input (filter options client-side)
  const onSearch = (value: string) => {
    if (!value) {
      form.setFieldsValue({ user_id: null }); // Clear user_id if search is empty
    }
  };

  // Handle form submission
  const onSubmit = (values: any) => {
    const { userName, ...rest } = values; // Remove userName from submission
    onFinish({
      ...rest,
      user_id: values.user_id || null,
    });
  };

  return (
    <>
      {/* Button to open modal */}
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        Create Device
      </Button>

      {/* Modal Form */}
      <Modal
        title="Create Device"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button key="cancel" onClick={() => setIsModalOpen(false)}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" {...saveButtonProps}>
            Create
          </Button>,
        ]}
      >
        <Form
          {...formProps}
          form={form}
          layout="vertical"
          initialValues={{
            name: "",
            user_id: null,
            userName: "",
          }}
          onFinish={onSubmit}
        >
          {/* Device Name */}
          <Form.Item
            label="Device Name"
            name="name"
            rules={[{ required: true, message: "Device name is required" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item name="user_id">
            <Select
              style={{ width: "100%" }}
              {...selectProps}
              placeholder="User"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
