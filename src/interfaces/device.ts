export enum DeviceStatus {
  Offline = "offline",
  Online = "online",
}

export interface IDevice {
  id: number;
  user_id: number | null;
  name: string;
  status: DeviceStatus;
  temp: number | null;
  lux: number | null;
  humi: number | null;
  btn1: boolean;
  btn2: boolean;
  btn3: boolean;
  btn4: boolean;
  position: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}
