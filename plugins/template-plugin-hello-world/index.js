import { configureModule as configureHello } from './hello/configureModule';
import { configureModule as configureUI } from './ui/configureModule';
import { registerHandleActions } from './core';

export default class TemplatePluginHelloWorld {
  constructor(dio) {
    configureHello(dio);
    configureUI(dio);
    const { diHelper } = dio;
    diHelper.invoke(registerHandleActions)
  }
}
