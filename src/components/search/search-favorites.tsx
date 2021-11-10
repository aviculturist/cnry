import * as React from 'react';
import { useAtom } from 'jotai';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import OpenInNewOutlinedIcon from '@mui/icons-material/OpenInNewOutlined';
import SearchResultIcon from '@components/search/search-result-icon';
import List from '@mui/material/List';
import ListSubheader from '@mui/material/ListSubheader';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import RelativeTimeFragment from '@components/relative-time-fragment';
import { searchFavoritesAtom } from '@store/search';

const SearchFavorites = () => {
  const [searchFavorites, setSearchFavorites] = useAtom(searchFavoritesAtom);

  const handleDelete = async (item: string) => {
    delete searchFavorites[item];
    await setSearchFavorites({ ...searchFavorites });
  };

  if (!!Object.keys(searchFavorites).length === false) {
    return null;
  }

  return (
    <List>
      <ListSubheader>{`Favorites`}</ListSubheader>
      {Object.keys(searchFavorites).map(item => (
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
                <IconButton edge="start" aria-label="delete" onClick={() => handleDelete(item)}>
                  <DeleteOutlineOutlinedIcon />
                </IconButton>
              </Stack>
            </React.Fragment>
          }
        >
          <ListItemIcon>
            <SearchResultIcon icon={searchFavorites[item].icon} />
          </ListItemIcon>
          <ListItemText
            primary={<React.Fragment>{searchFavorites[item].primary_description}</React.Fragment>}
            secondary={
              <React.Fragment>
                {searchFavorites[item].secondary_description}{' '}
                <RelativeTimeFragment timestamp={searchFavorites[item].timestamp} />
              </React.Fragment>
            }
          />
        </ListItem>
      ))}
    </List>
  );
}
export default SearchFavorites;
