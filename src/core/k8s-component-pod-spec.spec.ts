import { K8sComponentPodSpec } from './k8s-component-pod-spec';

describe('K8sComponentPodSpec', () => {
  it('should create an instance', () => {
    expect(new K8sComponentPodSpec()).toBeTruthy();
  });
});
