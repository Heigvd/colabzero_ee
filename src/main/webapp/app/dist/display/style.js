/*
 * Wegas War Manager
 * https://www.albasim.ch
 *
 * Copyright (c) 2020 School of Business and Engineering Vaud, Comem, MEI
 * Licensed under the MIT License
 */
import { css, cx } from "emotion";
export const headerStyle = css({
    backgroundColor: "#237990",
    display: "flex",
    color: "white",
    alignItems: "center"
});
export const headerItemStyle = css({
    padding: "0 5px"
});
export const headerImageStyle = css({
    width: "32px",
    height: "32px",
    padding: "10px"
});
export const headerTitleStyle = cx(headerItemStyle, css({
    flexGrow: 1,
    fontVariant: "small-caps",
    fontSize: "1.5em"
}));
export const bodyStyle = css({
    backgroundColor: "lightgrey",
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    display: "flex",
    flexDirection: "column"
});
export const cardStyle = css({
    boxShadow: "0 0 5px 1px grey",
    margin: "20px",
    width: "max-content",
    backgroundColor: "white"
});
export const containerStyle = css({
    boxShadow: "0 0 5px 1px grey",
    margin: "20px",
    width: "max-content",
    backgroundColor: "white"
});
export const containerTitleStyle = css({
    borderBottom: "1px solid gray",
    padding: "10px",
    fontSize: "1.4em"
});
export const containerContentStyle = css({
    padding: "10px"
});
export const cardTitle = css({
    fontSize: "1.4em",
    padding: "10px",
    backgroundColor: "#FB8160",
    color: "white",
    textAlign: "center"
});
export const cardContent = css({
    padding: "10px"
});
export const iconStyle = css({
    color: "grey",
    cursor: "pointer",
    paddingLeft: "5px",
    paddingRight: "5px"
});
export const disabledIconStyle = css({
    color: "lightgrey",
    cursor: "default",
    paddingLeft: "5px",
    paddingRight: "5px"
});
export const itemCard = css({
    border: "1px solid lightgrey",
    width: "max-content",
    backgroundColor: "#eaeaea",
    padding: "5px",
    margin: "5px"
});
//# sourceMappingURL=style.js.map