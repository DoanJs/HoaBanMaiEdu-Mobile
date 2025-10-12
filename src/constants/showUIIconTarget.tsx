import {
    AlphabetUppercase,
    ChartSquareHeart,
    Ear,
    Eye,
    Hearts,
    Light,
    PuzzleFill,
    UniversalAccess,
  } from "../assets/icons";
  import { colors } from "./colors";
  
  export const showUIIconTarget = (title: string, width?: number, height?: number) => {
    let result: any;
    switch (title) {
      case "Ngôn ngữ hiểu":
        result = (
          <Ear
            fill={colors.textBold}
            width={width ?? 80}
            height={height ?? 80}
          />
        );
        break;
      case "Ngôn ngữ diễn đạt":
        result = (
          <ChartSquareHeart
            fill={colors.textBold}
            width={width ?? 80}
            height={height ?? 80}
          />
        );
        break;
      case "Nhận thức":
        result = (
          <Light
            fill={colors.textBold}
            width={width ?? 80}
            height={height ?? 80}
          />
        );
  
        break;
      case "Vận động tinh":
        result = (
          <PuzzleFill
            fill={colors.textBold}
            width={width ?? 80}
            height={height ?? 80}
          />
        );
        break;
      case "Chỉnh âm":
        result = (
          <AlphabetUppercase
            fill={colors.textBold}
            width={width ?? 80}
            height={height ?? 80}
          />
        );
        break;
      case "Cá nhân xã hội":
        result = (
          <Hearts
            fill={colors.textBold}
            width={width ?? 80}
            height={height ?? 80}
          />
        );
        break;
      case "Hành vi":
        result = (
          <UniversalAccess
            fill={colors.textBold}
            width={width ?? 80}
            height={height ?? 80}
          />
        );
        break;
      default:
        result = (
          <Eye
            fill={colors.textBold}
            width={width ?? 80}
            height={height ?? 80}
          />
        );
        break;
    }
    return result;
  };
  