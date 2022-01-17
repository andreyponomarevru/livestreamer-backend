process.env.NODE_ENV = "test"; // supress logging

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
      // Arrange
      clientStore = new WSClientStore(new SchedulerMock());
      const user = {} as WSClient;
      const addUserSpy = jest.spyOn(clientStore, "addClient");

      // Act
      clientStore.addClient(user);

      // Assert
      expect(addUserSpy).toHaveBeenCalledWith(user);

      // Restore
      addUserSpy.mockRestore();
    });

    it("emits 'add_client' event with added client as argument", () => {
      // Arrange
      const addClientSpy = jest.fn();
      clientStore = new WSClientStore(new SchedulerMock());
      clientStore.on("add_client", addClientSpy);

      const uuid = uuidv4();
      const username = "testusername";
      const user = { uuid, username } as WSClient;

      // Act
      clientStore.addClient(user);

      // Assert
      expect(addClientSpy).toHaveBeenCalledTimes(1);
      expect(addClientSpy).toHaveBeenCalledWith({
        uuid: user.uuid,
        username: user.username,
      });
    });

    it("start emitting regular stats updates, when the first client is added to the store", () => {
      // Arrange
      const start = jest.fn((callback: () => void, interval: number) => {});
      const SchedulerMock = jest.fn(() => ({ start } as unknown as Scheduler));
      clientStore = new WSClientStore(new SchedulerMock());

      // Act
      clientStore.addClient({} as WSClient);

      // Assert
      expect(start).toBeCalled();
    });

    it("stop emitting regular stats updates, when no clients left in the store", () => {
      // Arrange
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

      // Act
      clientStore.deleteClient(user1.uuid);
      // Assert
      expect(stop).not.toBeCalled();

      // Act
      clientStore.deleteClient(user2.uuid);
      // Assert
      expect(stop).toBeCalled();
    });
  });

  describe("deleteClient method", () => {
    it("deletes client from the store by client's uuid", () => {
      // Arrange
      const clientStore = new WSClientStore(new SchedulerMock());
      const user = {} as WSClient;
      const deleteClientSpy = jest.spyOn(clientStore, "deleteClient");
      clientStore.addClient(user);

      // Act
      clientStore.deleteClient(user.uuid);

      // Assert
      expect(deleteClientSpy).toHaveBeenCalledWith(user.uuid);
      expect(clientStore.clients.length).toEqual(0);

      // Restore
      deleteClientSpy.mockRestore();
    });

    it("exits function on attempt to delete client with non-existent uuid", () => {
      // Arrange
      const clientStore = new WSClientStore(new SchedulerMock());

      // Act
      clientStore.addClient({} as WSClient);

      // Assert
      expect(clientStore.getClient("fdf")).toBeUndefined();
    });

    it("emits 'delete_client' event with client as argument when client  deleted", () => {
      // Arrange
      const clientStore = new WSClientStore(new SchedulerMock());
      const user = {
        uuid: uuidv4(),
        username: "test",
      } as WSClient;
      const deleteClientSpy = jest.fn();
      clientStore.on("delete_client", deleteClientSpy);
      clientStore.addClient(user);

      // Act
      clientStore.deleteClient(user.uuid);

      // Assert
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
      // Arrange
      clientStore = new WSClientStore(new SchedulerMock());
      const user = { uuid: uuidv4() } as WSClient;
      clientStore.addClient(user);

      // Act
      const client = clientStore.getClient(user.uuid);

      // Assert
      expect(client).toStrictEqual(user);
    });

    it("returns 'undefined' if client with the given uuid is not in the store", () => {
      // Arrange
      clientStore = new WSClientStore(new SchedulerMock());

      // Act
      const client = clientStore.getClient("test");

      // Assert
      expect(client).toBeUndefined();
    });
  });

  describe("clients getter", () => {
    it("returns all clients as an array", () => {
      // Arrange
      clientStore = new WSClientStore(new SchedulerMock());
      const client1 = { uuid: uuidv4() };
      const client2 = { uuid: uuidv4() };
      clientStore.addClient(client1 as WSClient);
      clientStore.addClient(client2 as WSClient);

      // Act
      const clients = clientStore.clients;

      // Assert
      expect(clients).toStrictEqual([client1, client2]);
    });
  });

  describe("clientCount getter", () => {
    it("returns current client count", () => {
      // Arrange
      clientStore = new WSClientStore(new SchedulerMock());
      clientStore.addClient({} as WSClient);

      // Act
      const count = clientStore.clientCount;

      // Assert
      expect(count).toEqual(1);
    });
  });

  describe("sanitizedClients getter", () => {
    it("returns array of all clients sanitized", () => {
      // Arrange
      clientStore = new WSClientStore(new SchedulerMock());
      const user1 = { username: "test", uuid: uuidv4() } as WSClient;
      const user2 = { username: "test", uuid: uuidv4() } as WSClient;
      clientStore.addClient(user1);
      clientStore.addClient(user2);

      // Act
      const sanitizedClients = clientStore.sanitizedClients;

      // Assert
      expect(sanitizedClients).toStrictEqual([user1, user2]);
    });
  });
});
