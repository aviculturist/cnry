import * as React from 'react';
import { t } from '@lingui/macro';
import { useAtom } from 'jotai';
import { useNetwork } from '@micro-stacks/react';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import { networkInfoAtom } from '@store/networks';
import { currentBitcoinExplorerState } from '@store/helpers';
import { DEFAULT_LOCALNET_SERVER } from '@utils/constants';
import ProgressIcon from '@components/progress-icon';
import BitcoinIcon from '@assets/bitcoin-icon';

const BitcoinBlockHeightButtonSkeleton = () => {
  return (
    <Tooltip title={t`Bitcoin Block Height`}>
      <Button
        startIcon={<BitcoinIcon />}
        variant="text"
        size="small"
        color={'success'}
      >
        ????
      </Button>
    </Tooltip>
  );
}
export { BitcoinBlockHeightButtonSkeleton };

const BitcoinBlockHeightButton = () => {
  const { network } = useNetwork();
  const [networkInfo] = useAtom(networkInfoAtom);
  const [currentBitcoinExplorer] = useAtom(currentBitcoinExplorerState);
  return (
    <Tooltip title={t`Bitcoin Block Height`}>
      <Button
        href={
          networkInfo.burn_block_height === undefined
            ? '#'
            : `${currentBitcoinExplorer}/block${
                network.getCoreApiUrl() === DEFAULT_LOCALNET_SERVER ? '-height' : ''
              }/${networkInfo.burn_block_height}`
        }
        target="_blank"
        startIcon={<ProgressIcon left={2} top={5} size={20} icon="bitcoin" />}
        variant="text"
        size="small"
        color={networkInfo.burn_block_height === undefined ? 'error' : 'success'}
      >
        {networkInfo.burn_block_height}
      </Button>
    </Tooltip>
  );
};
export { BitcoinBlockHeightButton };
