#!/usr/bin/env bash
#stx -I http://localhost:3999 -H http://localhost:3999 call_read_only_contract_func ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM watcher 'get-cnry-address' ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM
cnryAddress=$(curl -H "Content-Type: application/json" -H "Accept: application/json"  http://localhost:3999/v2/contracts/call-read/ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM/watcher/set-cnry-address -d '{"sender":"ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM","arguments":[]}' -s);
#curl -H "Content-Type: application/json" -H "Accept: application/json" -s http://localhost:3999/v2/contracts/call-read/ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM/watcher/get-cnry-address);
printf "%s\n" $cnryAddress
