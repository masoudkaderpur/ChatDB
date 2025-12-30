import pkg from 'electron';
import { expect } from "chai";

const { BrowserWindow } = pkg;

describe("Main Process", function () {
  let mainWindow;

  before(() => {
    mainWindow = new BrowserWindow({ show: false });
  });

  after(() => {
    if (mainWindow) {
      mainWindow.destroy();
    }
  });

  it("should create a hidden main window", () => {
    expect(mainWindow.isVisible()).to.be.false;
  });

  it("should have the correct title", async () => {
    await mainWindow.loadURL("about:blank");
    const title = mainWindow.getTitle();
    expect(title).to.equal("Electron");
  });

  it("should not be null", () => {
    expect(mainWindow).to.not.be.null;
  });

  it("should have a non-zero width", () => {
    const size = mainWindow.getSize();
    expect(size[0]).to.be.greaterThan(0);
  });

  it("should be able to load a URL", async () => {
    await mainWindow.loadURL("https://www.example.com");
    const url = await mainWindow.webContents.getURL();
    expect(url).to.equal("https://www.example.com/");
  });

  it("should have a minimum size", () => {
    const size = mainWindow.getSize();
    expect(size[0]).to.be.greaterThan(100);
    expect(size[1]).to.be.greaterThan(100);
  });

  it("should be resizable", () => {
    mainWindow.setResizable(true);
    expect(mainWindow.isResizable()).to.be.true;
  });

  it("should not be resizable", () => {
    mainWindow.setResizable(false);
    expect(mainWindow.isResizable()).to.be.false;
  });
});
