import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    marginRight: "10px"
  },
  notification: {
    fontWeight: "bold",
    backgroundColor: "#3A8DFF",
    borderRadius: "100vw",
    paddingLeft: "7px",
    paddingRight: "7px",
    minWidth: "20px",
    color: "white",
  }
}));

const UnreadCount = (props) => {
    const classes = useStyles();
    const { conversation } = props;

    return (
        <div className={ classes.root }>
            { conversation.unreadMessages === 0 ? <div/> :
            <Typography align="center" className={ classes.notification }> { conversation.unreadMessages } </Typography> }
        </div>
    );
}

export default UnreadCount;