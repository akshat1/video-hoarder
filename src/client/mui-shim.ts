/*
I want to keep importing from @mui/whatever because that's what is usually
suggested in auto-complete, while also minimizing our bundle size.

So I use the specific import routes in this file, and then use webpack module
replacement plugin to replace all "@mui/whatever" imports with this file.

This does mean that we can't be importing default exports from any @mui/foo
module, and instead must use named exports from top level @mui/foo paths in
order for this scheme to work.
*/

import ClearOutlined from "@mui/icons-material/ClearOutlined";
import ExitToApp from "@mui/icons-material/ExitToApp";
import Home from "@mui/icons-material/Home";
import Settings from "@mui/icons-material/Settings";
import Autocomplete from "@mui/material/Autocomplete";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Collapse from "@mui/material/Collapse";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import LinearProgress from "@mui/material/LinearProgress";
import Link from "@mui/material/Link";
import MenuItem from "@mui/material/MenuItem";
import OutlinedInput from "@mui/material/OutlinedInput";
import Paper from "@mui/material/Paper";
import Select from "@mui/material/Select";
import { SelectChangeEvent } from "@mui/material/Select/SelectInput"; // This is no bueno as we are reaching too far into the package. but let's go with it for now.
import {
  createTheme,
  StyledEngineProvider,
  Theme,
  ThemeProvider,
} from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import { CSSProperties } from "@mui/styles";
import makeStyles from "@mui/styles/makeStyles";

export {
  Autocomplete,
  Button,
  CircularProgress,
  ClearOutlined,
  Collapse,
  Container,
  createTheme,
  CssBaseline,
  CSSProperties,
  ExitToApp,
  Home,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  LinearProgress,
  Link,
  makeStyles,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  SelectChangeEvent,
  Settings,
  StyledEngineProvider,
  TextField,
  Theme,
  ThemeProvider,
  Toolbar,
  Typography,
  useMediaQuery,
};
