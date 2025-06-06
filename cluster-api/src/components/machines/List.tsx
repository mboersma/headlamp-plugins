import { ResourceListView } from '@kinvolk/headlamp-plugin/lib/CommonComponents';
import { Machine } from '../../resources/machine';

export function MachinesList() {
  return (
    <ResourceListView
      title="Machines"
      resourceClass={Machine}
      columns={[
        'name',
        'namespace',
        {
          id: 'nodeName',
          label: 'Node Name',
          getValue: machine => machine.status.nodeRef.name,
        },
        {
          id: 'providerID',
          label: 'Provider ID',
          getValue: item => item.spec.providerID,
        },
        {
          id: 'phase',
          label: 'Phase',
          getValue: machine => machine.status.phase,
        },
        { // TODO: mimic human-readable output of kubectl, e.g. "2d2h" ago
          id: 'age',
          label: 'Age',
          getValue: machine => machine.metadata.creationTimestamp,
        },
      ]}
    />
  );
}
