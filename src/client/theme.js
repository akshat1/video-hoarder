import _ from 'lodash';
import { createMuiTheme } from '@material-ui/core/styles';

export const getTheme = _.memoize(darkMode =>
  createMuiTheme({
    palette: {
      type: darkMode ? 'dark' : 'light',
    },
  })
);
