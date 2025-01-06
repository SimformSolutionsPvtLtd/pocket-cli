import AppConst from './AppConst';

/**
 * Gets the app name from the label.
 * @param {string | string[]} label - The label to get the app name.
 */
export const getApkName = (label?: string | string[]) => {
  if (Array.isArray(label)) {
    return label?.[0];
  } else if (typeof label === 'string') {
    return label;
  } else return AppConst.appDefaultName;
};
