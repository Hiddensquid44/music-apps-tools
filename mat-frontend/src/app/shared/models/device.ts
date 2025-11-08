export class Device {
    id: string = '';
    is_active: boolean = false;
    is_private_session: boolean = false;
    is_restricted: boolean = false;
    name: string = '';
    type: string = '';
    volume_percent: number | null = null;

  constructor(init?: Partial<Device>) {
    Object.assign(this, init);
  }
}