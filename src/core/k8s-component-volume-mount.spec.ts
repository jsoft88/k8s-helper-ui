import { K8sComponentVolumeMount } from './k8s-component-volume-mount';

describe('K8sComponentVolumeMount', () => {
  it('should create an instance', () => {
    expect(new K8sComponentVolumeMount()).toBeTruthy();
  });
});
