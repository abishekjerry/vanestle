import { CommonColors } from "../../utils/constants/colors";
import { FontFamily, FontWeight } from "../../utils/constants/fonts";
import { Labels } from "../../utils/constants/labels";
import Typography from "@mui/material/Typography";
import React from "react";

export default function PTypography({
  flag,
  labelText = "",
  weight,
  color = CommonColors.textPrimary,
  font = "",
  marginBottom,
  onClick, 
  underline = false, 
}) {
  return (
    <Typography
      onClick={onClick}
      className={`${color === CommonColors.textPrimary ? Labels.darktext : ""}`}
      sx={{
        fontSize:
        flag === Labels.fontFlags.mainHeader
          ? Labels.fontSize.xxxl
          : flag === Labels.fontFlags.header
          ? Labels.fontSize.xl
          : flag === Labels.fontFlags.subHeader || flag === Labels.fontFlags.label
          ? Labels.fontSize.lg
          : flag === Labels.fontFlags.errorLbl || flag === Labels.fontFlags.xs
          ? Labels.fontSize.xs
          : flag === Labels.fontFlags.smallText
          ? Labels.fontSize.xxs
          : flag === Labels.fontFlags.veryVerySmallText
          ? Labels.fontSize.xxxxs
          : flag === Labels.fontFlags.normalText
          ? Labels.fontSize.sm
          : flag === "big"
          ? Labels.fontSize.xxxl
          : Labels.fontSize.sm,
        fontFamily:
          font === FontWeight.bold
            ? FontFamily.bold
            : font === FontWeight.semiBold
            ? FontFamily.semiBold
            : font === FontWeight.medium
            ? FontFamily.medium
            : font === FontWeight.upnormal
            ? FontFamily.upnormal
            : FontFamily.regular,
        fontWeight:
          weight === FontWeight.bold
            ? Labels.num_sevenHundered
            : font === FontWeight.semiBold
            ? Labels.num_sixHundred
            : font === FontWeight.medium
            ? Labels.num_fiveHundred
            : Labels.num_fourHundred,
        color: color,
        mb: marginBottom,
        cursor: onClick ? "pointer" : "default",
        textDecoration: underline ? "underline" : "none", 
        lineHeight:1.2
      }}
    >
      {labelText}
    </Typography>
  );
}
