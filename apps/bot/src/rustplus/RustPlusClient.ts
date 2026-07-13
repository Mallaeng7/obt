import RustPlus from '@liamcottle/rustplus.js';

export class RustPlusClient {
  private rustplus: RustPlus;
  public serverId: string;

  constructor(ip: string, port: number, steamId: string, playerToken: string, serverId: string) {
    this.rustplus = new RustPlus(ip, port, steamId, playerToken);
    this.serverId = serverId;
  }

  public connect() {
    this.rustplus.connect();
  }

  public disconnect() {
    this.rustplus.disconnect();
  }

  public on(event: string, callback: (...args: any[]) => void) {
    this.rustplus.on(event, callback);
  }

  private sendRequestAsync(request: string, data?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.rustplus.sendRequestAsync(
        { [request]: data || {} },
        (message: any) => {
          if (message.response?.error) {
            reject(new Error(message.response.error.error));
          } else {
            resolve(message.response);
          }
        }
      );
    });
  }

  public async getServerInfo(): Promise<any> {
    const res = await this.sendRequestAsync('getInfo');
    return res.info;
  }

  public async getTeamInfo(): Promise<any> {
    const res = await this.sendRequestAsync('getTeamInfo');
    return res.teamInfo;
  }

  public async getMapMarkers(): Promise<any> {
    const res = await this.sendRequestAsync('getMapMarkers');
    return res.mapMarkers.markers;
  }

  public async getEntityInfo(entityId: number): Promise<any> {
    const res = await this.sendRequestAsync('getEntityInfo', { entityId });
    return res.entityInfo;
  }

  public async setEntityValue(entityId: number, value: boolean): Promise<any> {
    return await this.sendRequestAsync('setEntityValue', { entityId, value });
  }

  public async sendTeamMessage(message: string): Promise<any> {
    return await this.sendRequestAsync('sendTeamMessage', { message });
  }
}
