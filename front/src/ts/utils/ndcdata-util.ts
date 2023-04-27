import { ndcData, NdcSecondaryItem, NdcTertiaryItem } from "./ndcdata";

export const convertChildKeyToPrimaryKey = (key: string): string => {
  return `${key.slice(0, 1)}00`;
};

export const convertTertiaryKeyToSecondaryKey = (key: string): string => {
  return `${key.slice(0, 2)}0`;
};

export const retrieveSecondaryItemsByPrimaryKey = (primaryKey: string): NdcSecondaryItem[] => {
  return ndcData.find((primaryItem) => primaryItem.key === primaryKey)
    .children;
};
export const retrieveTertiaryItemsBySecondaryKey = (secondaryKey: string): NdcTertiaryItem[] => {
  return ndcData
    .find(
      (primaryItem) =>
        primaryItem.key === convertChildKeyToPrimaryKey(secondaryKey)
    )
    .children.find((secondaryItem) => secondaryItem.key === secondaryKey).children;
};

export const isValidSecondaryKey = (key: string, parentPrimaryKey: string): boolean => {
    const secondaryKeyReg = new RegExp(`^${parentPrimaryKey.slice(0, 1)}\\d{2}$`);
    return secondaryKeyReg.test(key)
}

export const isValidTertiaryKey = (key: string, parentSecondaryKey: string): boolean => {
    const secondaryKeyReg = new RegExp(`^${parentSecondaryKey.slice(0, 2)}\\d$`);
    return secondaryKeyReg.test(key)
}
