import { ipcMain } from "electron";
import { expect } from "chai";
import { spy, stub } from "sinon";

describe("IPC Communication Tests", function () {
  let eventStub;

  before(() => {
    eventStub = { reply: spy() };
  });

  it("should send 'upload-sql-file' event with file data", function () {

    const testFile = { name: "test.sql", size: 1024 };

    const ipcRendererSendStub = stub(ipcMain, "emit");

    ipcMain.emit("upload-sql-file", eventStub, testFile);

    expect(ipcRendererSendStub.calledOnce).to.be.true;
    expect(ipcRendererSendStub.calledWith("upload-sql-file", eventStub, testFile)).to.be.true;

    ipcRendererSendStub.restore();
  });
});
