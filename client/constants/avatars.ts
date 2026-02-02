import { PartnerType } from "@/types";
import { ImageSourcePropType } from "react-native";

export const avatarImages: Record<PartnerType, ImageSourcePropType> = {
  family: require("../../assets/avatars/avatar-casual-woman.png"),
  friend: require("../../assets/avatars/avatar-casual-man.png"),
  colleague: require("../../assets/avatars/avatar-professional-man.png"),
  doctor: require("../../assets/avatars/avatar-doctor.png"),
  nurse: require("../../assets/avatars/avatar-professional-woman.png"),
  service: require("../../assets/avatars/avatar-service-worker.png"),
  stranger: require("../../assets/avatars/avatar-professional-woman.png"),
};

export const getAvatarForPartner = (
  partnerType: PartnerType,
): ImageSourcePropType => {
  return avatarImages[partnerType] || avatarImages.stranger;
};
