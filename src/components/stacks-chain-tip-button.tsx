import * as React from 'react';
import { useAtom } from 'jotai';
import Tooltip from '@mui/material/Tooltip';
import Button from '@mui/material/Button';
import { networkInfoAtom } from '@store/network-info';
import { currentStacksExplorerState, currentChainState } from '@store/current-network-state';
import ProgressIcon from '@components/progress-icon';
import { t } from '@lingui/macro';

const StacksChainTipButton = () => {
  const [networkInfo] = useAtom(networkInfoAtom);
  const [currentStacksExplorer] = useAtom(currentStacksExplorerState);
  const [currentChain] = useAtom(currentChainState);

  return (
    <Tooltip title={t`Stacks Chain Tip`}>
      <Button
        href={
          networkInfo.stacks_tip === undefined
            ? '#'
            : `${currentStacksExplorer}/block/${networkInfo.stacks_tip}?chain=${currentChain}`
        }
        target="_blank"
        startIcon={<ProgressIcon left={2} top={5} size={20} icon="stacks" />}
        variant="text"
        size="small"
        color={networkInfo.stacks_tip === undefined ? 'error' : 'success'}
      >
        {networkInfo.stacks_tip_height}
      </Button>
    </Tooltip>
  );
}
export default StacksChainTipButton;
