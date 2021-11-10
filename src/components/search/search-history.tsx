import * as React from 'react';
import { useAtom } from 'jotai';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import StarOutlinedIcon from '@mui/icons-material/StarOutlined';
import SearchResultIcon from '@components/search/search-result-icon';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { searchHistoryAtom, searchFavoritesAtom, ResultType } from '@store/search';
import RelativeTimeFragment from '@components/relative-time-fragment';

const SearchHistory = () => {
  const [searchHistory, setSearchHistory] = useAtom(searchHistoryAtom);
  const [searchFavorites, setSearchFavorites] = useAtom(searchFavoritesAtom);

  const handleDelete = async (item: string) => {
    delete searchHistory[item];
    await setSearchHistory({ ...searchHistory });
  };

  const handleFavorite = async (item: string) => {
    const newFavoritesEntry: { [key: string]: ResultType } = {
      [item]: searchHistory[item],
    };
    await setSearchFavorites({ ...searchFavorites, ...newFavoritesEntry });
    delete searchHistory[item];
    await setSearchHistory({ ...searchHistory });
  };

  if (!!Object.keys(searchHistory).length === false) {
    return null;
  }

  return (
    <List>
      <ListSubheader>{`Recent`}</ListSubheader>
      {Object.keys(searchHistory).map(item => (
        <ListItem
          button
          key={item}
          secondaryAction={
            <React.Fragment>
              <Stack direction="row" spacing={2}>
                <IconButton
                  edge="end"
                  aria-label="open"
                  onClick={event => (window.location.href = '/search?q=' + item)}
                >
                  <OpenInNewOutlinedIcon />
                </IconButton>
                <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(item)}>
                  <DeleteOutlineOutlinedIcon />
                </IconButton>
                <IconButton edge="end" aria-label="favorite" onClick={() => handleFavorite(item)}>
                  <StarOutlinedIcon />
                </IconButton>
              </Stack>
            </React.Fragment>
          }
        >
          <ListItemIcon>
            <SearchResultIcon icon={searchHistory[item].icon} />
          </ListItemIcon>
          <ListItemText
            primary={<React.Fragment>{searchHistory[item].primary_description}</React.Fragment>}
            secondary={
              <React.Fragment>
                {searchHistory[item].secondary_description}{' '}
                <RelativeTimeFragment timestamp={searchHistory[item].timestamp} />
              </React.Fragment>
            }
          />
        </ListItem>
      ))}
    </List>
  );
};
export default SearchHistory;
