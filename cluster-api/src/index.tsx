import { registerKindIcon, registerMapSource, registerRoute, registerSidebarEntry } from '@kinvolk/headlamp-plugin/lib';
import { useMemo } from 'react';
import { MachineDetail } from './components/machines/Detail';
import { MachinesList } from './components/machines/List';
import { Machine } from './resources/machine';

interface ResourceRegistrationConfig {
  name: string;
  kind: string;
  path: string;
  DetailComponent: React.ComponentType<any>;
  ListComponent: React.ComponentType<any>;
  hasNamespace?: boolean;
}

function registerClusterApiResource(config: ResourceRegistrationConfig) {
  const { name, kind, path, DetailComponent, ListComponent, hasNamespace = true } = config;

  // Register sidebar entry
  registerSidebarEntry({
    name,
    url: `/cluster-api/${path}`,
    parent: 'Cluster-api',
    label: name,
  });

  // Register detail route
  registerRoute({
    path: `/cluster-api/${path}/${hasNamespace ? ':namespace/:name' : ':name'}`,
    sidebar: name,
    name: name.slice(0, -1), // Remove 's' from plural form
    component: DetailComponent,
  });

  // Register list route
  registerRoute({
    path: `/cluster-api/${path}`,
    sidebar: name,
    name,
    component: ListComponent,
  });

  // Register icon for the resource kind
  registerKindIcon(kind, {
    icon: (
      <img src="https://raw.githubusercontent.com/kubernetes-sigs/cluster-api/refs/heads/main/logos/kubernetes-cluster-logos_final-02.svg"
        alt="Cluster API Logo" />
    ),
  });
}

// Main Cluster-api sidebar entry
registerSidebarEntry({
  name: 'Cluster-api',
  url: '/cluster-api/machines',
  icon: 'mdi:certificate',
  parent: '',
  label: 'Cluster API',
});

const clusterApiResources: ResourceRegistrationConfig[] = [
  {
    name: 'Machines',
    kind: 'Machine',
    path: 'machines',
    DetailComponent: MachineDetail,
    ListComponent: MachinesList,
  },
]

// Register all CAPI resources
clusterApiResources.forEach(registerClusterApiResource);

// Register the Cluster API map source
registerMapSource({
  id: 'cluster-api',
  label: 'Cluster API',
  icon: (
    <img
      src="https://raw.githubusercontent.com/kubernetes-sigs/cluster-api/refs/heads/main/logos/kubernetes-cluster-logos_final-02.svg"
      alt="Cluster API Logo"
      style={{ width: '24px', height: '24px' }}
    />
  ),
  useData() {
    const [machines] = Machine.useList();

    return useMemo(() => {
      const nodes = [];
      // Add machines to the nodes
      machines?.forEach(it => {
        nodes.push({
          id: it.metadata.uid,
          kubeObject: it,
          detailsComponent: MachineDetail,
        });
      });

      const edges = [];
      // Add edges between any objects that have an owner reference
      for (const node of nodes) {
        if (node.kubeObject.metadata.ownerReferences) {
          node.kubeObject.metadata.ownerReferences.forEach(ownerRef => {
            const ownerNode = nodes.find(n => n.kubeObject.metadata.uid === ownerRef.uid);
            if (ownerNode) {
              edges.push({
                id: `${ownerNode.id}-${node.id}`,
                source: ownerNode.id,
                target: node.id,
                label: `owned by ${ownerRef.kind}`,
              });
            }
          });
        }
      }

      // TODO: link cluster classes to clusters via spec.topology?
      // TODO: group into control plane and worker areas somehow?

      return {
        nodes: nodes,
        edges: edges,
      };
    }, []);
  },
});
