import * as React from 'react';
import { t } from '@lingui/macro';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { truncateMiddle } from '@utils/common';
import { noneCV } from '@stacks/transactions';
import { toDate, toRelativeTime } from '@utils/time';

function createData(name: string, value: string) {
  return { name, value };
}

// index: uint,
//     cnryName: (string-utf8 32),               ;; Name, e.g., Acme Corp.
//     cnryStatement: (string-utf8 280),         ;; The published statement, e.g., Acme Corp has never received an order under Section 215 of the USA Patriot Act.
//     cnryUri: (optional (string-ascii 210)),   ;; Uri, can be used for a logo, e.g., https://example.com/logo.png
//     cnryProof: (optional (string-ascii 210)), ;; Social Proof link, e.g., https://twitter.com/acme/status/1453146247929123215
//     cnryKeeper: principal,                    ;; The Cnry owner
//     keepaliveExpiry: uint,                    ;; How long from `keepaliveTimestamp` until the Cnry expires. e.g., u31557600 (1 year in seconds)
//     keepaliveTimestamp: uint,                 ;; Timestamp of the last keepalive
//     hatchedTimestamp: uint
// ${toRelativeTime(tx.timestamp * 1000)}
const CnryMetadataTable = ({ cnry }: { cnry: any }) => {
  const hatchedDate = toDate(cnry.hatchedTimestamp.value * 1000);
  const keepaliveTimestamp = cnry.keepaliveTimestamp.value * 1000;
  const keepaliveExpiry = cnry.keepaliveExpiry.value * 1000;
  const daysRemainingUntilExpiry = toRelativeTime(keepaliveTimestamp + keepaliveExpiry);
  const expiresDate = toDate(keepaliveTimestamp + keepaliveExpiry);
  const lastKeepalive = toDate(keepaliveTimestamp);

  const rows = [
    createData('cnryName', `${cnry.cnryName.value}`),
    createData('cnryUri', `${cnry.cnryUri.value}`),
    createData('cnryProof', `${cnry.cnryProof.value}`),
    createData('cnryKeeper', `${truncateMiddle(cnry.cnryKeeper.value)}`),
    createData('Expires', `${expiresDate}`),
    createData('Last Keepalive', `${lastKeepalive}`),
    createData('Hatched', `${hatchedDate}`),
  ];

  return (
    <TableContainer component={Paper}>
      <Table size="small" sx={{ maxWidth: 290 }} aria-label="caption table">
        <caption>Cnry # {cnry.index.value} Metadata</caption>
        <TableHead>
          <TableRow>
            <TableCell>{t`Key`}</TableCell>
            <TableCell align="right">{t`Value`}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(row => (
            <TableRow key={row.name}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.value}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default CnryMetadataTable;
