import { makeHelloWorld } from './components';

export function configureModule(dio) {
  const { diHelper, uiHelper } = dio;



  uiHelper.putComponent('HelloWorld', diHelper.invoke(makeHelloWorld));
}
