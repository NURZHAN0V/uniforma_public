/* Ready-made DiceBear Avataaars pack (local SVG copies) */

const AVATAR_PACK = [
  { id: "north", label: "Елена", src: "avatars/north.svg" },
  { id: "ember", label: "Дмитрий", src: "avatars/ember.svg" },
  { id: "moss", label: "Анна", src: "avatars/moss.svg" },
  { id: "sand", label: "Олег", src: "avatars/sand.svg" },
  { id: "slate", label: "Мария", src: "avatars/slate.svg" },
  { id: "violet", label: "Иван", src: "avatars/violet.svg" },
  { id: "ice", label: "София", src: "avatars/ice.svg" },
  { id: "copper", label: "Павел", src: "avatars/copper.svg" },
  { id: "pine", label: "Нина", src: "avatars/pine.svg" },
  { id: "ink", label: "Кирилл", src: "avatars/ink.svg" },
  { id: "coral", label: "Ольга", src: "avatars/coral.svg" },
  { id: "steel", label: "Алекс", src: "avatars/steel.svg" },
];

function getAvatarById(id) {
  return AVATAR_PACK.find((a) => a.id === id) || null;
}

function avatarImageHtml(avatar) {
  if (!avatar?.src) return "";
  return `<img src="${avatar.src}" alt="${avatar.label || ""}" width="80" height="80" decoding="async" />`;
}
