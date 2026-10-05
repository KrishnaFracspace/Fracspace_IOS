// Thin wrapper keeping the old react-native-document-picker API (pick, pickSingle,
// types, isCancel) on top of @react-native-documents/picker, its successor.
// The old package uses React Native internals removed in RN 0.80.
import {
  pick as pickFiles,
  types,
  isErrorWithCode,
  errorCodes,
} from '@react-native-documents/picker';

const pick = options => pickFiles(options);

const pickSingle = async options => {
  const [file] = await pickFiles({ ...options, allowMultiSelection: false });
  return file;
};

const isCancel = err =>
  isErrorWithCode(err) && err.code === errorCodes.OPERATION_CANCELED;

export default { pick, pickSingle, types, isCancel };
