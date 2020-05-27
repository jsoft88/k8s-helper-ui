import { TestBed } from '@angular/core/testing';

import { K8sPersistenceVolumeService } from './k8s-persistence-volume.service';

describe('K8sPersistenceVolumeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: K8sPersistenceVolumeService = TestBed.get(K8sPersistenceVolumeService);
    expect(service).toBeTruthy();
  });
});
