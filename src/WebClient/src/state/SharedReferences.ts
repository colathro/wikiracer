import { RefObject } from "react";

class SharedRefs {
  articleHook: React.Dispatch<any> | undefined;
  articleRef: React.MutableRefObject<string> | undefined;
  scrollRef: RefObject<HTMLDivElement> | undefined;
}

const SharedReferences = new SharedRefs();

export default SharedReferences;
