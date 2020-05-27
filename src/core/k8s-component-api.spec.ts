import { K8sComponentApi } from './k8s-component-api';

describe('K8sComponentApi', () => {
  it('should create an instance', () => {
    expect(new K8sComponentApi()).toBeTruthy();
  });
});
