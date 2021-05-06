import { createMuiTheme } from "@material-ui/core";
import { orange, purple, green, blue } from "@material-ui/core/colors";
const theme = createMuiTheme({
	status: {
		danger: orange[500],
	},
	palette: {
		primary: {
			main: blue[500],
		},
		secondary: {
			main: green[500],
		},
	},
});

export default theme;
