import { KubeObject } from '@kinvolk/headlamp-plugin/lib/k8s/cluster';
import { KubeObjectInterface } from '@kinvolk/headlamp-plugin/lib/k8s/cluster';

export interface ClusterApiMachine extends KubeObjectInterface {
  spec: {
    providerID?: string;
    version?: string;
    bootstrap?: {
      dataSecretName?: string;
    };
    infrastructureRef: {
      apiVersion: string;
      kind: string;
      name: string;
      namespace?: string;
    };
    nodeRef?: {
      apiVersion: string;
      kind: string;
      name: string;
      namespace?: string;
    };
  };
  status: {
    phase?: string;
    nodeRef?: {
      apiVersion: string;
      kind: string;
      name: string;
      namespace?: string;
    };
    addresses?: Array<{
      type: string;
      address: string;
    }>;
    conditions?: Array<{
      type: string;
      status: string;
      lastTransitionTime?: string;
      reason?: string;
      message?: string;
    }>;
  };
}

export class Machine extends KubeObject<ClusterApiMachine> {
  static readonly kind = 'Machine';
  static readonly apiName = 'machines';
  static readonly apiVersion = 'cluster.x-k8s.io/v1beta1';
  static readonly isNamespaced = true;

  get status() {
    return this.jsonData.status;
  }

  get spec() {
    return this.jsonData.spec;
  }
}
