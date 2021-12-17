import * as React from 'react';
import { t } from '@lingui/macro';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ContentCopyOutlinedIcon from '@mui/icons-material/ContentCopyOutlined';
import { truncateMiddle } from '@utils/common';
import { toDate, toRelativeTime, humanizeDuration } from '@utils/time';

function createData(name: string, value: string | React.ReactFragment) {
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
  const hatchedDate = toDate(Number(cnry.hatchedTimestamp) * 1000);
  const keepaliveTimestamp = Number(cnry.keepaliveTimestamp) * 1000;
  const keepaliveExpiry = Number(cnry.keepaliveExpiry) * 1000;
  //const daysRemainingUntilExpiry = toRelativeTime(keepaliveTimestamp + keepaliveExpiry);
  const expiresDate = toDate(keepaliveTimestamp + keepaliveExpiry);
  const lastKeepalive = toDate(keepaliveTimestamp);

  const handleCopyToClipboard = ({ principal }: { principal: string }) => {
    //const uri = `${typeof window !== 'undefined' ? window.location.href.split('#')[0] : ''}${link}`;
    navigator.clipboard.writeText(principal);
  };

  const rows = [
    createData('Name', `${cnry.cnryName}`),
    createData('Uri', `${cnry.cnryUri}`),
    createData('Proof', `${cnry.cnryProof}`),
    createData(
      'Keeper',
      <React.Fragment>
        <>
          <Tooltip title={t`Copy principal to clipboard`}>
            <IconButton
              size="small"
              aria-label="copy"
              onClick={() => handleCopyToClipboard({ principal: `${cnry.cnryKeeper}` })}
            >
              <ContentCopyOutlinedIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <a rel="noreferrer" target="_blank" href={`./search/?q=${cnry.cnryKeeper}`}>
            {truncateMiddle(cnry.cnryKeeper)}
          </a>
        </>
      </React.Fragment>
    ),
    createData('Expires', `${expiresDate}`), // TODO: after expired
    createData('Updated', `${lastKeepalive}`),
    createData('Frequency', `${humanizeDuration(keepaliveExpiry)}`),
    createData('Hatched', `${hatchedDate}`),
  ];

  return (
    <TableContainer component={Paper}>
      <Table size="small" sx={{ maxWidth: 290 }} aria-label="caption table">
        <caption>Cnry # {cnry.index} Metadata</caption>
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
