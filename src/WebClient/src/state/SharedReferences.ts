class SharedRefs {
  articleHook: React.Dispatch<any> | undefined;
  articleRef: React.MutableRefObject<string> | undefined;
  constructor() {}
}

const SharedReferences = new SharedRefs();

export default SharedReferences;
