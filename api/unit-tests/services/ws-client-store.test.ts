import { jest, describe, it, expect } from "@jest/globals";

import { v4 as uuidv4 } from "uuid";

import { WSClientStore } from "./../../src/services/ws/ws-client-store";
import { WSClient } from "./../../src/types";
import { Scheduler } from "./../../src/services/ws/scheduler";

// Helpers

const SchedulerMock = jest.fn(() => {
  return { start: jest.fn(), stop: jest.fn() } as Scheduler;
});

let clientStore: WSClientStore | undefined;

//

describe("WSClientStore class", () => {
  describe("addClient method", () => {
    it("adds new client to store", () => {
      clientStore = new WSClientStore(new SchedulerMock());
      const user = {} as WSClient;
      const addUserSpy = jest.spyOn(clientStore, "addClient");

      clientStore.addClient(user);

      expect(addUserSpy).toHaveBeenCalledWith(user);

      addUserSpy.mockRestore();
    });

    it("emits 'add_client' event with added client as argument", () => {
      const addClientSpy = jest.fn();
      clientStore = new WSClientStore(new SchedulerMock());
      clientStore.on("add_client", addClientSpy);

      const uuid = uuidv4();
      const username = "testusername";
      const user = {
        uuid,
        username,
        sanitized: { uuid, username },
      } as WSClient;

      clientStore.addClient(user);

      expect(addClientSpy).toHaveBeenCalledTimes(1);
      expect(addClientSpy).toHaveBeenCalledWith({
        client: { uuid: user.uuid, username: user.username },
      });
    });

    it("start emitting regular stats updates, when the first client is added to the store", () => {
      const start = jest.fn((callback: () => void, interval: number) => {});
      const SchedulerMock = jest.fn(() => ({ start } as unknown as Scheduler));

      clientStore = new WSClientStore(new SchedulerMock());
      clientStore.addClient({} as WSClient);

      expect(start).toBeCalled();
    });

    it("stop emitting regular stats updates, when no clients left in the store", () => {
      const start = jest.fn();
      const stop = jest.fn();
      const SchedulerMock = jest.fn(
        () => ({ start, stop } as unknown as Scheduler),
      );

      clientStore = new WSClientStore(new SchedulerMock());
      const user1 = { uuid: uuidv4() };
      const user2 = { uuid: uuidv4() };
      clientStore.addClient(user1 as WSClient);
      clientStore.addClient(user2 as WSClient);

      clientStore.deleteClient(user1.uuid);
      expect(stop).not.toBeCalled();

      clientStore.deleteClient(user2.uuid);
      expect(stop).toBeCalled();
    });
  });

  describe("deleteClient method", () => {
    it("deletes client from the store by client's uuid", () => {
      const clientStore = new WSClientStore(new SchedulerMock());
      const user = {} as WSClient;
      const deleteClientSpy = jest.spyOn(clientStore, "deleteClient");
      clientStore.addClient(user);

      clientStore.deleteClient(user.uuid);

      expect(deleteClientSpy).toHaveBeenCalledWith(user.uuid);
      expect(clientStore.clients.length).toEqual(0);

      deleteClientSpy.mockRestore();
    });

    it("exits function on attempt to delete client with non-existent uuid", () => {
      const clientStore = new WSClientStore(new SchedulerMock());
      clientStore.addClient({} as WSClient);
      expect(clientStore.getClient("fdf")).toBeUndefined();
    });

    it("emits 'delete_client' event with client as argument when client  deleted", () => {
      const clientStore = new WSClientStore(new SchedulerMock());
      const user = {
        uuid: uuidv4(),
        username: "test",
      } as WSClient;
      const deleteClientSpy = jest.fn();

      clientStore.on("delete_client", deleteClientSpy);
      clientStore.addClient(user);
      clientStore.deleteClient(user.uuid);

      expect(deleteClientSpy).toBeCalledTimes(1);
      expect(deleteClientSpy).toHaveBeenCalledWith({
        uuid: user.uuid,
        id: user.id,
        username: user.username,
      });
    });
  });

  describe("getClient method", () => {
    it("gets a client from store by uuid", () => {
      clientStore = new WSClientStore(new SchedulerMock());
      const user = { uuid: uuidv4() } as WSClient;
      clientStore.addClient(user);

      expect(clientStore.getClient(user.uuid)).toStrictEqual(user);
    });

    it("returns 'undefined' if client with the given uuid is not in the store", () => {
      clientStore = new WSClientStore(new SchedulerMock());
      const user = {} as WSClient;
      clientStore.addClient(user);

      expect(clientStore.getClient("hj")).toBeUndefined();
    });
  });

  describe("clients getter", () => {
    it("returns all clients as an array", () => {
      clientStore = new WSClientStore(new SchedulerMock());
      const client1 = { uuid: uuidv4() };
      const client2 = { uuid: uuidv4() };
      clientStore.addClient(client1 as WSClient);
      clientStore.addClient(client2 as WSClient);

      expect(clientStore.clients).toStrictEqual([client1, client2]);
    });
  });

  describe("clientCount getter", () => {
    it("returns current client count", () => {
      clientStore = new WSClientStore(new SchedulerMock());

      clientStore.addClient({} as WSClient);

      expect(clientStore.clientCount).toEqual(1);
    });
  });

  describe("sanitizedClients getter", () => {
    it("returns array of all clients sanitized", () => {
      clientStore = new WSClientStore(new SchedulerMock());

      const user1 = { uuid: uuidv4() } as WSClient;
      const user2 = { uuid: uuidv4() } as WSClient;

      clientStore.addClient(user1);
      clientStore.addClient(user2);

      expect(clientStore.clients).toStrictEqual([user1, user2]);
    });
  });
});
